// Modules
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormEvent, useState } from "react";

// SK Components
import {
  KeyboardInput,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

/**
 * Form for logging in
 */
const LoginForm = () => {
  const { t } = useTranslation("account");
  const [userID, setUserID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <form
        className="section w-full md:w-1/3"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <KeyboardInput
          name="user-id"
          type="text"
          label={t("form.userID")}
          onChange={(currentValue: string) => {
            setUserID(currentValue);
          }}
          className="w-full"
        />
        <KeyboardInput
          name="password"
          type="password"
          label={t("form.password")}
          onChange={(currentValue: string) => {
            setPassword(currentValue);
          }}
          className="w-full"
        />
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
          <Link href="/account/forgot-password">
            <a className="btn--text">{t("action.forgotPassword")}</a>
          </Link>
          <button className="btn--filled" onClick={() => router.push("/home")}>
            {t("action.logIn")}
          </button>
        </div>
      </form>
    </div>
  );
};

// Page
const Login: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["account", "common"]);

  return (
    <>
      <Head>
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon="person"
            backGoesTo="/"
            LinkElement={Link}
            className="sm:none"
            key="title"
          />
        }
      >
        <LoginForm />
      </RegularLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "account"])),
  },
});

export default Login;
