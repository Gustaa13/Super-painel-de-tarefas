"use client";

import { SortOrder, StatusFilter, Task } from "@/types";
import { TaskCard } from "./task-card";
import { useEffect, useState } from "react";
import { tasksService } from "@/services/tasks-service";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 15; 

  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [prioritySort, setPrioritySort] = useState(false);

  useEffect(() => {
    loadTasks(page);
  }, [page, sortOrder, statusFilter, prioritySort]);

  const handleRemoveFromList = (taskId: number) => {
    setTasks((list) => list.filter((task) => task.id !== taskId))

    if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
    }
  }

  const loadTasks = async (pageNumber: number) => {
    setIsLoading(true);

    try {
      const response = await tasksService.findAll({ 
        page: pageNumber, 
        size: PAGE_SIZE,
        orderBy: sortOrder,
        status: statusFilter,
        sortByPriority: prioritySort
      });
      
      setTasks(response.data);
      setTotalPages(response.meta.lastPage);

    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    } finally {
      setIsLoading(false);
    }
  }

  const goToNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  }

  const goToPrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  }

  const handleFilterChange = (updater: () => void) => {
      setPage(1); 
      updater();
  };

  if (isLoading && page === 1) {
    return <p className="text-center text-white">Carregando tarefas...</p>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-215px)] w-full"> 

      <div className="flex-1 overflow-y-auto pr-3 space-y-4 pb-4">
        {tasks.length === 0 && !isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <p className="text-lg">Você não possui tarefas.</p>
                <p className="text-sm">Clique em "Nova Tarefa" para começar.</p>
             </div>
        ) : (
            tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onRemove={() => handleRemoveFromList(task.id)}
                />
            ))
        )}
      </div>

      <div className="flex flex-col justify-center sm:justify-between sm:flex-row">
        <div className="pt-2 border-t dark:bg-slate-950">
          <Pagination>
            <PaginationContent>
              
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goToPrevPage();
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {page > 2 && (
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(1); }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
              )}

              {page > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
              )}

              {page > 1 && (
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(page - 1); }}
                    >
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>

              {page < totalPages && (
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(page + 1); }}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
              )}

              {page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
              )}

              {page < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(totalPages); }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goToNextPage();
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex justify-center sm:justify-end pt-3 sm:pr-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                <ListFilter className="h-4 w-4" />
                Filtros e Organização
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Configurações de Visualização</h4>
                  <p className="text-sm text-muted-foreground">
                    Ajuste como suas tarefas são exibidas.
                  </p>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="sort">Ordenar por</Label>
                    <Select 
                      value={sortOrder} 
                      onValueChange={(val) => handleFilterChange(() => setSortOrder(val as SortOrder))}
                    >
                      <SelectTrigger id="sort" className="col-span-2 h-8 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="DESC">Recente</SelectItem>
                        <SelectItem className="cursor-pointer" value="ASC">Antigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Somente</Label>
                    <Select 
                      value={statusFilter} 
                      onValueChange={(val) => handleFilterChange(() => setStatusFilter(val as StatusFilter))}
                    >
                      <SelectTrigger id="status" className="col-span-2 h-8 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="ALL">Todos</SelectItem>
                        <SelectItem className="cursor-pointer" value="COMPLETED">Concluídos</SelectItem>
                        <SelectItem className="cursor-pointer" value="PENDING">Não Concluídos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2 pt-2 border-t">
                    <Label htmlFor="priority-mode" className="flex flex-col gap-1">
                      <span>Organizar por prioridade</span>
                      <span className="font-normal text-xs text-muted-foreground">Urgentes aparecem no topo</span>
                    </Label>
                    <Switch 
                      id="priority-mode" 
                      checked={prioritySort}
                      onCheckedChange={(val) => handleFilterChange(() => setPrioritySort(val))}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
  
    </div>
  );
}