import { FarmerScreenClient } from "./client"

export function generateStaticParams() {
  return [
    { screen: "sell" },
    { screen: "auction" },
    { screen: "tracking" },
    { screen: "market" },
    { screen: "profile" },
    { screen: "notifications" },
    { screen: "earnings" },
  ]
}

export default async function FarmerScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params
  return <FarmerScreenClient screen={screen} />
}