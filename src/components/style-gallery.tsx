"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { generateStyleImage } from '@/ai/flows/style-image-generation-flow';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface StyleInfo {
  name: string;
  hint: string;
}

const ALL_STYLES: StyleInfo[] = [
    { name: 'Steampunk', hint: 'steampunk machine' },
    { name: 'Art Deco', hint: 'art deco building' },
    { name: 'Pop Art', hint: 'pop art comic' },
    { name: 'Cyberpunk', hint: 'cyberpunk city' },
    { name: 'Renaissance', hint: 'renaissance painting' },
    { name: 'Impressionism', hint: 'impressionist painting' },
    { name: 'Cubism', hint: 'cubist portrait' },
    { name: 'Minimalism', hint: 'minimalist design' },
    { name: 'Surrealism', hint: 'surrealist dream' },
    { name: 'Gothic', hint: 'gothic architecture' },
    { name: 'Baroque', hint: 'baroque sculpture' },
    { name: 'Art Nouveau', hint: 'art nouveau pattern' },
    { name: 'Bauhaus', hint: 'bauhaus design' },
    { name: 'Street Art', hint: 'street art graffiti' },
    { name: 'Fantasy', hint: 'fantasy landscape' },
    { name: 'Vintage', hint: 'vintage photograph' },
    { name: '3D Render', hint: '3d render' },
    { name: 'Pixel Art', hint: 'pixel art game' },
    { name: 'Watercolor', hint: 'watercolor painting' },
    { name: 'Cartoon', hint: 'cartoon character' },
];

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
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
  selectedStyle: string | null;
  onStyleSelect: (style: string) => void;
}

export default function StyleGallery({ selectedStyle, onStyleSelect }: StyleGalleryProps) {
  const [styles, setStyles] = useState<StyleInfo[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const imageCache = useRef<Record<string, string>>({});

  const loadNewStyles = useCallback(() => {
    const newStyles = shuffleArray([...ALL_STYLES]).slice(0, 8);
    setStyles(newStyles);
  }, []);

  useEffect(() => {
    // Load initial styles only once on mount
    loadNewStyles();
  }, [loadNewStyles]);

  useEffect(() => {
    if (styles && styles.length > 0) {
      const fetchImagesSequentially = async () => {
        const initialLoadingStates = styles.reduce((acc, style) => {
          acc[style.name] = !imageCache.current[style.name];
          return acc;
        }, {} as Record<string, boolean>);
        setLoadingStates(initialLoadingStates);

        setImageUrls(prev => ({ ...prev, ...imageCache.current }));

        for (const style of styles) {
          if (imageCache.current[style.name]) {
            continue;
          }

          try {
            const result = await generateStyleImage({ style: style.name });
            imageCache.current[style.name] = result.imageUrl;
            setImageUrls(prev => ({ ...prev, [style.name]: result.imageUrl }));
          } catch (error) {
            console.error(`Failed to generate style image for ${style.name}:`, error);
          } finally {
            setLoadingStates(prev => ({ ...prev, [style.name]: false }));
          }
        }
      };

      fetchImagesSequentially();
    }
  }, [styles]);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-headline">2. Select a Style</h2>
            <Button variant="outline" size="sm" onClick={loadNewStyles}>
            <RefreshCw className="h-4 w-4 mr-2" />
            More Styles
            </Button>
        </div>
        
        {styles.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
                ))}
            </div>
        ) : (
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
        )}
    </div>
  );
}
