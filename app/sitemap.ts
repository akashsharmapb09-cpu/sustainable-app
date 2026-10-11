import type { MetadataRoute } from "next";

const base = "https://sustainable-app-qccf.vercel.app";
const publicPages = [
  "",
  "about",
  "how-it-works",
  "impact",
  "blog",
  "community",
  "faq",
  "methodology",
  "privacy-policy",
  "terms",
  "cookies",
  "sitemap",
  "status",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((path) => ({
    url: path ? base + "/" + path : base,
    lastModified: new Date("2026-10-11T00:00:00.000Z"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
