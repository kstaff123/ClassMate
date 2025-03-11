import CopyPopover from "./CopyPopover";

export function CourseTitle({ course, variant }) {
  return (
    <div className="flex items-center space-x-1 overflow-hidden">
      <p className="text-sm md:text-base truncate">{course.title}</p>
      <p>|</p>
      <div className="font-medium text-sm md:text-base">{course.subject}&nbsp;{course.class_number}</div>
      <p>|</p>
      <div className={variant === "cart" ? "hover:text-gray-300" : "hover:text-blue-400"}>
        <CopyPopover crn={course.crn} />
      </div>
    </div>
  );
}
