export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold tracking-wide">
            Electronics Marketplace
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/80">
            Your trusted platform for buying and selling second-hand electronics
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold"></span>
            <span className="text-sm text-white/80">
              2024 Electronics Marketplace. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/20 pt-6 text-xs text-white/80 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a className="hover:text-white" href="#about">
              About
            </a>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
            <a className="hover:text-white" href="#privacy">
              Privacy
            </a>
            <a className="hover:text-white" href="#terms">
              Terms
            </a>
          </div>
          <span>2024 Electronics Marketplace. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
