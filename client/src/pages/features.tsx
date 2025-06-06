import React from "react";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-8">
      <h1 className="text-4xl font-bold mb-8 mt-8">Atlas Features</h1>
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-semibold mb-4">Cloud IDE</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Atlas is a fully cloud-based IDE, accessible from any device, anywhere. No setup, no downloads, just code instantly in your browser.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>Monaco Editor with syntax highlighting for 20+ languages</li>
          <li>Multi-tab editing and file explorer</li>
          <li>Integrated terminal with real command execution</li>
          <li>Project templates for Node.js, React, Python, and more</li>
        </ul>
      </section>
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-semibold mb-4">Real-time Collaboration</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Work together with your team in real time. See live cursors, chat, and collaborate on code instantly.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>Live cursor tracking and simultaneous editing</li>
          <li>Integrated team chat and user presence</li>
          <li>Conflict resolution and smart merge</li>
        </ul>
      </section>
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-semibold mb-4">GitHub Integration</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          All your projects and files are stored securely in your own GitHub repository. Enjoy version control, history, and easy sharing.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>Automatic commit and push for every change</li>
          <li>Branch management and project history</li>
          <li>Easy import/export to and from GitHub</li>
        </ul>
      </section>
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-semibold mb-4">Extensible & Modern</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Atlas is built with modern web technologies and is designed to be extensible for future plugins and integrations.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>VS Code-inspired UI and keyboard shortcuts</li>
          <li>Custom themes and settings</li>
          <li>Plugin system (coming soon)</li>
        </ul>
      </section>
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Your code and data are yours. Atlas never shares your data with third parties and all storage is handled via your own GitHub account.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>Private by default</li>
          <li>No tracking or ads</li>
          <li>Open source and transparent</li>
        </ul>
      </section>
      <section className="max-w-3xl w-full mb-32">
        <h2 className="text-2xl font-semibold mb-4">Why Atlas?</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Atlas is created by developers, for developers. Our mission is to make powerful, collaborative coding accessible to everyone, everywhere.
        </p>
        <ul className="list-disc ml-8 text-gray-600 dark:text-gray-400 space-y-2">
          <li>100% free for all users</li>
          <li>Created by Axion Industries</li>
          <li>Constantly improving with community feedback</li>
        </ul>
      </section>
    </div>
  );
}
