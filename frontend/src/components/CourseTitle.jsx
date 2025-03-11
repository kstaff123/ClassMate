import CopyPopover from "./CopyPopover";

export function CourseTitle({ course, variant }) {
  return (
    <div className="flex items-center space-x-1 overflow-hidden">
      <p className="md:text-base text-xs sm:text-sm truncate max-w-[140px] sm:max-w-[100px] md:max-w-none">{course.title}</p>
      <p>|</p>
      <div className="font-medium md:text-base text-xs sm:text-sm truncate  md:max-w-none">{course.subject}&nbsp;{course.class_number}</div>
      <p>|</p>
      <div className={variant === "cart" ? "hover:text-gray-300 flex items-center" : "hover:text-blue-400 flex items-center"}>
        <CopyPopover crn={course.crn} />
      </div>
    </div>
  );
}
