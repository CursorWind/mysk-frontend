import { PostgrestError } from "@supabase/supabase-js";
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@utils/helpers/schedule";
import { supabase } from "@utils/supabaseClient";
import { ClassWNumber } from "@utils/types/class";
import { ClassroomDB } from "@utils/types/database/class";
import {
  ScheduleItemDB,
  ScheduleItemTable,
} from "@utils/types/database/schedule";
import { Role } from "@utils/types/person";
import { Schedule, SchedulePeriod } from "@utils/types/schedule";
import { db2Subject } from "./database";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective
 * @param role The role of the user getting Schedule
 * @param classID The Supabase ID of the class the user is a part of
 */
export async function getSchedule(
  role: "student",
  classID: number
): Promise<Schedule>;

/**
 * Construct a Teaching Schedule from Schedule Items from the teacher’s perspective
 * @param role The role of the user getting Schedule
 * @param teacherID The Supabase ID of the user (who should be a Teacher)
 */
export async function getSchedule(
  role: "teacher",
  teacherID: number
): Promise<Schedule>;

export async function getSchedule(role: Role, id: number): Promise<Schedule> {
  // Schedule filled with empty periods
  let schedule = createEmptySchedule(1, 5);

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from<ScheduleItemDB>("schedule_items")
    .select(
      "*, subject:subject(*), teacher:teacher(*), classroom:classroom(id,number)"
    )
    .match(
      role == "teacher"
        ? // Match teacher if role is teacher
          { teacher: id }
        : // Match classroom if role is student
          { classroom: id }
    );

  // Return an empty Schedule if fetch failed
  if (error || !data) {
    console.error(error);
    return schedule;
  }
  // Add Supabase data to empty schedule
  for (let scheduleItem of data) {
    // Remove overlapping periods from resulting Schedule
    schedule = {
      ...schedule,
      // For each row
      content: schedule.content.map((scheduleRow) => ({
        ...scheduleRow,
        content:
          // For each period
          scheduleRow.content.filter(
            (schedulePeriod) =>
              // Check for overlap
              !arePeriodsOverlapping(
                {
                  day: scheduleRow.day,
                  startTime: schedulePeriod.startTime,
                  duration: schedulePeriod.duration,
                },
                {
                  day: scheduleItem.day as Day,
                  startTime: scheduleItem.start_time,
                  duration: scheduleItem.duration,
                }
              )
          ),
      })),
    };

    schedule.content[
      schedule.content.findIndex(
        (scheduleRow) => scheduleItem.day == scheduleRow.day
      )
    ].content.push({
      startTime: scheduleItem.start_time,
      duration: scheduleItem.duration,
      subject: await db2Subject(scheduleItem.subject),
      class: scheduleItem.classroom,
      room: scheduleItem.room,
    });
  }

  console.log({ schedule });

  return schedule;
}

/**
 * Insert a Schedule Item
 * @param day The day this Schedule Period is in
 * @param schedulePeriod Frontend-side Schedule Period
 * @param subjectID The Supabase ID of the Subject taught in this Schedule Period
 * @param teacherID The Supabase ID of the Teacher teaching this Schedule Period
 */
export async function addPeriodtoSchedule(
  day: number,
  schedulePeriod: SchedulePeriod,
  subjectID: number,
  teacherID: number
): Promise<{ data: ScheduleItemTable[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .insert({
      subject: subjectID,
      teacher: teacherID,
      day,
      start_time: schedulePeriod.startTime,
      duration: schedulePeriod.duration,
      room: schedulePeriod.room,
    });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}
