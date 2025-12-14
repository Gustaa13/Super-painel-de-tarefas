"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskItem as ITaskItem } from "@/types";
import { cn } from "@/lib/utils";
import { tasksService } from "@/services/tasks-service";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

interface TaskItemProps {
  item: ITaskItem;
  onRemove: () => void;
} 

export function TaskItem({ item, onRemove }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(item.check);
  const [isLoadingToggleCheckedRequest, setIsLoadingToggleCheckedRequest] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(item.description);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setIsChecked(item.check);
  }, [item.check]);

  const handleRemoveItem = async () => {
    try {
      await tasksService.deleteItem(item.id);

      onRemove();
    } catch(error) {
      alert("Erro ao remover item da tarefa");
    }
  }

  const toggleChecked = async (checked: boolean) => {
    const previousValue = isChecked;
    setIsChecked(checked);

    try {
      setIsLoadingToggleCheckedRequest(true);

      await tasksService.updateItem(item.id, {
        check: checked
      });
    } catch (error) {
      setIsChecked(previousValue);
      alert("Erro ao completar item.");
    } finally {
      setIsLoadingToggleCheckedRequest(false);
    }

  }

  const handleSaveDescription = async () => {
    if (!description.trim() || description === item.description) {
        setIsEditing(false);
        setDescription(item.description);
        return;
    }

    try {
        await tasksService.updateItem(item.id, {
            description: description
        });
    } catch (error) {
        alert("Erro ao atualizar descrição.");
        setDescription(item.description); 
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        handleSaveDescription();
    } else if (e.key === "Escape") {
        setIsEditing(false);
        setDescription(item.description);
    }
  };

  const handleRowClick = () => {
    if (isEditing) return;
    
    toggleChecked(!isChecked);
  };

  return (
    <div 
      onClick={handleRowClick}
      className="group cursor-pointer flex items-center justify-between py-2 hover:bg-slate-50 rounded-md px-2 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1 w-full">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isChecked}
            onCheckedChange={(value) => toggleChecked(value as boolean)} 
            disabled={isLoadingToggleCheckedRequest}
          />
        </div>

        {isEditing ? (
          <div className="flex-1 w-full" onClick={(e) => e.stopPropagation()}>
            <Input
              ref={inputRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDescription}
              onKeyDown={handleKeyDown}
              className="h-7 text-sm py-1 px-2 w-full"
            />
            </div>
        ) : (
          <label
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => {
                if (!isChecked) setIsEditing(true);
            }}
            className={cn(
                "text-sm font-medium leading-none select-none truncate",
                isChecked && "line-through text-muted-foreground",
                isChecked ? "cursor-not-allowed" : "cursor-text"
            )}
            title="Clique duas vezes para editar"
          >
            {description}
          </label>
        )}
        
      </div>

      {!isEditing && !isChecked && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveItem();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
      )}
    </div>
  );
}