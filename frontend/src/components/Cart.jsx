import { useCart } from "./CartContext";
import CopyPopover from "./CopyPopover";

export function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="flex items-center text-sm font-medium w-full">
      {cart.length === 0 ? (
        <p className="my-3">No courses in cart.</p>
      ) : (
        <ul className="w-full">
          {cart.map((course) => (
            <div className="flex items-center bg-blue-400 rounded-2xl p-2 text-white my-3">
              <li
                key={course.id}
                className="flex items-center justify-between w-full"
              >
                <div className="flex flex-col w-full">
                  <div className="space-x-1 flex items-center justify-between w-full">
                    <div className="space-x-1 flex items-center">
                      <p className="text-base">{course.title}</p>
                      <p>|</p>
                      <div className="hover:text-gray-200">
                        <CopyPopover crn={course.crn} />
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 hover:text-gray-200 cursor-pointer"
                      onClick={() => removeFromCart(course.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <p>
                    {(() => {
                      const [lastName, firstName] =
                        course.instructors[0].name.split(", ");
                      return `${firstName} ${lastName}`;
                    })()}
                  </p>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
