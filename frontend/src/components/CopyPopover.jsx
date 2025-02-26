import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CopyPopover({ crn }) {
  const [showPopover, setShowPopover] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Controls opacity transition
  const buttonRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(crn).then(() => {
      setShowPopover(true);
      setTimeout(() => setIsVisible(true), 10); // Delay for fade-in

      // Start fade-out before unmounting
      setTimeout(() => {
        setIsVisible(false);
      }, 1200); // Fade out after 1.2s

      setTimeout(() => {
        setShowPopover(false);
      }, 1500); // Unmount popover after fade-out completes
    });
  };

  return (
    <>
      {/* CRN Button */}
      <button
        ref={buttonRef}
        onClick={handleCopy}
        className="transition-all ease-in-out cursor-pointer"
      >
        {crn}
      </button>

      {/* Popover in Portal (Prevents Overflow Issues) */}
      {showPopover &&
        createPortal(
          <div
            className={`fixed z-[99999] px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-md transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            role="tooltip"
            style={{
              top: buttonRef.current?.getBoundingClientRect().top - 30 + "px",
              left: buttonRef.current?.getBoundingClientRect().left + "px",
              transform: "translateX(-50%)",
            }}
          >
            Copied to clipboard!
          </div>,
          document.body
        )}
    </>
  );
}
