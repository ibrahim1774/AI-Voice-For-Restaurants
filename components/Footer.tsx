export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-12">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-semibold text-white">
            Restaurant PrimeHub <span className="text-gold">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-6 font-sans text-sm text-subtle">
          <a
            href="#"
            className="hover:text-muted transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-muted transition-colors"
          >
            Privacy
          </a>
          <a
            href="mailto:hello@primevoice.com"
            className="hover:text-muted transition-colors"
          >
            Contact
          </a>
        </div>

        <p className="font-sans text-sm text-subtle">
          &copy; {new Date().getFullYear()} Restaurant PrimeHub AI
        </p>
      </div>
    </footer>
  );
}
