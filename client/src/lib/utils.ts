import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileIcon(fileName: string, isDirectory: boolean = false): string {
  if (isDirectory) {
    return "fas fa-folder";
  }

  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return "fab fa-js-square";
    case 'ts':
    case 'tsx':
      return "fab fa-js-square"; // TypeScript icon would be ideal
    case 'html':
      return "fab fa-html5";
    case 'css':
    case 'scss':
    case 'sass':
      return "fab fa-css3-alt";
    case 'json':
      return "fas fa-file-code";
    case 'md':
      return "fab fa-markdown";
    case 'py':
      return "fab fa-python";
    case 'java':
      return "fab fa-java";
    case 'php':
      return "fab fa-php";
    case 'xml':
      return "fas fa-file-code";
    case 'yml':
    case 'yaml':
      return "fas fa-file-alt";
    case 'sql':
      return "fas fa-database";
    case 'sh':
      return "fas fa-terminal";
    case 'txt':
      return "fas fa-file-alt";
    case 'pdf':
      return "fas fa-file-pdf";
    case 'img':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return "fas fa-file-image";
    default:
      return "fas fa-file";
  }
}

export function getFileColor(fileName: string, isDirectory: boolean = false): string {
  if (isDirectory) {
    return "text-yellow-500";
  }

  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return "text-yellow-400";
    case 'ts':
    case 'tsx':
      return "text-blue-400";
    case 'html':
      return "text-orange-400";
    case 'css':
    case 'scss':
    case 'sass':
      return "text-purple-400";
    case 'json':
      return "text-green-400";
    case 'md':
      return "text-gray-400";
    case 'py':
      return "text-green-400";
    case 'java':
      return "text-red-400";
    case 'php':
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getLanguageFromExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    case 'xml':
      return 'xml';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'sh':
      return 'shell';
    default:
      return 'plaintext';
  }
}
