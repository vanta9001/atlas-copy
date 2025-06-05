
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectModalProps {
  onClose: () => void;
}

const PROJECT_TEMPLATES = [
  { id: "blank", name: "Blank Project", description: "Start from scratch", icon: "📄" },
  { id: "react", name: "React", description: "React with Vite and TypeScript", icon: "⚛️" },
  { id: "nodejs", name: "Node.js", description: "Express server with TypeScript", icon: "🟢" },
  { id: "python", name: "Python", description: "Flask web application", icon: "🐍" },
  { id: "vue", name: "Vue.js", description: "Vue 3 with TypeScript", icon: "💚" },
  { id: "nextjs", name: "Next.js", description: "Full-stack React framework", icon: "▲" },
];

export default function ProjectModal({ onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState("new");
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProject = () => {
    if (!projectName || !selectedTemplate) return;
    
    // Here you would typically call an API to create the project
    console.log("Creating project:", { projectName, selectedTemplate, description });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Manager</DialogTitle>
          <DialogDescription>
            Create a new project or manage existing ones
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">New Project</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My awesome project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What are you building?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Template</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PROJECT_TEMPLATES.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id 
                          ? "ring-2 ring-blue-500" 
                          : ""
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{template.icon}</span>
                          <CardTitle className="text-sm">{template.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={!projectName || !selectedTemplate}
              >
                Create Project
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-2">No recent projects</h3>
              <p className="text-sm">Projects you've worked on recently will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {PROJECT_TEMPLATES.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">Template</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
