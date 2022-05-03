import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { PersonDB, StudentTable } from "@utils/types/database/person";
import { Student } from "@utils/types/person";
import { createPerson } from "./person";


export async function createStudent(student: Student, email: string): Promise<{ data: StudentTable[] | null; error: PostgrestError | null }> {
    const { data: person, error: personCreationError } = await createPerson(student);
    if (personCreationError || !person) {
        console.error(personCreationError);
        return { data: null, error: personCreationError };
    }

    const {
        data: createdStudent,
        error: studentCreationError,
    } = await supabase.from<StudentTable>("student").insert({
        person: person[0]?.id,
        std_id: student.studentID.trim(),
    });
    if (studentCreationError || !student) {
        console.error(studentCreationError);
        // delete the created person
        await supabase
            .from<PersonDB>("people")
            .delete()
            .match({ id: person[0]?.id });
        return { data: null, error: studentCreationError };
    }
    // register an account for the student
    await supabase.auth.signUp(
        {
            email: email,
            password: student.birthdate.split("-").join(""),
        },
        {
            data: {
                student: createdStudent[0]?.id,
                role: "student",
            },
        }
    );

    return { data: createdStudent, error: null };
}