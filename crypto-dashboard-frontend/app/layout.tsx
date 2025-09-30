import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {
  title: "Crypto Dashboard",
  description: "Real-time crypto analytics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
