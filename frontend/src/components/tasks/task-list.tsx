"use client";

import { Task, Priority } from "@/types";
import { TaskCard } from "./task-card";
import { useEffect, useState } from "react";
import { tasksService } from "@/services/tasks-service";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleRemoveFromList = (taskId: number) => {
    setTasks((list) => list.filter((task) => task.id !== taskId))
  }

  const loadTasks = async () => {
    try {
      const data = await tasksService.findAll({ page: 1, size: 20 });
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p className="text-center text-white">Carregando tarefas...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <p className="text-lg">Você não possui tarefas.</p>
        <p className="text-sm">Clique em "Nova Tarefa" para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onRemove={() => handleRemoveFromList(task.id)}
        />
      ))}
    </div>
  );
}