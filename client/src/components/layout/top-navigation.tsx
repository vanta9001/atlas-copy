import { Button } from "../ui/button";
import { Play, Square, Save, FolderPlus, FileText, Folder, Users } from "lucide-react";

interface TopNavigationProps {
  onToggleLeftSidebar: () => void;
  onToggleRightPanel: () => void;
  onToggleTerminal: () => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onSave?: () => void;
  onRun?: () => void;
  onStop?: () => void;
  isRunning?: boolean;
}

export function TopNavigation({ 
  onToggleLeftSidebar,
  onToggleRightPanel, 
  onToggleTerminal,
  onNewFile,
  onNewFolder,
  onSave,
  onRun,
  onStop,
  isRunning
}: TopNavigationProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#2D2D30] border-b border-[#3C3C3C]">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleLeftSidebar}
          className="text-[#CCCCCC] hover:bg-[#3C3C3C]"
        >
          <Folder className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNewFile}
            className="text-[#CCCCCC] hover:bg-[#3C3C3C]"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNewFolder}
            className="text-[#CCCCCC] hover:bg-[#3C3C3C]"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSave}
          className="text-[#CCCCCC] hover:bg-[#3C3C3C]"
        >
          <Save className="h-4 w-4" />
        </Button>
        
        {!isRunning ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRun}
            className="text-green-400 hover:bg-[#3C3C3C]"
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onStop}
            className="text-red-400 hover:bg-[#3C3C3C]"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}

        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleRightPanel}
          className="text-[#CCCCCC] hover:bg-[#3C3C3C]"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}