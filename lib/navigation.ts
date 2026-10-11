export const publicLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "How it works", href: "/how-it-works" },
] as const;

export const dashboardLinks = [
  { section: "MAIN", items: [
    { label: "Explore Swaps", href: "/dashboard/explore", icon: "compass" },
    { label: "Catalogue", href: "/dashboard/catalogue", icon: "layout" },
  ] },
  { section: "TRACK", items: [
    { label: "My Activity", href: "/dashboard/activity", icon: "activity", badge: "3 new" },
  ] },
  { section: "ACCOUNT", items: [
    { label: "My Account", href: "/dashboard/account", icon: "user" },
    { label: "Settings", href: "/dashboard/settings", icon: "settings" },
  ] },
] as const;
