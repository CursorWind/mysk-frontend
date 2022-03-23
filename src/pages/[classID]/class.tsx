// Modules
import { GetStaticPaths, NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
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
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

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
    {
      id: 249,
      role: "student",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Chayatawn",
          lastName: "Yupattanawong",
        },
        th: {
          firstName: "ชยธร",
          lastName: "อยู่พัฒนวงศ์",
        },
      },
      class: "405",
      classNo: 2,
    },
    {
      id: 250,
      role: "student",
      prefix: "miss",
      name: {
        "en-US": {
          firstName: "Tanvin",
          lastName: "Chanchairujira",
        },
        th: {
          firstName: "ธันวิน",
          lastName: "ชาญชัยรุจิรา",
        },
      },
      class: "405",
      classNo: 3,
    },
    {
      id: 251,
      role: "student",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Thas",
          lastName: "Thasanakosol",
        },
        th: {
          firstName: "ธรรศ",
          lastName: "ทัศนโกศล",
        },
      },
      class: "405",
      classNo: 4,
    },
    {
      id: 252,
      role: "student",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Katakorn",
          lastName: "Worakittiphan",
        },
        th: {
          firstName: "กตกร",
          lastName: "วรกิตติพันธ์",
        },
      },
      class: "405",
      classNo: 5,
    },
    {
      id: 253,
      role: "student",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Rojravee",
          lastName: "Boonchokcharoensri",
        },
        th: {
          firstName: "โรจน์รวี",
          lastName: "บุญโชคเจริญศรี",
        },
      },
      class: "405",
      classNo: 6,
    },
  ];

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3--header items-start">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" />}
            text={t("studentList.title")}
          />
        </div>
        <Search
          placeholder={t("studentList.searchStudents")}
          className="[grid-area:search]"
        />
      </div>
      <div>
        <Table>
          <thead>
            <tr>
              <th className="w-24">{t("studentList.table.classNo")}</th>
              <th>{t("studentList.table.name")}</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student) => (
              <tr key={student.id}>
                <td>{student.classNo}</td>
                <td className="!text-left">
                  {nameJoiner(
                    locale,
                    student.name,
                    t(`name.prefix.${student.prefix}`, { ns: "common" }),
                    {
                      prefix: true,
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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
