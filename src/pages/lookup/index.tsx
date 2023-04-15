// External libraries
import type {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useEffect, useMemo, useState } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import DataTableHeader from "@components/data-table/DataTableHeader";
import DataTableBody from "@components/data-table/DataTableBody";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import ImportDataDialog from "@components/dialogs/ImportData";
import CopyButton from "@components/CopyButton";

// Backend
import { db2Student } from "@utils/backend/database";
import { deleteStudent, importStudents } from "@utils/backend/person/student";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { DatabaseClient, LangCode } from "@utils/types/common";
import { ImportedStudentData, Student } from "@utils/types/person";

const StudentTable = ({
  students,
  query,
  setEditingIdx,
  toggleShowEdit,
  toggleShowConfDel,
}: {
  students: Student[];
  query?: string;
  setEditingIdx: (id: number) => void;
  toggleShowEdit: () => void;
  toggleShowConfDel: () => void;
}) => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  const [globalFilter, setGlobalFilter] = useState<string>("");
  useEffect(() => setGlobalFilter(query || ""), [query]);
  
  const columns = useMemo(
    () => [
      {
        accessorKey: "studentPrev",
        header: t("studentList.table.id"),
        thClass: "w-1/12",tdClass: "!text-left",
      },

    ],
    []
  );

  //datalookup
const data =useMemo(
  () =>
    students.map((student, idx) => ({
      idx,
      studentPrev: '['+student.class.number.toString()+','+"#"+student.classNo.toString()+'] '+nameJoiner(locale, student.name)+' - ' +student.studentID.toString(),
    })),
  []
);

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (<span>
    <Table className="w-4/12" >
      <DataTableHeader
        headerGroups={getHeaderGroups()}
        //endRow={<th className="w-1/12" />}
      />
      <DataTableBody
        rowModel={getRowModel()}
        //endRow={(row) => (<td> <Actions align="center"> <CopyButton textToCopy={row.studentPrev} /> </Actions> </td> )}
      />
    </Table> 
    <Table className="fixed top-40 right-10 w-1/2 h-1/2 bg-cyan-50 rounded-md border-cyan-200">returnsometext
      </Table>
    </span>
  );
};

// Page
const Students: NextPage<{ students: Student[] }> = ({
  students,
}): JSX.Element => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { t } = useTranslation("admin");

  const [query, setQuery] = useState<string>("");

  const [showAdd, toggleShowAdd] = useToggle();
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, toggleShowConfDel] = useToggle();

  const [showEdit, toggleShowEdit] = useToggle();
  const [editingIdx, setEditingIdx] = useState<number>(-1);

  return (
    <>
      {/* Head */}
      <Head>
        <title>{createTitleStr(t("studentList.lookup"), t)}</title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("studentList.lookup") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search
              placeholder={t("studentList.searchStudents")}
              onChange={setQuery}
            />
          </div>
          <div>
            <StudentTable
              students={students}
              query={query}
              setEditingIdx={setEditingIdx}
              toggleShowEdit={toggleShowEdit}
              toggleShowConfDel={toggleShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data, error } = await (supabase as DatabaseClient)
    .from("student")
    .select("*, person(*)")
    .order("std_id", { ascending: false });

  if (error) console.error(error);
  if (!data) return { props: { students: [] } };

  const students: Student[] = (
    await Promise.all(
      data.map(async (student) => await db2Student(supabase, student))
    )
  )
    .sort((a, b) => a.classNo - b.classNo)
    .sort((a, b) => a.class.number - b.class.number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "account",
      ])),
      students,
    },
  };
};

export default Students;
