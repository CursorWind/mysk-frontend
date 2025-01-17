// External libraries
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import AddTeacherDialog from "@components/dialogs/AddTeacher";

// Helpers
import { getCurrentAcademicYear } from "@utils/helpers/date";
import { nameJoiner } from "@utils/helpers/name";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import {
  ChipInputListItem,
  LangCode,
  SubmittableDialogProps,
} from "@utils/types/common";
import { Teacher } from "@utils/types/person";
import { Subject, SubjectListItem } from "@utils/types/subject";

// Miscellaneous
import { classPattern, classRegex } from "@utils/patterns";

const ConnectSubjectDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  subject,
  subjectRoom,
}: SubmittableDialogProps & {
  mode: "add" | "edit";
  subject: Subject;
  subjectRoom?: SubjectListItem;
}) => {
  const { t } = useTranslation("subjects");
  const supabase = useSupabaseClient();
  const locale = useRouter().locale as LangCode;
  const [user, session] = useTeacherAccount();

  // Dialogs
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);
  const [showAddCoTeacher, setShowAddCoTeacher] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    classroom: string;
    teachers: Teacher[];
    coTeachers?: Teacher[];
    ggcCode?: string;
    ggcLink?: string;
    ggMeetLink?: string;
  }>({
    classroom: "",
    teachers: [],
    coTeachers: [],
  });

  // Chip List control
  type ChipListsType = {
    teachers: ChipInputListItem[];
    coTeachers: ChipInputListItem[];
  };

  const [chipLists, setChipLists] = useState<ChipListsType>({
    teachers: [],
    coTeachers: [],
  });

  useEffect(() => {
    // Populate the form control with data if mode is edit
    if (mode == "edit" && subjectRoom) {
      setForm({
        classroom: subjectRoom.classroom.number.toString(),
        teachers: subjectRoom.teachers,
        coTeachers: subjectRoom.coTeachers || [],
        ggcCode: subjectRoom.ggcCode,
        ggcLink: subjectRoom.ggcLink,
        ggMeetLink: subjectRoom.ggMeetLink,
      });
      setChipLists({
        teachers: subjectRoom.teachers.map((teacher) => ({
          id: teacher.id.toString(),
          name: teacher.name[locale]?.firstName || teacher.name.th.firstName,
        })),
        coTeachers: subjectRoom.coTeachers
          ? subjectRoom.coTeachers.map((coTeacher) => ({
              id: coTeacher.id.toString(),
              name:
                coTeacher.name[locale]?.firstName ||
                coTeacher.name.th.firstName,
            }))
          : [],
      });
      // Resets form control if mode is add
    } else if (mode == "add" && user && session) {
      setForm({
        classroom: "",
        teachers: [user],
        coTeachers: [],
      });
      setChipLists({
        teachers: [
          {
            id: user.id.toString(),
            name: user.name[locale]?.firstName || user.name.th.firstName,
          },
        ],
        coTeachers: [],
      });
    } else {
      setForm({
        classroom: "",
        teachers: [],
        coTeachers: [],
      });
      setChipLists({
        teachers: [],
        coTeachers: [],
      });
    }
  }, [show, mode, subjectRoom, locale, user, session]);

  function validate(): boolean {
    // Search subject via code
    if (!subject) return false;
    if (!form.classroom || !classRegex.test(form.classroom)) return false;

    // Class access
    if (form.ggcCode && (form.ggcCode.length < 6 || form.ggcCode.length > 7))
      return false;
    if (
      form.ggcLink &&
      !form.ggcLink.match(
        /https:\/\/classroom.google.com\/c\/[a-zA-Z0-9]{16}(\?cjc=[a-z0-9]{6,7})?/
      )
    )
      return false;
    if (
      form.ggMeetLink &&
      !form.ggMeetLink.match(
        /https:\/\/meet.google.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?hs=\d{3})?/
      )
    ) {
      return false;
    }

    // Personnel
    if (form.teachers.length == 0) return false;

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const { data: classroom, error: classError } = await supabase
      .from("classroom")
      .select("id")
      .match({ number: form.classroom, year: getCurrentAcademicYear() })
      .limit(1)
      .single();

    if (classError) {
      console.error(classError);
      return;
    }

    if (mode == "add") {
      const { data: roomSubjects, error: roomSubjectsError } = await supabase
        .from("room_subjects")
        .select("*")
        .eq("class", classroom!.id)
        .contains("teacher", [user?.id])
        .eq("subject", subject.id);

      if (roomSubjectsError) {
        console.error(roomSubjectsError);
        return;
      }
      // TODO: Show a snackbar saying subject for the class already exist
      if (roomSubjects && roomSubjects.length > 0) {
        onClose();
        return;
      }

      const { error } = await supabase.from("room_subjects").insert({
        class: classroom!.id,
        subject: subject.id,
        teacher: form.teachers.map((teacher) => teacher.id),
        coteacher: form.coTeachers
          ? form.coTeachers.map((coTeacher) => coTeacher.id)
          : [],
        ggc_code: form.ggcCode ?? "",
        gg_meet_link: form.ggMeetLink ?? "",
        ggc_link: form.ggcLink ?? "",
      });

      if (error) console.error(error);
    }
    if (mode == "edit") {
      const { data: roomSubjects, error: roomSubjectsError } = await supabase
        .from("room_subjects")
        .select("*")
        .eq("class", classroom!.id)
        .contains("teacher", [user?.id])
        .eq("subject", subject.id);

      if (roomSubjectsError) {
        console.error(roomSubjectsError);
        return;
      }
      // TODO: Show a snackbar saying subject for the class does not exist
      if (roomSubjects?.length == 0 || !roomSubjects) {
        onClose();
        return;
      }

      const { error } = await supabase
        .from("room_subjects")
        .update({
          class: classroom!.id,
          subject: subject.id,
          teacher: form.teachers.map((teacher) => teacher.id),
          coteacher: form.coTeachers
            ? form.coTeachers.map((coTeacher) => coTeacher.id)
            : [],
          ggc_code: form.ggcCode ?? "",
          gg_meet_link: form.ggMeetLink ?? "",
          ggc_link: form.ggcLink ?? "",
        })
        .match({ id: subjectRoom?.id });

      if (error) console.error(error);
    }

    onSubmit();
  }

  return (
    <>
      <Dialog
        type="large"
        label="add-subject"
        title={t(`dialog.connectSubject.title.${mode}`)}
        supportingText={t("dialog.connectSubject.supportingText")}
        actions={[
          {
            name: t("dialog.connectSubject.action.cancel"),
            type: "close",
          },
          {
            name: t("dialog.connectSubject.action.save"),
            type: "submit",
            disabled: !validate(),
          },
        ]}
        show={show}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        {/* Connect subject */}
        <DialogSection
          name="connect-subject"
          title={t("dialog.connectSubject.connectSubject.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="subject-code"
            type="text"
            label={t("dialog.connectSubject.connectSubject.subjectCode")}
            helperMsg={t(
              "dialog.connectSubject.connectSubject.subjectCode_helper"
            )}
            onChange={() => {}}
            defaultValue={subject.code[locale] || subject.code.th}
            attr={{ disabled: true }}
          />
          <KeyboardInput
            name="class"
            type="text"
            label={t("dialog.connectSubject.connectSubject.class")}
            helperMsg={t("dialog.connectSubject.connectSubject.class_helper")}
            errorMsg={t("dialog.connectSubject.connectSubject.class_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, classroom: e })}
            defaultValue={
              subjectRoom ? subjectRoom.classroom.number : undefined
            }
            attr={{ pattern: classPattern }}
          />
        </DialogSection>

        {/* Class access */}
        <DialogSection
          name="class-access"
          title={t("dialog.connectSubject.classAccess.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="ggc-code"
            type="text"
            label={t("dialog.connectSubject.classAccess.ggcCode")}
            errorMsg={t("dialog.connectSubject.classAccess.ggcCode_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggcCode: e })}
            defaultValue={subjectRoom ? subjectRoom.ggcCode : undefined}
            attr={{ pattern: "[a-z0-9]{6,7}" }}
          />
          <KeyboardInput
            name="ggc-link"
            type="url"
            label={t("dialog.connectSubject.classAccess.ggcLink")}
            errorMsg={t("dialog.connectSubject.classAccess.ggcLink_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggcLink: e })}
            defaultValue={subjectRoom ? subjectRoom.ggcLink : undefined}
            className="col-span-2"
            attr={{
              pattern:
                "https://classroom.google.com/c/[a-zA-Z0-9]{16}(\\?cjc=[a-z0-9]{6,7})?",
            }}
          />
          <KeyboardInput
            name="ggc-meet"
            type="url"
            label={t("dialog.connectSubject.classAccess.ggMeetLink")}
            errorMsg={t("dialog.connectSubject.classAccess.ggMeetLink_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggMeetLink: e })}
            defaultValue={subjectRoom ? subjectRoom.ggMeetLink : undefined}
            className="col-span-2"
            attr={{
              pattern:
                "https:\\/\\/meet.google.com\\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\\?hs=\\d{3})?",
            }}
          />
        </DialogSection>

        {/* Personnel */}
        <DialogSection
          name="personnel"
          title={t("item.personnel.title")}
          isDoubleColumn
          hasNoGap
        >
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.personnel.teachers")}</h3>
            <ChipInputList
              list={chipLists.teachers}
              onAdd={() => setShowAddTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  teachers: newList as ChipInputListItem[],
                });
                setForm({
                  ...form,
                  teachers: form.teachers.filter((teacher) => {
                    teacher.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.personnel.coTeachers")}</h3>
            <ChipInputList
              list={chipLists.coTeachers}
              onAdd={() => setShowAddCoTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  coTeachers: newList as { id: string; name: string }[],
                });
                setForm({
                  ...form,
                  coTeachers: form.coTeachers
                    ? form.coTeachers.filter((coTeacher) => {
                        coTeacher.id in newList.map(({ id }) => id);
                      })
                    : [],
                });
              }}
            />
          </div>
        </DialogSection>
      </Dialog>

      {/* Dialog */}
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => setShowAddTeacher(false)}
        onSubmit={(teacher) => {
          // Close the dialog
          setShowAddTeacher(false);
          // Update the chip list
          setChipLists({
            ...chipLists,
            teachers: [
              ...chipLists.teachers,
              {
                id: teacher.id.toString(),
                name: nameJoiner(locale, teacher.name),
              },
            ],
          });
          // Update the form control
          setForm({
            ...form,
            teachers: [...form.teachers, teacher],
          });
        }}
      />
      <AddTeacherDialog
        show={showAddCoTeacher}
        onClose={() => setShowAddCoTeacher(false)}
        onSubmit={(teacher) => {
          // Close the dialog
          setShowAddCoTeacher(false);
          // Update the chip list
          setChipLists({
            ...chipLists,
            coTeachers: [
              ...chipLists.coTeachers,
              {
                id: teacher.id.toString(),
                name: nameJoiner(locale, teacher.name),
              },
            ],
          });
          // Update the form control
          setForm({
            ...form,
            coTeachers: form.coTeachers
              ? [...form.coTeachers, teacher]
              : [teacher],
          });
        }}
      />
    </>
  );
};

export default ConnectSubjectDialog;
