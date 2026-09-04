import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Fix<span className="text-amber-400">SL</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Create your admin account
          </p>
        </div>

        {/* Clerk Sign-Up component */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              cardBox: "bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl rounded-2xl",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton:
                "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors",
              socialButtonsBlockButtonText: "text-slate-200 font-medium",
              formFieldLabel: "text-slate-300",
              formFieldInput:
                "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-amber-500 focus:border-amber-500",
              formButtonPrimary:
                "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20",
              footerActionLink: "text-amber-400 hover:text-amber-300",
              identityPreviewEditButton: "text-amber-400 hover:text-amber-300",
              formFieldAction: "text-amber-400 hover:text-amber-300",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500",
              footer: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
