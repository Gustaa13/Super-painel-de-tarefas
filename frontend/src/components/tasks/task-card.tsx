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
import { ChevronDown, MoreVertical, Plus, Trash, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { tasksService } from "@/services/tasks-service";
import { Input } from "../ui/input";
import { DeleteTaskAlert } from "./delete-task-alert";
import { EditTaskDialog } from "./edit-task-dialog";

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
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isLoadingToggleCompleteRequest, setIsLoadingToggleCompleteRequest] = useState(false);

  const [taskItems, setTaskItems] = useState(task.checkList);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [isCreatingItem, setIsCreatingItem] = useState(false);

  const [currentTask, setCurrentTask] = useState(task); 
  
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;

    try {
      setIsCreatingItem(true);
      
      const createdItem = await tasksService.createItem(task.id, { 
        description: newItemText 
      });

      setTaskItems([...taskItems, createdItem]);
      
      setNewItemText("");
      setIsAddingItem(false);

    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar item.");
    } finally {
      setIsCreatingItem(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddItem();
    if (e.key === "Escape") {
        setIsAddingItem(false);
        setNewItemText("");
    }
  };

  const toggleComplete = async (checked: boolean) => {
    const previousValue = isCompleted;
    setIsCompleted(checked);

    try {
        setIsLoadingToggleCompleteRequest(true);

        await tasksService.update(task.id, {
            completed: checked,
        });

        toggleTaskItemsChecked(checked);
    } catch(error) {
        setIsCompleted(previousValue);
        alert("Erro ao completar tarefa.");
    } finally {
      setIsLoadingToggleCompleteRequest(false);
    }
  }

  const toggleTaskItemsChecked = (checked: boolean) => {
    setTaskItems((list) => list.map((item) => ({ ...item, check: checked })));
  }

  const confirmDelete = async () => {
    try {
        setIsDeleting(true);

        await tasksService.delete(currentTask.id);

        onRemove(); 
    } catch(error) {
        alert("Erro ao remover tarefa");
        setIsDeleting(false); 
        setShowDeleteAlert(false);
    }
  };

  const handleRemoveFromtaskItemsList = (itemId: number) => {
    setTaskItems((list) => list.filter((item) => item.id !== itemId));
  }

  return (
    <>
        <Collapsible
            open={isCollapseOpen}
            onOpenChange={setIsCollapseOpen}
            className={cn(
                "group rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:shadow-md",
                isCollapseOpen && "ring-1 ring-primary/20"
            )}
        >

            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-xl">
                
                    <div className="flex items-center gap-4">
                        <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                                checked={isCompleted} 
                                onCheckedChange={(value) => toggleComplete(value as boolean)}
                                disabled={isLoadingToggleCompleteRequest}
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
                                {currentTask.title}
                            </span>
                            <div className="flex taskItems-center gap-2 mt-1">
                                <Badge
                                className={cn(
                                    "text-[10px] px-2 py-0",
                                    getPriorityColor(currentTask.priority)
                                )}
                                >
                                    {currentTask.priority}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {taskItems.filter((i) => i.check).length}/
                                    {taskItems.length} itens
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="w-9 p-0 pointer-events-none"> 
                            <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform",
                                isCollapseOpen && "rotate-180"
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
                                        <DropdownMenuItem 
                                            onSelect={(e) => {
                                                e.preventDefault(); 
                                                setShowEditDialog(true);
                                            }}
                                        >
                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>

                                        <DropdownMenuItem 
                                            className="text-red-600 focus:text-red-600" 
                                            onSelect={(e) => {
                                                e.preventDefault(); 
                                                setShowDeleteAlert(true); // Abre o alerta
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

            <CollapsibleContent className="border-t bg-slate-50/50 px-4 py-3">
                <div className="space-y-1">
                    {taskItems.map((item) => (
                        <TaskItem key={item.id} item={item} onRemove={() => handleRemoveFromtaskItemsList(item.id)} />
                    ))}
                </div>

                {!isCompleted && (
                    <div className="mt-2">
                        {isAddingItem ? (

                            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                <Input
                                    value={newItemText}
                                    onChange={(e) => setNewItemText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Descreva o item..."
                                    className="h-8 text-sm bg-white"
                                    autoFocus 
                                    disabled={isCreatingItem}
                                />
                                
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 hover:bg-green-100 text-green-600"
                                    onClick={handleAddItem}
                                    disabled={isCreatingItem}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>

                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 hover:bg-red-100 text-red-600"
                                    onClick={() => setIsAddingItem(false)}
                                    disabled={isCreatingItem}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                        ) : (

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAddingItem(true)} 
                                className="w-full justify-start text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar item
                            </Button>

                        )}
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>

        <DeleteTaskAlert 
            open={showDeleteAlert} 
            onOpenChange={setShowDeleteAlert}
            onConfirm={confirmDelete}
            isDeleting={isDeleting}
        />

        <EditTaskDialog 
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            task={currentTask}
            onSuccess={(updatedTask) => setCurrentTask(updatedTask)}
        />
    </>
  );
}