import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white/80 backdrop-blur-sm">
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center animate-pulse">
          <h1 className="text-5xl font-bold text-slate-300 flex flex-col items-center">
            <span className="text-slate-500 block -translate-x-2">
              SUPER
            </span>
            <span className="block -translate-y-1 translate-x-2">
              TASKS
            </span>
          </h1>
        </div>

        <Loader2 className="h-15 w-15 animate-spin text-slate-600" />
      </div>
    </div>
  );
}