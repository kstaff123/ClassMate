import { useCart } from "./CartContext";
import CopyPopover from "./CopyPopover";
import { CourseTitle } from "./CourseTitle";
import { Instructor } from "./Instructor";
import { ClassTimes } from "./ClassTimes";
import { CourseList } from "./CourseList";

export function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="flex items-start no-scrollbar p-0 text-sm font-medium lg:max-h-[70vh] max-h-[60vh] overflow-y-scroll max-lg:pt-4 rounded-2xl drop-shadow-lg">
      <CourseList courses={cart} variant="cart" />
    </div>
  );
}
