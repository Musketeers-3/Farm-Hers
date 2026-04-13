import { BottomNav } from "@/components/farmer/bottom-nav";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      
      <main className="pb-24"> 
        {children}
      </main>

      {/* Bolo stays as the invisible "Siri" of the app */}
      <BoloAssistant />

      <BottomNav />
    </div>
  );
}