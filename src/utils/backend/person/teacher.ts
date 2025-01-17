// External libraries
import { SupabaseClient, User } from "@supabase/supabase-js";

// Backend
import { db2Teacher } from "@utils/backend/database";
import { createPerson } from "@utils/backend/person/person";

// Helpers
import { getCurrentAcademicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { ClassWNumber } from "@utils/types/class";
import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
  LangCode,
} from "@utils/types/common";
import { ImportedTeacherData, Teacher } from "@utils/types/person";

// Miscellaneous
import { prefixMap, subjectGroupMap } from "@utils/maps";
import { IndividualOnboardingStatus } from "@utils/types/admin";
import { nameJoiner } from "@utils/helpers/name";
import { Database } from "@utils/types/supabase";

export async function getTeacherFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<Teacher, null>> {
  const { data, error } = await supabase
    .from("teacher")
    .select("*, person(*), subject_group(*)")
    .match({ id: user.user_metadata.teacher })
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: {
      ...(await db2Teacher(supabase, data!)),
      isAdmin: user.user_metadata.isAdmin,
    },
    error: null,
  };
}

export async function createTeacher(
  supabase: DatabaseClient,
  teacher: Teacher,
  email: string,
  isAdmin: boolean = false
): Promise<BackendReturn> {
  const { data: person, error: personCreationError } = await createPerson(
    teacher
  );

  if (personCreationError) {
    console.error(personCreationError);
    return { error: personCreationError };
  }

  const { data: createdTeacher, error: teacherCreationError } = await supabase
    .from("teacher")
    .insert({
      person: person!.id,
      subject_group: teacher.subjectGroup.id,
      // class_advisor_at: form.classAdvisorAt,
      teacher_id: teacher.teacherID.trim(),
    })
    .select("id")
    .limit(1)
    .single();

  if (teacherCreationError) {
    console.error(teacherCreationError);
    // delete the created person
    await supabase.from("people").delete().match({ id: person!.id });
    return { error: teacherCreationError };
  }

  // register an account for the teacher
  await fetch("/api/account/teacher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      id: createdTeacher!.id,
      isAdmin,
    }),
  });

  return { error: null };
}

export async function deleteTeacher(
  supabase: DatabaseClient,
  teacher: Teacher
) {
  const { data: userID, error: selectingError } = await supabase
    .from("users")
    .select("id")
    .match({ teacher: teacher.id })
    .limit(1)
    .single();

  if (selectingError) {
    console.error(selectingError);
    return;
  }

  if (!userID) {
    console.error("No user found");
    return;
  }

  const { data: deletingTeacher, error: teacherDeletingError } = await supabase
    .from("teacher")
    .delete()
    .match({ id: teacher.id })
    .select("person")
    .limit(1)
    .single();

  if (teacherDeletingError) {
    console.error(teacherDeletingError);
    return;
  }
  // delete the person related to the teacher
  const { error: personDeletingError } = await supabase
    .from("people")
    .delete()
    .match({ id: deletingTeacher!.person });

  if (personDeletingError) {
    console.error(personDeletingError);
    return;
  }

  // Delete account of the teacher
  const response = await fetch(`/api/account`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userID.id }),
  });
  if (!response.ok) {
    console.error("Failed to delete account");
  }
}

export async function importTeachers(
  supabase: DatabaseClient,
  data: ImportedTeacherData[]
) {
  const teachers: { person: Teacher; email: string }[] = data.map((teacher) => {
    const person: Teacher = {
      id: 0,
      prefix: {
        th: teacher.prefix,
        "en-US": prefixMap[teacher.prefix],
      },
      role: "teacher",
      name: {
        th: {
          firstName: teacher.first_name_th,
          middleName: teacher.middle_name_th,
          lastName: teacher.last_name_th,
        },
        "en-US": {
          firstName: teacher.first_name_en,
          middleName: teacher.middle_name_en,
          lastName: teacher.last_name_en,
        },
      },
      birthdate: teacher.birthdate,
      citizenID: teacher.citizen_id.toString(),
      teacherID: teacher.teacher_id.toString(),
      contacts: [],
      subjectGroup: {
        id: subjectGroupMap[teacher.subject_group],
        name: {
          th: teacher.subject_group,
          "en-US": teacher.subject_group,
        },
      },
    };
    const email = teacher.email;
    return { person, email };
  });

  await Promise.all(
    teachers.map(
      async (teacher) =>
        await createTeacher(supabase, teacher.person, teacher.email)
    )
  );
}

export async function getTeacherList(
  supabase: DatabaseClient,
  classID: number
): Promise<Teacher[]> {
  // Get the teachers of all subjectRooms where class matches
  const { data: roomSubjects, error: roomSubjectsError } = await supabase
    .from("room_subjects")
    .select("teacher")
    .match({ class: classID });
  if (roomSubjectsError) {
    console.error(roomSubjectsError);
    return [];
  }

  // Map array of teacher IDs into array of teachers (fetch teacher in map)
  const selectedTeachers = await Promise.all(
    // Flatten the arrays into an array of teacher IDs
    roomSubjects!
      .map((roomSubject) => roomSubject.teacher)
      .flat()
      // Remove duplicates
      .filter((id, index, self) => self.indexOf(id) === index)
      // Fetch teacher data for each teacher
      .map(async (teacher_id) => {
        // Get teacher from ID
        const { data, error } = await supabase
          .from("teacher")
          .select("* ,person(*), subject_group(*)")
          .match({ id: teacher_id })
          .limit(1)
          .single();

        if (error) {
          console.error(error);
          return null;
        }

        return data;
      })
  );
  const teachers = selectedTeachers.filter((teacher) => teacher);

  return await Promise.all(
    teachers.map(async (teacher) => await db2Teacher(supabase, teacher!))
  );
}

export async function getClassAdvisorAt(
  supabase: DatabaseClient,
  teacherDBID: number
): Promise<BackendDataReturn<ClassWNumber, null>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("id, number")
    .match({ year: getCurrentAcademicYear() })
    .contains("advisors", [teacherDBID])
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: data!, error: null };
}

export async function getOnBoardTeacherData(
  supabase: DatabaseClient,
  locale: LangCode
): Promise<IndividualOnboardingStatus[]> {
  // get all teachers
  const { data: teachersData } = await (supabase as DatabaseClient)
    .from("users")
    .select("*")
    .eq("role", '"teacher"')
    .order("onboarded", { ascending: true });

  const teachers: IndividualOnboardingStatus[] = await Promise.all(
    teachersData!.map(async (teacher) => {
      const { id, onboarded } = teacher;

      // get cooresponding teacher data and their name
      const { data, error } = await supabase
        .from("teacher")
        .select("*, person(*), subject_group(*)")
        .match({ id: teacher.teacher })
        .single();

      if (error) {
        console.error(error);
      }
      const person = await db2Teacher(supabase, data!);

      return {
        id: person.id,
        passwordSet: onboarded,
        name: nameJoiner(locale, person.name),
        // TODO use validate citizen id function
        dataChecked: onboarded,
      };
    })
  );
  return teachers;
}

export async function getTeacherFromPublicUser(
  supabase: DatabaseClient,
  publicUser: Database["public"]["Tables"]["users"]["Update"]
): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from("teacher")
    .select("* ,person(*), subject_group(*)")
    .match({ id: publicUser.teacher })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return await db2Teacher(supabase, data!);
}
