import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONEDIX | Finanzas sin Complicaciones",
  description: "Toma el control de tu dinero con la mejor app de finanzas personales de Colombia.",
};

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
