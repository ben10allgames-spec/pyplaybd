import { useEffect, useState } from 'react';

const Footer = () => {
  const [footerText, setFooterText] = useState('Developed by');
  const [footerName, setFooterName] = useState('Nishan Rahman');
  const [footerLink, setFooterLink] = useState('https://github.com/nishanrahman');

  useEffect(() => {
    const custom = localStorage.getItem('pyplay_footer');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        if (parsed.text) setFooterText(parsed.text);
        if (parsed.name) setFooterName(parsed.name);
        if (parsed.link) setFooterLink(parsed.link);
      } catch {}
    }
  }, []);

  return (
    <footer className="border-t border-border bg-card/50 px-4 py-2 text-center">
      <p className="text-xs text-muted-foreground">
        {footerText}{' '}
        <a
          href={footerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-semibold"
        >
          {footerName}
        </a>
        {' '}• PyPlayground © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
