import StyleBlendApp from '@/components/style-blend-app';
import { Palette } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b border-border/50">
        <div className="container mx-auto flex items-center gap-3">
          <Palette className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold font-headline text-foreground">
            StyleBlend
          </h1>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <StyleBlendApp />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Created with Style & AI</p>
      </footer>
    </div>
  );
}
