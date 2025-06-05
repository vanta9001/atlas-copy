import React from "react";
import { 
  FileText, 
  FileCode, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File as FileIcon 
} from "lucide-react";

export function getFileIcon(fileName: string, size = "w-4 h-4"): React.ReactElement {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, { icon: any; color: string }> = {
    // JavaScript/TypeScript
    js: { icon: FileCode, color: "text-yellow-400" },
    jsx: { icon: FileCode, color: "text-blue-400" },
    ts: { icon: FileCode, color: "text-blue-500" },
    tsx: { icon: FileCode, color: "text-blue-500" },
    
    // Web files
    html: { icon: FileCode, color: "text-orange-400" },
    htm: { icon: FileCode, color: "text-orange-400" },
    css: { icon: FileCode, color: "text-purple-400" },
    scss: { icon: FileCode, color: "text-pink-400" },
    sass: { icon: FileCode, color: "text-pink-400" },
    less: { icon: FileCode, color: "text-purple-400" },
    
    // Data files
    json: { icon: FileCode, color: "text-green-400" },
    xml: { icon: FileCode, color: "text-orange-300" },
    yaml: { icon: FileCode, color: "text-red-400" },
    yml: { icon: FileCode, color: "text-red-400" },
    
    // Documentation
    md: { icon: FileText, color: "text-blue-300" },
    txt: { icon: FileText, color: "text-gray-400" },
    readme: { icon: FileText, color: "text-blue-300" },
    
    // Programming languages
    py: { icon: FileCode, color: "text-blue-400" },
    php: { icon: FileCode, color: "text-purple-500" },
    java: { icon: FileCode, color: "text-red-500" },
    cpp: { icon: FileCode, color: "text-blue-600" },
    c: { icon: FileCode, color: "text-blue-600" },
    go: { icon: FileCode, color: "text-cyan-400" },
    rs: { icon: FileCode, color: "text-orange-500" },
    rb: { icon: FileCode, color: "text-red-400" },
    
    // Images
    png: { icon: Image, color: "text-green-400" },
    jpg: { icon: Image, color: "text-green-400" },
    jpeg: { icon: Image, color: "text-green-400" },
    gif: { icon: Image, color: "text-green-400" },
    svg: { icon: Image, color: "text-green-400" },
    webp: { icon: Image, color: "text-green-400" },
    
    // Videos
    mp4: { icon: Video, color: "text-red-400" },
    avi: { icon: Video, color: "text-red-400" },
    mov: { icon: Video, color: "text-red-400" },
    webm: { icon: Video, color: "text-red-400" },
    
    // Audio
    mp3: { icon: Music, color: "text-purple-400" },
    wav: { icon: Music, color: "text-purple-400" },
    ogg: { icon: Music, color: "text-purple-400" },
    
    // Archives
    zip: { icon: Archive, color: "text-yellow-500" },
    tar: { icon: Archive, color: "text-yellow-500" },
    gz: { icon: Archive, color: "text-yellow-500" },
    rar: { icon: Archive, color: "text-yellow-500" },
  };
  
  const fileType = iconMap[ext || ""] || { icon: FileIcon, color: "text-gray-400" };
  const IconComponent = fileType.icon;
  
  return React.createElement(IconComponent, { className: `${size} ${fileType.color} mr-2` });
}

export function getFileLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    js: "JavaScript",
    jsx: "JavaScript React",
    ts: "TypeScript", 
    tsx: "TypeScript React",
    html: "HTML",
    htm: "HTML",
    css: "CSS",
    scss: "SCSS",
    sass: "Sass",
    less: "Less",
    json: "JSON",
    xml: "XML",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    txt: "Plain Text",
    py: "Python",
    php: "PHP",
    java: "Java",
    cpp: "C++",
    c: "C",
    go: "Go",
    rs: "Rust",
    rb: "Ruby",
    vue: "Vue",
    svelte: "Svelte",
  };
  
  return languageMap[ext || ""] || "Plain Text";
}

export function isImageFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext || '');
}

export function isVideoFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['mp4', 'avi', 'mov', 'webm', 'mkv', 'flv'].includes(ext || '');
}

export function isAudioFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext || '');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
