"use client";

import { useEffect, useState } from 'react';
import { generateStylePrompts } from '@/ai/flows/style-prompt-generation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StyleGalleryProps {
  selectedStyle: string | null;
  onStyleSelect: (style: string) => void;
}

export default function StyleGallery({ selectedStyle, onStyleSelect }: StyleGalleryProps) {
  const [styles, setStyles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const { stylePrompts } = await generateStylePrompts();
        // Take a slice to avoid showing too many, and shuffle for variety
        setStyles(stylePrompts.sort(() => 0.5 - Math.random()).slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch styles:", error);
        // Fallback styles
        setStyles(['Steampunk', 'Art Deco', 'Pop Art', 'Cyberpunk', 'Renaissance', 'Minimalism', 'Surrealism', 'Gothic']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStyles();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {styles.map((style) => (
        <Card
          key={style}
          onClick={() => onStyleSelect(style)}
          className={cn(
            "cursor-pointer transition-all duration-200 overflow-hidden group",
            "hover:shadow-lg hover:-translate-y-1",
            selectedStyle === style ? 'ring-2 ring-primary border-primary' : 'border-border'
          )}
        >
          <CardContent className="p-0">
            <div className="aspect-square relative">
              <Image 
                src={`https://placehold.co/200x200.png`} 
                alt={style}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={style.toLowerCase().split(' ').slice(0,2).join(' ')}
              />
            </div>
            <p className="font-semibold text-center p-2 text-sm truncate">{style}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
