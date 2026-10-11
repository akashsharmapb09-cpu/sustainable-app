import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CatalogueTable } from "@/components/dashboard/CatalogueTable";
export const metadata:Metadata={title:"Catalogue",description:"Browse and compare GreenSwap swap ideas."};
export default function DashboardCataloguePage(){return <><PageHeader title="Catalogue" description="A clean view of swap ideas, effort levels and sample Green Points."/><CatalogueTable/></>}