import { useCart } from "./CartContext";
import CopyPopover from "./CopyPopover";
import { CourseTitle } from "./CourseTitle";
import { Instructor } from "./Instructor";
import { ClassTimes } from "./ClassTimes";
import { CourseList } from "./CourseList";

export function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="flex items-center text-sm font-medium w-full">
      <CourseList courses={cart} variant="cart" />
    </div>
  );
}
