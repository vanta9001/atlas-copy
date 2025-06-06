import React from "react";

const sampleProjects = [
  { name: "React Starter", desc: "A modern React + Vite template.", author: "atlas-user1" },
  { name: "Node.js API", desc: "Express.js REST API boilerplate.", author: "atlas-user2" },
  { name: "Python Flask App", desc: "A simple Flask web app.", author: "atlas-user3" },
  { name: "Vue 3 Dashboard", desc: "Admin dashboard built with Vue 3.", author: "atlas-user4" },
];

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Community Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-8">
        Explore sample projects shared by the Atlas community.
      </p>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {sampleProjects.map((proj) => (
          <div key={proj.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{proj.name}</h2>
            <p className="text-gray-500 mb-2">{proj.desc}</p>
            <span className="text-xs text-gray-400">By {proj.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
