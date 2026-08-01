"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Footer = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234" || password === "admin" || password === "0000") {
      setIsOpen(false);
      setPassword("");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-lg" title="Admin Access">
            <Key className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-zinc-950/90 border border-white/10 backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle className="font-serif tracking-widest text-xl mb-2 text-center text-[#e8e4d9]">ADMIN ACCESS</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
            <input
              type="password"
              placeholder="Enter admin password (e.g. 1234)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs px-1">잘못된 패스워드입니다.</p>}
            <button
              type="submit"
              className="w-full bg-[#5d1f27] hover:bg-[#46171d] text-[#e8e4d9] font-bold py-3 rounded-xl transition-colors tracking-widest mt-2"
            >
              LOGIN
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
