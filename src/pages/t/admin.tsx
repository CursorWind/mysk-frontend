// Modules
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Types
import { Student } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { useRouter } from "next/router";

const StudentSection = ({
  someStudents,
}: {
  someStudents: Array<Student>;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" allowCustomSize />}
            text="Student list"
          />
        </div>
        <Search placeholder="Search student" className="[grid-area:search]" />
      </div>
      <Table>
        <thead>
          <tr>
            <th className="w-1/12">ID</th>
            <th className="w-1/12">Class</th>
            <th className="w-1/12">Class No</th>
            <th className="w-5/12">Name</th>
            <th className="w-1/12" />
          </tr>
        </thead>
        <tbody>
          {someStudents.map((student) => (
            <tr key={student.id}>
              <td>55000</td>
              <td>{student.class}</td>
              <td>{student.classNo}</td>
              <td className="!text-left">
                {nameJoiner(locale, student.name, student.prefix)}
              </td>
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="content_copy" />}
                  />
                  <Button
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="edit" />}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex flex-row items-center justify-end gap-2">
        <Button type="outlined" label="Add student" />
        <LinkButton type="filled" label="See all" url="/t/admin/students" LinkElement={Link} />
      </div>
    </Section>
  );
};

const Admin: NextPage<{ someStudents: Array<Student> }> = ({
  someStudents,
}) => {
  const { t } = useTranslation("admin");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: "Admin" }}
          pageIcon={<MaterialIcon icon="security" />}
          backGoesTo="/t/home"
          LinkElement={Link}
        />
      }
    >
      <StudentSection someStudents={someStudents} />
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const someStudents: Array<Student> = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "admin"])),
      someStudents,
    },
  };
};

export default Admin;
