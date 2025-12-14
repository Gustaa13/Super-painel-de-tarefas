"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tasksService } from "@/services/tasks-service";
import { Task, Priority } from "@/types";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedTask: Task) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onSuccess }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
        setTitle(task.title);
        setPriority(task.priority);
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSaving(true);
      const updatedTask = await tasksService.update(task.id, {
        title,
        priority
      });

      onSuccess(updatedTask); 
      onOpenChange(false);    

    } catch (error) {
      alert("Erro ao editar tarefa");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na sua tarefa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-priority">Prioridade</Label>
            <Select 
                value={priority} 
                onValueChange={(val) => setPriority(val as Priority)}
            >
              <SelectTrigger id="edit-priority" className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="LOW">Baixa</SelectItem>
                <SelectItem className="cursor-pointer" value="MEDIUM">Média</SelectItem>
                <SelectItem className="cursor-pointer" value="HIGH">Alta</SelectItem>
                <SelectItem className="cursor-pointer" value="URGENT">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                Cancelar
             </Button>
             <Button type="submit" disabled={isSaving} className="cursor-pointer">
                {isSaving ? "Salvando..." : "Salvar Alterações"}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}