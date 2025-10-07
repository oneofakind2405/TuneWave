import { BlogPostGenerator } from "@/components/blog-post-generator";
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <EventsSection />
        <BlogPostGenerator />
      </main>
      <Footer />
    </div>
  );
}
