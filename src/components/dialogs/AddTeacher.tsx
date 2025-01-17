// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import { Dialog, DialogSection, Dropdown } from "@suankularb-components/react";

// Types
import { DialogProps, LangCode } from "@utils/types/common";
import { Teacher } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";
import { useTeacherOptions } from "@utils/hooks/teacher";

const AddTeacherDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (teacher: Teacher) => void }): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  const subjectGroups = useSubjectGroupOption();
  const [selectedGroup, setSelectedGroup] = useState<number>(1);

  const teachers = useTeacherOptions(selectedGroup);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(
    teachers.length > 0 ? teachers[0].id : null
  );

  useEffect(
    () => setSelectedTeacher(teachers.length > 0 ? teachers[0].id : null),
    [teachers, selectedGroup]
  );

  return (
    <Dialog
      type="regular"
      label="add-teacher"
      title={t("dialog.addTeacher.title")}
      supportingText={t("dialog.addTeacher.supportingText")}
      actions={[
        { name: t("dialog.addTeacher.action.cancel"), type: "close" },
        { name: t("dialog.addTeacher.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={() =>
        selectedTeacher &&
        onSubmit(
          teachers.find((teacher) => selectedTeacher == teacher.id) as Teacher
        )
      }
    >
      <DialogSection hasNoGap>
        <Dropdown
          name="subject-group"
          label={t("dialog.addTeacher.subjectGroup")}
          options={subjectGroups.map((group) => ({
            value: group.id,
            label: group.name[locale],
          }))}
          onChange={setSelectedGroup}
        />
        <Dropdown
          name="teacher"
          label={t("dialog.addTeacher.teacher")}
          options={teachers.map((teacher) => ({
            value: teacher.id,
            label: nameJoiner(locale, teacher.name),
          }))}
          noOptionsText={t("dialog.addTeacher.noTeachers")}
          onChange={setSelectedTeacher}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddTeacherDialog;
