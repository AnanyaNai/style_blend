"use client";

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ALL_STYLES } from '@/data/styleGallaryData';

interface StyleInfo {
  name: string;
  hint: string;
  imageUrl: string;
}

// Style card component
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
            src={style.imageUrl}
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
  selectedStyle: string | null;
  onStyleSelect: (style: string) => void;
}

export default function StyleGallery({ selectedStyle, onStyleSelect }: StyleGalleryProps) {
  const styles = ALL_STYLES.slice(0, 8);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold font-headline">2. Select a Style</h2>
      </div>

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
    </div>
  );
}
