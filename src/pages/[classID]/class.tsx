// Modules
import { GetStaticPaths, NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";
import { nameJoiner } from "@utils/helpers/name";
import { useRouter } from "next/router";
import { Student } from "@utils/types/person";

const ClassCounselorsSection = (): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-counselors">
      <Header
        icon={<MaterialIcon icon="group" />}
        text={t("classCounselors.title")}
      />
    </Section>
  );
};

const ContactSection = (): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" />}
        text={t("classContacts.title")}
      />
    </Section>
  );
};

const StudentListSection = (): JSX.Element => {
  const { t } = useTranslation("class");
  const locale = useRouter().locale || "";

  // Dummybase
  const studentList: Array<Student> = [
    {
      id: 248,
      role: "student",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Paniti",
          lastName: "Putpan",
        },
        th: {
          firstName: "ปณิธิ",
          lastName: "พุฒพันธ์",
        },
      },
      class: "405",
      classNo: 1,
    },
  ];

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3--header items-start">
        <Header
          icon={<MaterialIcon icon="groups" />}
          text={t("studentList.title")}
        />
        <Search placeholder={t("studentList.searchStudents")} />
      </div>
      <Table>
        <thead>
          <tr>
            <td>{t("studentList.table.number")}</td>
            <td>{t("studentList.table.name")}</td>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student) => (
            <tr key={student.id}>
              <td>{student.classNo}</td>
              <td className="!text-left">
                {nameJoiner(locale, student.name, student.prefix)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Section>
  );
};

// Page
const Class: NextPage = () => {
  const { t } = useTranslation("class");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("title") }}
          pageIcon={<MaterialIcon icon="groups" />}
          backGoesTo="/"
          LinkElement={Link}
        />
      }
    >
      <ClassCounselorsSection />
      <ContactSection />
      <StudentListSection />
    </RegularLayout>
  );
};

// TODO: This needs to be updated when we start using getStaticProps for more than translations
export const getStaticPaths: GetStaticPaths<{ classID: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "class"])),
  },
});

export default Class;
