import "@/styles/app.css";
export const metadata = {
  title: "Next.js",
  description: "Login/Signup by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
