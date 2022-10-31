// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { BackendDataReturn } from "@utils/types/common";
import { SubjectGroupDB } from "@utils/types/database/subject";
import { SubjectGroup } from "@utils/types/subject";

export async function getSubjectGroups(): Promise<
  BackendDataReturn<SubjectGroup[]>
> {
  const { data, error } = await supabase.from("SubjectGroup").select("*");
  if (error) return { data: [], error };
  return {
    data: (data as SubjectGroupDB[]).map((subjectGroup) => ({
      id: subjectGroup.id,
      name: { th: subjectGroup.name_th, "en-US": subjectGroup.name_en },
    })),
    error: null,
  };
}
