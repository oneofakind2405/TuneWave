import { Mail, MapPin, Music2 } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Column 1: App Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Music2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TuneWave</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Discover and attend the best music events in your city. Connect with fellow music lovers and create unforgettable memories.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#events" className="text-muted-foreground hover:text-primary transition-colors">Browse Events</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Become an Organizer</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:contact@tunewave.com" className="text-muted-foreground hover:text-primary transition-colors">contact@tunewave.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">123 Music Street, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TuneWave. All rights reserved.
          </p>
          {/* "Made in Bolt" can be added here if needed */}
        </div>
      </div>
    </footer>
  );
}
