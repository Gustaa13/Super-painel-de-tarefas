import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskList } from "@/components/tasks/task-list";

export default function TaskBoardPage() {
    return(
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Suas Tarefas</h2>
                    <p className="text-muted-foreground shadow-black">Gerencie sua produtividade diária.</p>
                </div>
                
                <CreateTaskDialog /> 
            </div>

            <TaskList />
        </div>
    );
}