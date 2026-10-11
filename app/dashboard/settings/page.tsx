import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SettingsTabs } from "@/components/dashboard/SettingsTabs";
export const metadata:Metadata={title:"Settings",description:"Manage local GreenSwap demo preferences."};
export default function SettingsPage(){return <><PageHeader title="Settings" description="Manage how the demo workspace behaves. Changes do not update a cloud-backed account."/><div className="max-w-3xl"><SettingsTabs/></div></>}