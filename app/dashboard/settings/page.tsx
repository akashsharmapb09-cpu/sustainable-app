import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import SettingsTabs from "@/components/dashboard/SettingsTabs";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <Breadcrumb />
      <PageHeader title="Make it feel like yours." description="A few preferences to make your GreenSwap experience work for you." action={false} />
      <SettingsTabs />
    </>
  );
}
