import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthVisualLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden  flex items-center justify-center">
    
      <div className="fixed inset-0 z-[-1]">
        <Image
            src="/photo-fundo.jpg" 
            alt="Background do painel"
            fill 
            quality={100}
            priority 
            className="object-cover"
        />
    
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>
      
      <div className="absolute bottom-[88%] left-[3%] sm:bottom-[80%] lg:left-[4%] lg:bottom-[50%]  z-0 select-none pointer-events-none">
        <h1 className="text-[6rem] sm:text-[9rem] lg:text-[12rem] font-black text-slate-300/50 leading-none tracking-tighter">
          SUPER
        </h1>
      </div>

      <div className="absolute top-[86%] right-[4%] sm:top-[80%] lg:top-[50%]  z-0 select-none pointer-events-none">
        <h1 className="text-[6rem] sm:text-[9rem] lg:text-[12rem] font-black text-slate-500/50 leading-none tracking-tighter">
          TASKS
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="relative">
           {children}
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Super Tasks. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}