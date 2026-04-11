import { BottomNav } from "@/components/farmer/bottom-nav";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <>
      {children}
      <BottomNav />
    </>
  );
}