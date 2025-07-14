"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { generateStyleImage } from '@/ai/flows/style-image-generation-flow';
import { useToast } from '@/hooks/use-toast';

interface StyleInfo {
  name: string;
  hint: string;
}

function StyleCard({
  style,
  isSelected,
  onSelect,
  imageUrl,
  isLoading,
}: {
  style: StyleInfo;
  isSelected: boolean;
  onSelect: (styleName: string) => void;
  imageUrl: string | null;
  isLoading: boolean;
}) {
  return (
    <Card
      onClick={() => onSelect(style.name)}
      className={cn(
        'cursor-pointer transition-all duration-200 overflow-hidden group',
        'hover:shadow-lg hover:-translate-y-1',
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative bg-muted/50">
          {isLoading || !imageUrl ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Image
              src={imageUrl}
              alt={style.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <p className="font-semibold text-center p-2 text-sm truncate">{style.name}</p>
      </CardContent>
    </Card>
  );
}

interface StyleGalleryProps {
  styles: StyleInfo[];
  selectedStyle: string | null;
  onStyleSelect: (style: string) => void;
}

export default function StyleGallery({ styles, selectedStyle, onStyleSelect }: StyleGalleryProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  // Use a ref to cache images across style refreshes
  const imageCache = useRef<Record<string, string>>({});

  useEffect(() => {
    if (styles && styles.length > 0) {
      const fetchImagesSequentially = async () => {
        const initialLoadingStates = styles.reduce((acc, style) => {
          // If the image isn't in the cache, it needs to be loaded.
          acc[style.name] = !imageCache.current[style.name];
          return acc;
        }, {} as Record<string, boolean>);
        setLoadingStates(initialLoadingStates);

        // Set images from cache immediately
        setImageUrls(prev => ({ ...prev, ...imageCache.current }));

        for (const style of styles) {
          // Only fetch if not in our cache
          if (imageCache.current[style.name]) {
            continue;
          }

          try {
            const result = await generateStyleImage({ style: style.name });
            // Update both the cache and the current state
            imageCache.current[style.name] = result.imageUrl;
            setImageUrls(prev => ({ ...prev, [style.name]: result.imageUrl }));
          } catch (error) {
            console.error(`Failed to generate style image for ${style.name}:`, error);
            // Don't show toast for every single failure to avoid spam
          } finally {
            setLoadingStates(prev => ({ ...prev, [style.name]: false }));
          }
        }
      };

      fetchImagesSequentially();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles]);

  if (!styles || styles.length === 0) {
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
          key={style.name}
          style={style}
          isSelected={selectedStyle === style.name}
          onSelect={onStyleSelect}
          imageUrl={imageUrls[style.name] || null}
          isLoading={loadingStates[style.name] ?? true}
        />
      ))}
    </div>
  );
}
