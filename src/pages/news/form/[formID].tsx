// External libraries
import { useState } from "react";

import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  Actions,
  Button,
  LayoutGridCols,
  Section,
} from "@suankularb-components/react";

// Components
import FormField from "@components/news/FormField";
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Backend
import { getForm, sendForm } from "@utils/backend/news/form";
import { getPersonIDFromUser } from "@utils/backend/person/person";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import {
  FormField as FormFieldType,
  FormPage as FormPageType,
} from "@utils/types/news";

type FormControlField = {
  id: number;
  value: string | number | string[] | File | null;
  required: boolean;
};

const FormPage: NextPage<{ formPage: FormPageType; personID: number }> = ({
  formPage,
  personID,
}) => {
  const { t } = useTranslation(["news", "common"]);
  const router = useRouter();
  const locale = router.locale as LangCode;

  // Form control
  const [form, setForm] = useState<FormControlField[]>(
    formPage.content.fields.map((field) => ({
      id: field.id,
      value:
        field.type == "scale"
          ? field.default
            ? Number(field.default)
            : 0
          : field.default ||
            (["short_answer", "paragraph"].includes(field.type) ? "" : null),
      required: field.required,
    }))
  );

  function updateForm(
    newValue: FormControlField["value"],
    field: FormFieldType
  ) {
    setForm(
      form.map((item) => {
        if (field.id == item.id)
          return { id: field.id, value: newValue, required: field.required };
        return item;
      })
    );
  }

  function validate(): boolean {
    if (form.find((field) => field.required && !field.value)) return false;
    return true;
  }

  async function handleSubmit() {
    if (!validate) return;

    const { error } = await sendForm(
      formPage.id,
      form.map((field) => ({ id: field.id, value: field.value })),
      personID
    );

    if (error) return;
    router.push("/news");
  }

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(formPage.content.title, locale), t)}
        </title>
      </Head>
      <NewsPageWrapper news={formPage}>
        <Section className="mt-6">
          <LayoutGridCols cols={3}>
            <div className="md:col-start-2">
              {formPage.content.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  onChange={(e) => updateForm(e, field)}
                />
              ))}
            </div>
          </LayoutGridCols>
          <Actions className="w-full">
            <Button
              label={t("pageAction.form.submit")}
              type="filled"
              onClick={handleSubmit}
              disabled={!validate()}
            />
          </Actions>
        </Section>
      </NewsPageWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await supabase.auth.getUser();
  const { data: personID } = await getPersonIDFromUser(
    supabase,
    user.user as User
  );

  if (!params?.formID) return { notFound: true };

  const { data: formPage, error } = await getForm(Number(params?.formID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      formPage,
      personID,
    },
  };
};

export default FormPage;
