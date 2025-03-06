import { CourseTitle } from "./CourseTitle";
import { Instructor } from "./Instructor";
import { ClassTimes } from "./ClassTimes";
import { useCart } from "./CartContext";

export function CourseList({ courses, variant }) {
  const { addToCart, removeFromCart } = useCart();

  // Define styles based on the variant
  const containerStyles =
    variant === "cart"
      ? "flex items-center bg-blue-400 rounded-2xl p-2 text-white my-3"
      : "p-2 border-b border-gray-100";

  const buttonIcon =
    variant === "cart" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 hover:text-gray-200 cursor-pointer"
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
        className="size-6 hover:stroke-neutral-600 transition-all ease-in-out stroke-neutral-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );

  return (
    <ul className="w-full">
      {courses.length === 0 ? (
        <p className="my-3 text-center">
          {variant === "cart" ? "No courses in cart." : "No courses found."}
        </p>
      ) : (
        courses.map((course) => (
          <li key={course.id} className={containerStyles}>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <CourseTitle course={course} />
                  <div
                    onClick={() =>
                      variant === "cart"
                        ? removeFromCart(course.id)
                        : addToCart(course)
                    }
                    className="cursor-pointer"
                  >
                    {buttonIcon}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Instructor instructors={course.instructors} />
                  <p className="text-sm">|</p>
                  <ClassTimes schedules={course.schedules} />
                </div>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
