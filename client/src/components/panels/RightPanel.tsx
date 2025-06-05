import { X, Users, MessageSquare, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightPanelProps {
  projectId?: number | null;
  onClose: () => void;
}

export default function RightPanel({ projectId, onClose }: RightPanelProps) {
  return (
    <div className="w-80 bg-[#252526] border-l border-[#3E3E42] flex flex-col">
      {/* Panel Header */}
      <div className="h-8 bg-[#2D2D30] border-b border-[#3E3E42] flex items-center justify-between px-3">
        <span className="text-sm font-medium text-[#CCCCCC]">PANEL</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-[#CCCCCC] hover:bg-[#37373D]"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="collaboration" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-[#2D2D30] rounded-none border-b border-[#3E3E42]">
            <TabsTrigger value="collaboration" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Collab
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs">
              <Search className="w-3 h-3 mr-1" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collaboration" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#CCCCCC] mb-2">Online Users</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        U
                      </div>
                      <span className="text-sm text-[#CCCCCC]">You</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#CCCCCC] mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div>You opened index.js</div>
                    <div>You modified App.js</div>
                    <div>You created new file</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#CCCCCC] mb-2">Share Project</h3>
                  <Button variant="outline" size="sm" className="w-full">
                    Copy Share Link
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 text-center">
                    Chat functionality coming soon
                  </div>
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-[#3E3E42]">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3E3E42] rounded text-sm text-[#CCCCCC] placeholder-gray-500"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="flex-1 overflow-hidden m-0">
            <div className="p-4">
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Search in files..." 
                  className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3E3E42] rounded text-sm text-[#CCCCCC] placeholder-gray-500"
                />
                <div className="text-xs text-gray-400">
                  Search functionality coming soon
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}