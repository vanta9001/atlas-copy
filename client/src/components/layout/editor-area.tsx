import EditorTabs from '../editor/EditorTabs';
import Monaco from '../editor/Monaco';

interface EditorAreaProps {
  openFiles?: any[];
  activeFileId?: number | null;
  onFileChange?: (fileId: number, content: string) => void;
  onCloseFile?: (fileId: number) => void;
  onSelectFile?: (fileId: number) => void;
}

export function EditorArea({
  openFiles = [],
  activeFileId,
  onFileChange,
  onCloseFile,
  onSelectFile
}: EditorAreaProps) {
  const activeFile = openFiles.find(f => f.id === activeFileId);

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E]">
      <EditorTabs
        files={openFiles}
        activeFileId={activeFileId}
        onCloseFile={onCloseFile}
        onSelectFile={onSelectFile}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <Monaco
            file={activeFile}
            onChange={(content) => onFileChange?.(activeFile.id, content)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#6A6A6A]">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Welcome to Atlas IDE</h3>
              <p className="text-sm">Open a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}