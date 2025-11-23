import React from "react";

const ErrorPage = ({ message }) => {
  const text = typeof message === "string" && message.trim().length > 0
    ? message
    : "An unexpected error occurred.";

  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center max-w-2xl px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default ErrorPage;