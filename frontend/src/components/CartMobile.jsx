import "../App.css";
import { Cart } from "../components/Cart";

export function CartMobile() {
    return (
        <div className="fixed inset-0 flex backdrop-blur-md items-center justify-center z-20">
            <div className="bg-white p-6 rounded-4xl shadow-lg w-96 text-center relative min-h-[50vh]">
                <Cart />
            </div>
        </div>

    );
}