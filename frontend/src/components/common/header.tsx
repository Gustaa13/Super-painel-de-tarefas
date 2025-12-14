"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const user = { name: "João Paulo", initials: "JP" };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6 container mx-auto">
        
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-slate-300">
            <span className="text-slate-500 hidden md:block translate-y-1 -translate-x-2">SUPER</span>
            <span className="block -translate-y-1 translate-x-2">TASKS</span>
          </h1>
          <nav className="flex gap-2 items-center">
            <Link
              href="/task-board"
              className={cn(
                "text-sm font-semibold rounded-md py-2 px-3 hover:bg-slate-50",
                pathname === "/task-board"
                  ? "text-slate-800"
                  : "text-muted-foreground"
              )}
            >
              Painel de Tarefas
            </Link>
            <Link
              href="/test"
              className={cn(
                "text-sm font-semibold rounded-md py-2 px-3 hover:bg-slate-50",
                pathname === "/test"
                  ? "text-slate-800"
                  : "text-muted-foreground"
              )}
            >
              Teste
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 hidden md:block">
                {user.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-10 w-10 rounded-full cursor-pointer">
                    <Avatar>
                        <AvatarFallback className="bg-slate-600 text-white">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                  </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        joao@exemplo.com
                        </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                      Editar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                      Sair
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}