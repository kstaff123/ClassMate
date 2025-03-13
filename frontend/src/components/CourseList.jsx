import PropTypes from "prop-types";
import { CourseTitle } from "./CourseTitle";
import { Instructor } from "./Instructor";
import { useCart } from "./CartContext";
import { convert24hourTo12hour } from "./TimeConverter";

export function CourseList({ courses, variant }) {
  const { cart, addToCart, removeFromCart, courseColors } = useCart();

  const getButtonIcon = (course) => {
    const isInCart = cart.some((c) => c.id === course.id);
    return isInCart ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 hover:text-red-300 cursor-pointer transition-all"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 hover:stroke-gray-600 transition-all stroke-gray-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );
  };

  const handleCartAction = (course) => {
    const isInCart = cart.some((c) => c.id === course.id);
    isInCart ? removeFromCart(course.id) : addToCart(course);
  };

  const daysOfWeek = [
    { key: "sunday", label: "S" },
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
    { key: "saturday", label: "S" },
  ];

  return (
    <ul className="w-full">
      {courses.length === 0 ? (
        <p className="my-3 text-center">
          {variant === "cart" ? "No courses in cart." : "No courses found."}
        </p>
      ) : (
        courses.map((course) => {
          // Compute container styles per course.
          const containerStyles =
            variant === "cart"
              ? `flex flex-col rounded-lg p-3 text-white my-3 shadow-md ${
                  courseColors[course.id]
                }`
              : "p-3 border-b border-gray-200 hover:bg-gray-100 transition-all";
          return (
            <li key={course.id} className={containerStyles}>
              <div className="font-medium">
                <div className="flex items-center justify-between">
                  <CourseTitle course={course} variant={variant} />
                  <div
                    onClick={() => handleCartAction(course)}
                    className="cursor-pointer"
                  >
                    {getButtonIcon(course)}
                  </div>
                </div>

                {/* Seats and Instructor */}
                <div className="text-sm font-normal flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <p className="font-medium text-xs sm:text-sm">
                      {course.seats_available} / {course.seats_max}
                    </p>
                    {variant === "cart" ? (
                      <p className="text-xs sm:text-sm">Seats</p>
                    ) : (
                      <>
                        <p className="hidden sm:inline text-xs sm:text-sm">
                          Seats Remaining
                        </p>
                        <p className="sm:hidden text-xs sm:text-sm">Seats</p>
                      </>
                    )}
                  </div>
                  <div className="font-medium text-right max-sm:text-xs">
                    <Instructor instructors={course.instructors} />
                  </div>
                </div>

                {/* Class Schedule */}
                {course.schedules?.length > 0 ? (
                  course.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center font-normal text-xs sm:text-sm space-x-2"
                    >
                      {/* Days Display */}
                      <div className="flex items-center space-x-1">
                        {daysOfWeek.map((day) => {
                          const isActive = schedule.days?.[day.key] === true;
                          return (
                            <span
                              key={day.key}
                              className={
                                isActive
                                  ? variant === "cart"
                                    ? "text-white font-bold"
                                    : "text-gray-900 font-bold"
                                  : variant === "cart"
                                  ? "text-gray-200 font-medium"
                                  : "text-gray-400 font-medium"
                              }
                            >
                              {day.label}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-sm">|</p>
                      <p>
                        {schedule.start_time && schedule.end_time
                          ? `${convert24hourTo12hour(
                              schedule.start_time
                            )} - ${convert24hourTo12hour(schedule.end_time)}`
                          : "TBA"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm">No schedule data</p>
                )}
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  variant: PropTypes.string,
};
