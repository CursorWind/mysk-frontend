// Modules
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  SnackbarManager,
  Title,
} from "@suankularb-components/react";

// Backend
import { getInfo } from "@utils/backend/news/info";

// Components
import ArtcleEditor from "@components/news/ArticleEditor";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode, WaitingSnackbar } from "@utils/types/common";
import { NewsItemInfoNoDate } from "@utils/types/news";

// Page
const EditInfo: NextPage<{ existingData: NewsItemInfoNoDate }> = ({
  existingData,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const [snbQueue, setSnbQueue] = useState<WaitingSnackbar[]>([]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("articleEditor.title.edit"),
              subtitle: t("articleEditor.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="edit_square" />}
            backGoesTo="/t/admin/news"
            LinkElement={Link}
          />
        }
      >
        <ArtcleEditor
          existingData={existingData}
          addToSnbQueue={(newSnb) => setSnbQueue([...snbQueue, newSnb])}
        />
      </RegularLayout>
      <SnackbarManager queue={snbQueue} setQueue={setSnbQueue} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  if (!params?.infoID) return { notFound: true };

  const existingData = await getInfo(Number(params.infoID));
  if (!existingData) return { notFound: true };
  
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      existingData,
    },
  };
};

export default EditInfo;
