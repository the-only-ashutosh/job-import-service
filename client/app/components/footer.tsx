export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-white/40 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Job Import Dashboard. Built with Next.js & Tailwind CSS.
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Last updated: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>System Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}