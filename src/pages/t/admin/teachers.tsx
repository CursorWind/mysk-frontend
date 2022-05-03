// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Supabase client
import { supabase } from "@utils/supabaseClient";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import TeacherTable from "@components/tables/TeacherTable";

// Types
import { Teacher } from "@utils/types/person";
import Head from "next/head";
import { db2teacher } from "@utils/backend/database";
import {
  PersonTable,
  TeacherDB,
  TeacherTable as TeacherTableType,
} from "@utils/types/database/person";

// Page
const Teachers: NextPage<{ allTeachers: Array<Teacher> }> = ({
  allTeachers,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Teacher>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  async function handleDelete() {
    // console.log(editingPerson);
    if (!editingPerson) {
      return;
    }

    const {
      data: deletingTeacher,
      error: teacherDeletingError,
    } = await supabase
      .from<TeacherTableType>("teacher")
      .delete()
      .match({ id: editingPerson.id });
    if (teacherDeletingError || !deletingTeacher) {
      console.error(teacherDeletingError);
      return;
    }

    // delete the person related to the teacher
    const {
      data: deletingPerson,
      error: personDeletingError,
    } = await supabase
      .from<PersonTable>("people")
      .delete()
      .match({ id: deletingTeacher[0].person });
    if (personDeletingError || !deletingPerson) {
      console.error(personDeletingError);
      return;
    }

    setShowConfDel(false);
    router.replace(router.asPath);
  }

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("teacherList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("teacherList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("teacherList.searchTeachers")} />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label={t("teacherList.action.addTeacher")}
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <TeacherTable
            teachers={allTeachers}
            setShowEdit={setShowEdit}
            setEditingPerson={setEditingPerson}
            setShowConfDelTeacher={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch teachers here ↓
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
        userRole="teacher"
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
    .from<TeacherDB>("teacher")
    .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)");

  if (error) {
    console.error(error);
    return { props: { allTeachers: [] } };
  }

  if (!data) {
    return { props: { allTeachers: [] } };
  }
  // console.log(data);

  const allTeachers: Teacher[] = await Promise.all(
    data.map(async (student) => await db2teacher(student))
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allTeachers,
    },
  };
};

export default Teachers;
