import React from "react";

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-red-700 hover:text-red-900 font-bold"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
