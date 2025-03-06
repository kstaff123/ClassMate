import CopyPopover from "./CopyPopover";

export function CourseTitle({ course }) {
  return (
    <div className="flex items-center space-x-1">
      <p className="text-base">{course.title}</p>
      <p>|</p>
      <div className="font-medium">{course.subject}&nbsp;{course.class_number}</div>
      <p>|</p>
      <div className="hover:text-blue-400">
        <CopyPopover crn={course.crn} />
      </div>
    </div>
  );
}
