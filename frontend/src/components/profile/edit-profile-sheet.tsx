"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usersService } from "@/services/users-service";
import { User } from "@/types"; 

interface EditProfileSheetProps {
  profile: User | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updateProfile: User) => void;
}

export function EditProfileSheet({ profile, open, onOpenChange, onSuccess }: EditProfileSheetProps) {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setName(profile.name || "");
      setPhotoUrl(profile.photoUrl || "");
    }
  }, [open, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return; 

    try {
      setIsSaving(true);
      
      const updateProfile = await usersService.update({
        name,
        photoUrl
      });

      onSuccess(updateProfile);
      onOpenChange(false);
      
    } catch (error) {
      alert("Erro ao atualizar perfil."); 
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string = "") => {
    if (!name) return "U"; 

    const parts = name.trim().split(" ");
    
    const firstInitial = parts[0]?.[0] || "";
    
    const secondInitial = parts[1]?.[0] || "";

    return (firstInitial + secondInitial).toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-100">
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>
            Atualize seu nome e a foto de perfil.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-6 px-3">
          
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-2 border-slate-100">
              {photoUrl && (
                <AvatarImage src={photoUrl} className="object-cover" />
              )}
              <AvatarFallback className="text-2xl font-bold bg-slate-200 text-slate-600">
                {name ? getInitials(name) : "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="photoUrl">URL da Foto</Label>
            <Input 
              id="photoUrl" 
              value={photoUrl} 
              onChange={(e) => setPhotoUrl(e.target.value)} 
              placeholder="https://exemplo.com/foto.png"
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSaving} className="cursor-pointer">
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}