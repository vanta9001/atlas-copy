import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Settings, User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface TopNavigationProps {
  projectName?: string;
  projectId?: number;
  onRun?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
}

export default function TopNavigation({ 
  projectName = "Untitled Project", 
  projectId,
  onRun, 
  onStop, 
  onRestart 
}: TopNavigationProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const handleRun = async () => {
    if (!projectId) return;

    try {
      setIsRunning(true);
      const response = await fetch(`/api/projects/${projectId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(currentUser?.id || 1),
        },
      });

      if (response.ok) {
        toast({
          title: "Project started",
          description: "Your project is now running.",
        });
        if (onRun) onRun();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start project.",
        variant: "destructive",
      });
    }
  };

  const handleStop = async () => {
    if (!projectId) return;

    try {
      setIsRunning(false);
      const response = await fetch(`/api/projects/${projectId}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(currentUser?.id || 1),
        },
      });

      if (response.ok) {
        toast({
          title: "Project stopped",
          description: "Your project has been stopped.",
        });
        if (onStop) onStop();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop project.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setLocation('/auth');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="h-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {projectName}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          size="sm" 
          variant="default" 
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play className="w-4 h-4 mr-1" />
          Run
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleStop}
          disabled={!isRunning}
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
        <Button size="sm" variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Restart
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="text-sm">{currentUser?.username || 'User'}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocation('/dashboard')}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}