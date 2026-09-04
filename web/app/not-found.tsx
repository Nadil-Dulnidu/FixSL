import Link from "next/link";
import { Compass, Home, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
      <div className="clay-card max-w-lg w-full p-8 sm:p-10 text-center border border-amber-500/20">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>
        <span className="text-amber-500 font-mono text-sm tracking-widest uppercase font-semibold">
          404 · Not Found
        </span>
        <h1 className="text-3xl font-black text-white mt-2 mb-3 tracking-tight">
          Page or Issue Not Found
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page or civic tracking number you requested could not be located. It may have been archived or the link might be mistyped.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="default" className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <PlusCircle className="w-4 h-4" />
              Report an Issue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
