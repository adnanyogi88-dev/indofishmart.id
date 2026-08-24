import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteAsset, siteUrl } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Indofishmart | Frozen Seafood untuk Rumah dan Usaha",
  description:
    "Pilihan ikan, fillet, udang, dan seafood untuk kebutuhan retail, HORECA, reseller, dan distributor.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Indofishmart",
    title: "Indofishmart | Frozen Seafood untuk Rumah dan Usaha",
    description:
      "Pilihan ikan, fillet, udang, dan seafood untuk kebutuhan retail, HORECA, reseller, dan distributor.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Indofishmart — Frozen Seafood untuk Rumah dan Usaha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indofishmart | Frozen Seafood untuk Rumah dan Usaha",
    description:
      "Pilihan ikan, fillet, udang, dan seafood untuk kebutuhan retail, HORECA, reseller, dan distributor.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyStyle = {
    "--contact-background-image": `url("${siteAsset("/images/udang-vaname.jpg")}")`,
  } as CSSProperties;

  return (
    <html lang="id">
      <body style={bodyStyle}>
        <div id="top" className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}
