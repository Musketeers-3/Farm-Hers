import { BuyerScreenClient } from "@/components/buyer/client";

export function generateStaticParams() {
  return [
    { screen: "pools" },
    { screen: "auctions" },
    { screen: "orders" },
    { screen: "analytics" },
    { screen: "demands" },
  ];
}

export default async function BuyerScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const { screen } = await params;

  // This imports the flawless client component you just wrote!
  return <BuyerScreenClient screen={screen} />;
}
