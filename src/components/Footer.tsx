const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-2 text-center">
      <p className="text-xs text-muted-foreground">
        Developed by{' '}
        <a
          href="https://nishanrahman.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-semibold"
        >
          Nishan Rahman
        </a>
        {' '}• PyPlayground © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
