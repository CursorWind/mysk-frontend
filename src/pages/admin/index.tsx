// Modules
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Card,
  CardHeader,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

const DatabaseSection = (): JSX.Element => {
  const { t } = useTranslation("admin");
  const tables = [
    {
      icon: <MaterialIcon icon="groups" />,
      name: "student",
      url: "/admin/students",
    },
    {
      icon: <MaterialIcon icon="group" />,
      name: "teacher",
      url: "/admin/teachers",
    },
    {
      icon: <MaterialIcon icon="book" />,
      name: "subject",
      url: "/admin/subjects",
    },
    {
      icon: <MaterialIcon icon="meeting_room" />,
      name: "classroom",
      url: "/admin/classes",
    },
    {
      icon: <MaterialIcon icon="newspaper" />,
      name: "news",
      url: "/admin/news",
    },
  ];

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="database" allowCustomSize />}
        text={t("database.title")}
      />
      <ul className="layout-grid-cols-3">
        {tables.map((table) => (
          <li key={table.name} aria-labelledby={`table-${table.name}`}>
            <Link href={table.url}>
              <a aria-labelledby={`table-${table.name}`}>
                <Card type="horizontal" appearance="outlined" hasAction>
                  <CardHeader
                    icon={table.icon}
                    title={
                      <h3 id={`table-${table.name}`}>
                        {t(`database.table.${table.name}`)}
                      </h3>
                    }
                    label={<code>{table.name}</code>}
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const ScheduleSection = (): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="dashboard" allowCustomSize />}
        text={t("schedule.title")}
      />
      <ul className="layout-grid-cols-6">
        {range(6).map((grade) => (
          <li key={grade} aria-labelledby={`schedule-${grade}`}>
            <Link
              aria-labelledby={`schedule-${grade}`}
              href={`/admin/schedule/${grade + 1}`}
            >
              <a>
                <Card type="horizontal" appearance="outlined" hasAction>
                  <CardHeader
                    title={
                      <h3 id={`schedule-${grade}`}>
                        {t("schedule.gradeItem", { grade: grade + 1 })}
                      </h3>
                    }
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const Admin: NextPage = () => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="security" />}
            backGoesTo="/account"
            LinkElement={Link}
          />
        }
      >
        <DatabaseSection />
        <ScheduleSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
    },
  };
};

export default Admin;