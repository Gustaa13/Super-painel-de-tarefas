"use client";

import { useState } from "react";
import { Task, Priority } from "@/types";
import { TaskItem } from "./task-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical, Plus, Trash, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { tasksService } from "@/services/tasks-service";

interface TaskCardProps {
  task: Task;
  onRemove: () => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT: return "bg-red-600 hover:bg-red-700";
    case Priority.HIGH: return "bg-orange-600 hover:bg-orange-600";
    case Priority.MEDIUM: return "bg-blue-600 hover:bg-blue-600";
    case Priority.LOW: return "bg-slate-600 hover:bg-slate-600";
    default: return "bg-slate-500";
  }
};

export function TaskCard({ task, onRemove }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async (checked: boolean) => {
    const previousValue = isCompleted;
    setIsCompleted(checked);

    try {
        setIsLoading(true);

        await tasksService.update(task.id, {
            completed: checked,
        });
    } catch(error) {
        setIsCompleted(previousValue);
        alert("Erro ao completar tarefa");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRemoveTask = async () => {
    try {
        await tasksService.delete(task.id);

        onRemove();
    } catch(error) {
        alert("Erro ao remover tarefa")
    }
  }

  return (
    <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
            "group rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:shadow-md",
            isOpen && "ring-1 ring-primary/20"
        )}
    >

        <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-xl">
            
                <div className="flex items-center gap-4">
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                            checked={isCompleted} 
                            onCheckedChange={(value) => handleToggleComplete(value as boolean)}
                            disabled={isLoading}
                            className="h-5 w-5" 
                        />
                    </div>

                    <div className="flex flex-col text-left"> 
                        <span
                            className={cn(
                            "font-semibold text-slate-800",
                            isCompleted && "line-through text-muted-foreground"
                            )}
                        >
                            {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge
                            className={cn(
                                "text-[10px] px-2 py-0",
                                getPriorityColor(task.priority)
                            )}
                            >
                                {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {task.checkList.filter((i) => i.check).length}/
                                {task.checkList.length} itens
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="w-9 p-0 pointer-events-none"> 
                        <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                        )}
                        />
                        <span className="sr-only">Toggle</span>
                    </Button>
                    {!isCompleted && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-slate-200">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600" 
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleRemoveTask();
                                    }}
                                >
                                    <Trash className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )} 
                </div>
            </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t bg-slate-50/50 px-4 py-2">
            <div className="space-y-1">
                {task.checkList.map((item) => (
                    <TaskItem key={item.id} item={item} />
                ))}
            </div>

            <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-muted-foreground hover:text-primary"
            >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar item
            </Button>
        </CollapsibleContent>
    </Collapsible>
  );
}