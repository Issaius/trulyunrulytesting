import Navigation from "@/components/Navigation";
import CursorFollower from "@/components/CursorFollower";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CursorFollower />
      <Navigation />
      {children}
    </>
  );
}
