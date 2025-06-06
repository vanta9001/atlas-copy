import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
        Have questions or feedback? Reach out to the Atlas team at <a href="mailto:support@atlas.app" className="text-blue-500 underline">support@atlas.app</a>.
      </p>
    </div>
  );
}
