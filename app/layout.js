import "./globals.css";

export const metadata = {
  title: "PAWCARE. — Exceptional Care For Every Paw",
  description:
    "Discover trusted veterinarians, accredited pet hospitals, grooming studios, and compassionate animal-care specialists near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F1E8] text-[#142746] font-sans selection:bg-[#F0523B] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
