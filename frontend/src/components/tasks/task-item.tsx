"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskItem as ITaskItem } from "@/types";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  item: ITaskItem;
}

export function TaskItem({ item }: TaskItemProps) {
  return (
    <div className="group flex items-center justify-between py-2 hover:bg-slate-50 rounded-md px-2 transition-colors">
      <div className="flex items-center gap-3">
        <Checkbox 
            id={`item-${item.id}`} 
            checked={item.check} 
        />
        <label
          htmlFor={`item-${item.id}`}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
            item.check && "line-through text-muted-foreground" 
          )}
        >
          {item.description}
        </label>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}