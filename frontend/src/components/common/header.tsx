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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth-service";
import { User } from "@/types";
import { EditProfileSheet } from "../profile/edit-profile-sheet";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<User>();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    recoverProfile();
  }, []);

  const recoverProfile = async () => {
    try {
      const user = await authService.getProfile();

      setProfile(user);
    } catch(error: any) {
      alert("Erro ao recuperar perfil de usuário.");
    }
  }

  const logout = async () => {
    try {
      await authService.logout();

      router.replace("/login")
    } catch(erro: any) {
      alert("Erro ao sair da sessão.");
    }
  }

  const getInitials = (name: string = "") => {
    if (!name) return "U"; 

    const parts = name.trim().split(" ");
    
    const firstInitial = parts[0]?.[0] || "";
    
    const secondInitial = parts[1]?.[0] || "";

    return (firstInitial + secondInitial).toUpperCase();
  };

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
              href="/dashboard"
              className={cn(
                "text-sm font-semibold rounded-md py-2 px-3 hover:bg-slate-50",
                pathname === "/dashboard"
                  ? "text-slate-800"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 hidden md:block">
                {profile?.name || 'Usuário'}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-10 w-10 rounded-full cursor-pointer">
                    <Avatar>

                      {profile?.photoUrl && (
                        <AvatarImage 
                          src={profile?.photoUrl} 
                          alt={profile?.name || "Avatar do usuário"} 
                          className="object-cover"
                        />
                      )}
                      
                      <AvatarFallback className="bg-slate-600 text-white">
                        {getInitials(profile?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.name || 'Usuário'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.email || 'usuario@mail.com'}
                        </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      setIsEditProfileOpen(true)
                    }}
                  >
                    Editar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                      Sair
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <EditProfileSheet 
        profile={profile}
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSuccess={(updatedProfile) => {
          setProfile(updatedProfile)
        }}
      />
    </header>
  );
}