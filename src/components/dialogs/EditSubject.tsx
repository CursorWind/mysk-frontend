// Modules
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  Dropdown,
  FileInput,
  KeyboardInput,
  TextArea,
} from "@suankularb-components/react";

// Components
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";
import {
  Subject,
  SubjectGroup,
  SubjectTypeEN,
  SubjectTypeTH,
} from "@utils/types/subject";
import { Teacher } from "@utils/types/person";
import { useSubjectGroupOption } from "@utils/hooks/subject";

const EditSubjectDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  subject,
}: DialogProps & {
  onSubmit: () => void;
  mode: "add" | "edit";
  subject?: Subject;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  const [showDiscard, setShowDiscard] = useState<boolean>(false);
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);
  const subjectGroups = useSubjectGroupOption();
  const subjectTypes: { th: SubjectTypeTH; "en-US": SubjectTypeEN }[] = [
    { th: "รายวิชาพื้นฐาน", "en-US": "Core Courses" },
    { th: "รายวิชาเพิ่มเติม", "en-US": "Additional Courses" },
    { th: "กิจกรรมพัฒนาผู้เรียน", "en-US": "Learner’s Development Activities" },
    { th: "รายวิชาเลือก", "en-US": "Elective Courses" },
  ];

  // Form control
  const [form, setForm] = useState<Subject>({
    id: 0,
    name: {
      "en-US": {
        name: "",
        shortName: "",
      },
      th: {
        name: "",
        shortName: "",
      },
    },
    code: {
      "en-US": "",
      th: "",
    },
    description: {
      "en-US": "",
      th: "",
    },
    teachers: [],
    coTeachers: [],
    subjectGroup: {
      id: 0,
      name: {
        "en-US": "",
        th: "",
      },
    },
    // set to 2 if month it after october but before march
    semester: new Date().getMonth() < 3 && new Date().getMonth() > 8 ? 2 : 1,
    year: new Date().getFullYear(),
    credit: 0,
    syllabus: null,
    type: {
      th: "รายวิชาพื้นฐาน",
      "en-US": "Core Courses",
    },
  });

  useEffect(() => {
    if (mode == "edit" || subject) {
      setForm({
        ...form,
        ...subject,
      });
    }
  }, [mode, subject]);

  useEffect(() => {
    if (mode == "add") {
      setForm({
        ...form,
        subjectGroup: subjectGroups ? subjectGroups[0] : form.subjectGroup,
      });
    }
  }, [mode, subjectGroups]);

  return (
    <>
      {/* {console.log(form)} */}
      <Dialog
        type="large"
        label="edit-subject"
        title="Edit subject"
        actions={[
          { name: "Cancel", type: "close" },
          { name: "Save", type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={onSubmit}
      >
        <DialogSection name="name-th" title="Local name (Thai)" isDoubleColumn>
          <KeyboardInput
            name="code-th"
            type="text"
            label="Code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, th: e } })
            }
            defaultValue={form.code.th}
          />
          <KeyboardInput
            name="name-th"
            type="text"
            label="Full name"
            onChange={(e) =>
              setForm({
                ...form,
                name: { ...form.name, th: { ...form.name.th, name: e } },
              })
            }
            defaultValue={form.name.th.name}
          />
          <KeyboardInput
            name="short-name-th"
            type="text"
            label="Short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  th: { ...form.name.th, shortName: e },
                },
              })
            }
            defaultValue={form.name.th.shortName}
          />
        </DialogSection>
        <DialogSection name="name-en" title="English name" isDoubleColumn>
          <KeyboardInput
            name="code-en"
            type="text"
            label="English code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, "en-US": e } })
            }
            defaultValue={form.code["en-US"]}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="English name"
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], name: e },
                },
              })
            }
            defaultValue={form.name["en-US"].name}
          />
          <KeyboardInput
            name="short-name-en"
            type="text"
            label="English short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], shortName: e },
                },
              })
            }
            defaultValue={form.name["en-US"].shortName}
          />
        </DialogSection>
        <DialogSection name="desc" title="Description">
          <TextArea
            name="desc-th"
            label="Local description (Thai)"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, th: e }
                  : undefined,
              })
            }
            defaultValue={form.description?.th}
          />
          <TextArea
            name="desc-en"
            label="English description"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, "en-US": e }
                  : undefined,
              })
            }
            defaultValue={form.description ? form.description["en-US"] : ""}
          />
        </DialogSection>
        <DialogSection name="school" title="School" isDoubleColumn>
          <KeyboardInput
            name="year"
            type="number"
            label="Academic year"
            helperMsg="In Buddhist Era (BE)."
            onChange={(e) => setForm({ ...form, year: Number(e) })}
            defaultValue={form.year}
            attr={{ min: 2005 }}
          />
          <KeyboardInput
            name="semester"
            type="number"
            label="Semester"
            onChange={(e) => setForm({ ...form, semester: Number(e) as 1 | 2 })}
            defaultValue={form.semester}
            attr={{ min: 1, max: 2 }}
          />
          <KeyboardInput
            name="credit"
            type="number"
            label="Credit"
            onChange={(e) => setForm({ ...form, credit: Number(e) })}
            attr={{ min: 0, step: 0.5 }}
            defaultValue={form.credit}
          />
          <FileInput
            name="syllabus"
            label="Syllabus"
            onChange={(e: File) => setForm({ ...form, syllabus: e })}
            attr={{ accept: ".pdf" }}
          />
        </DialogSection>
        <DialogSection name="category" title="Category" isDoubleColumn>
          <Dropdown
            name="subject-group"
            label="Subject group"
            options={subjectGroups.map((subjectGroup) => ({
              value: subjectGroup,
              label: subjectGroup.name[locale],
            }))}
            onChange={(e: SubjectGroup) =>
              setForm({
                ...form,
                subjectGroup: e,
              })
            }
            defaultValue={form.subjectGroup}
          />
          <Dropdown
            name="type"
            label="Subject type"
            options={subjectTypes.map((type) => ({
              value: type,
              label: type[locale],
            }))}
            onChange={(e: { th: SubjectTypeTH; "en-US": SubjectTypeEN }) =>
              setForm({
                ...form,
                type: e,
              })
            }
            defaultValue={form.type}
          />
        </DialogSection>
        <DialogSection name="personnel" title="Personnel" isDoubleColumn>
          <div className="flex flex-col gap-2">
            <p className="font-display">Teachers</p>
            <ChipInputList list={[]} onAdd={() => setShowAddTeacher(true)} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-display">Co-teachers</p>
            <ChipInputList list={[]} onAdd={() => setShowAddTeacher(true)} />
          </div>
        </DialogSection>
      </Dialog>

      {/* Dialog */}
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => setShowAddTeacher(false)}
        onSubmit={() => {
          setShowAddTeacher(false);
          // TODO: Add to Chip List
        }}
      />
    </>
  );
};

export default EditSubjectDialog;
