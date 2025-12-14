import { Header } from "@/components/common/header";
import { ProtectedGuard } from "@/components/auth/protected-guard";
import Image from "next/image";
import React from "react";

export default function TaskBoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedGuard>
            <div className="min-h-screen flex flex-col">
                <div className="fixed inset-0 z-[-1]">
                    <Image
                        src="/photo-fundo.jpg" 
                        alt="Background do painel"
                        fill 
                        quality={100}
                        priority 
                        className="object-cover"
                    />
                
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                </div>

                <Header />

                <main className="flex-1 container mx-auto py-6 px-6">
                    {children}
                </main>
            </div>
        </ProtectedGuard>
    );
}