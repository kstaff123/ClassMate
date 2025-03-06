import { convert24hourTo12hour } from "./TimeConverter";

export function ClassTimes({ schedules }) {
  if (!schedules || schedules.length === 0) return <p>No schedule data</p>;

  const firstSchedule = schedules[0];
  const startTime = convert24hourTo12hour(firstSchedule?.start_time);
  const endTime = convert24hourTo12hour(firstSchedule?.end_time);

  return (
    <p>
      {startTime} - {endTime}
    </p>
  );
}
