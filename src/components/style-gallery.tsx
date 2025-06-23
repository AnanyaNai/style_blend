"use client";

import { useEffect, useState } from 'react';
import { generateStylePrompts } from '@/ai/flows/style-prompt-generation';
import { generateStyleImage } from '@/ai/flows/style-image-generation-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

// Sub-component for rendering each style card with its own image loading
function StyleCard({
  style,
  isSelected,
  onSelect,
}: {
  style: string;
  isSelected: boolean;
  onSelect: (style: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const result = await generateStyleImage({ style });
        setImageUrl(result.imageUrl);
      } catch (error) {
        console.error(`Failed to generate image for style "${style}":`, error);
        setImageUrl(null); // Set to null on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [style]);

  return (
    <Card
      onClick={() => onSelect(style)}
      className={cn(
        'cursor-pointer transition-all duration-200 overflow-hidden group',
        'hover:shadow-lg hover:-translate-y-1',
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative bg-muted/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={style}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-destructive text-center p-2">
                <AlertCircle className="w-8 h-8 mb-2"/>
                <span className="text-xs font-semibold">Image failed to load</span>
            </div>
          )}
        </div>
        <p className="font-semibold text-center p-2 text-sm truncate">{style}</p>
      </CardContent>
    </Card>
  );
}

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
        setStyles(stylePrompts.sort(() => 0.5 - Math.random()).slice(0, 8));
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
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {styles.map((style) => (
        <StyleCard
          key={style}
          style={style}
          isSelected={selectedStyle === style}
          onSelect={onStyleSelect}
        />
      ))}
    </div>
  );
}
