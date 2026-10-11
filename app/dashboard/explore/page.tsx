import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ExploreGrid } from "@/components/dashboard/ExploreGrid";
export const metadata:Metadata={title:"Explore swaps",description:"Find and save sustainable swaps in the GreenSwap workspace."};
export default function DashboardExplorePage(){return <><PageHeader title="Explore swaps" description="Find one useful next step. Filter by topic, search ideas and save what you’d like to try."/><ExploreGrid/></>}