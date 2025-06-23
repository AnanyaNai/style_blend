"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StyleInfo {
  name: string;
  hint: string;
}

function StyleCard({
  style,
  isSelected,
  onSelect,
}: {
  style: StyleInfo;
  isSelected: boolean;
  onSelect: (styleName: string) => void;
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
          <Image
            src={`https://placehold.co/200x200.png`}
            alt={style.name}
            data-ai-hint={style.hint}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
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
        />
      ))}
    </div>
  );
}
