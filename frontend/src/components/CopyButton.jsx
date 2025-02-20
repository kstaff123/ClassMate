import React, { useState } from 'react';

function CopyButton({ textToCopy }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowPopup(true);

      // Hide the popup after 1 second
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative inline-block">
      <button onClick={handleCopy} className="px-3 py-2 border rounded">
        Click to Copy
      </button>

      {/* Popup */}
      {showPopup && (
        <div
          className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                     px-2 py-1 bg-black text-white text-sm rounded"
        >
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="p-4">
      <CopyButton textToCopy="Hello World!" />
    </div>
  );
}
