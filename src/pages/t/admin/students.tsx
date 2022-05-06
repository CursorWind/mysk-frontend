// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useState } from "react";

// Supabase
import { supabase } from "@utils/supabaseClient";

// SK Components
import {
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import StudentTable from "@components/tables/StudentTable";

// Backend
import { db2Student } from "@utils/backend/database";

// Types
import { Role, Student } from "@utils/types/person";
import { PersonTable, StudentDB } from "@utils/types/database/person";
import { StudentTable as StudentTableType } from "@utils/types/database/person";
import ImportDataDialog from "@components/dialogs/ImportData";

// Page
const Students: NextPage<{ allStudents: Array<Student> }> = ({
  allStudents,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Student>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  async function handleDelete() {
    if (!editingPerson) return;

    const { data: userid, error: selectingError } = await supabase
      .from<{
        id: string;
        email: string;
        role: Role;
        student: number;
        teacher: number;
      }>("users")
      .select("id")
      .match({ student: editingPerson.id })
      .limit(1)
      .single();

    if (selectingError) {
      console.error(selectingError);
      return;
    }

    if (!userid) {
      console.error("No user found");
      return;
    }

    const { data: deleting, error } = await supabase
      .from<StudentTableType>("student")
      .delete()
      .match({ id: editingPerson.id });
    if (error || !deleting) {
      console.error(error);
      return;
    }

    // Delete the person of the student
    const { data: person, error: personDeletingError } = await supabase
      .from<PersonTable>("people")
      .delete()
      .match({ id: deleting[0].person });

    if (personDeletingError || !person) {
      console.error(personDeletingError);
      return;
    }

    // Delete account of the student
    await fetch(`/api/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userid.id,
      }),
    });

    setShowConfDel(false);
    router.replace(router.asPath);
  }

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("studentList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("studentList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("studentList.searchStudents")} />
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={() => setShowImport(true)}
              />
              <Button
                label={t("studentList.action.addStudent")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <div>
            <StudentTable
              students={allStudents}
              setShowEdit={setShowEdit}
              setEditingPerson={setEditingPerson}
              setShowConfDelStudent={setShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={() => {
          setShowImport(false);
          router.replace(router.asPath);
        }}
        columns={[
          { name: "prefix_th", type: '"เด็กชาย" | "นาย" | "นาง" | "นางสาว"' },
          { name: "prefix_en", type: '"Master" | "Mr." | "Mrs." | "Miss."' },
          { name: "first_name_th", type: "text" },
          { name: "first_name_en", type: "text" },
          { name: "middle_name_th", type: "text", optional: true },
          { name: "middle_name_en", type: "text", optional: true },
          { name: "last_name_th", type: "text" },
          { name: "last_name_en", type: "text" },
          { name: "birthdate", type: "date (YYYY-MM-DD) (in AD)" },
          { name: "citizen_id", type: "text (13-digit)" },
          { name: "student_id", type: "text (5-digit)" },
          { name: "email", type: "email" },
        ]}
      />
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={() => {
          setShowEdit(false);
          router.replace(router.asPath);
        }}
        mode="edit"
        person={editingPerson}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {
          setShowAdd(false);
          router.replace(router.asPath);
        }}
        mode="add"
        userRole="student"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        onSubmit={() => handleDelete()}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data, error } = await supabase
    .from<StudentDB>("student")
    .select(`id, std_id, people:person(*)`);

  if (error) {
    console.error(error);
  }

  // console.log(data);

  if (!data) {
    return { props: { allStudents: [] } };
  }

  const allStudents: Student[] = await Promise.all(
    data.map(async (student) => await db2Student(student))
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allStudents,
    },
  };
};

export default Students;
