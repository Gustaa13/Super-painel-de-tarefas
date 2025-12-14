"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { tasksService } from "@/services/tasks-service";
import { Priority } from "@/types";

export function CreateTaskDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!title.trim()) return;

        try {
            await tasksService.create({
                title: title,      
                priority: priority  
            });
            
            setOpen(false); 
            setTitle('');
            setPriority(Priority.MEDIUM);

            window.location.reload(); 
        } catch (error) {
            alert("Erro ao criar tarefa!");
        }
    };

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="cursor-pointer">
                <Button>
                    <PlusCircle className="h-4 w-4" />
                    Nova Tarefa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        Criar Nova Tarefa
                    </DialogTitle>
                    <DialogDescription>
                        Adicione o título e a prioridade da sua tarefa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input 
                            id="title" 
                            placeholder="Ex: Comprar café..." 
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>  
                    <div className="flex justify-between items-end">
                        <div className="grid gap-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select 
                                value={priority}
                                onValueChange={(value) => setPriority(value as Priority)}
                            >
                                <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="cursor-pointer" value="LOW">Baixa</SelectItem>
                                    <SelectItem className="cursor-pointer" value="MEDIUM">Média</SelectItem>
                                    <SelectItem className="cursor-pointer" value="HIGH">Alta</SelectItem>
                                    <SelectItem className="cursor-pointer" value="URGENT">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="px-6 cursor-pointer">
                            Criar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}