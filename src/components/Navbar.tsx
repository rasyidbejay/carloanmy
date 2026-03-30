import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Container from "@/components/ui/Container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/72 backdrop-blur-xl transition-colors duration-300 supports-[backdrop-filter]:bg-background/60">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-[0.95rem] font-semibold tracking-[-0.03em] text-foreground transition-opacity duration-200 hover:opacity-80"
        >
          CarLoan.my
        </Link>
        <ThemeToggle />
      </Container>
    </header>
  );
}
