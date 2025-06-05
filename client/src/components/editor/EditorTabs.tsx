import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpenFile {
  id: number;
  name: string;
  path: string;
  content: string;
  isActive: boolean;
  isDirty: boolean;
}

interface EditorTabsProps {
  openFiles: OpenFile[];
  onSwitchTab: (fileId: number) => void;
  onCloseTab: (fileId: number) => void;
}

export default function EditorTabs({ openFiles, onSwitchTab, onCloseTab }: EditorTabsProps) {
  if (openFiles.length === 0) {
    return (
      <div className="h-8 bg-[#2D2D30] border-b border-[#3E3E42] flex items-center px-4">
        <span className="text-sm text-[#CCCCCC]">No files open</span>
      </div>
    );
  }

  return (
    <div className="h-8 bg-[#2D2D30] border-b border-[#3E3E42] flex items-center overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`flex items-center px-3 h-full border-r border-[#3E3E42] cursor-pointer hover:bg-[#37373D] ${
            file.isActive ? "bg-[#1E1E1E] text-white" : "text-[#CCCCCC]"
          }`}
          onClick={() => onSwitchTab(file.id)}
        >
          <span className="text-sm whitespace-nowrap">
            {file.name}
            {file.isDirty && <span className="text-orange-400 ml-1">●</span>}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-4 w-4 p-0 hover:bg-[#464647]"
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(file.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}