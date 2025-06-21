"use client";

import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
}

export default function ImagePreview({ generatedImage, isLoading }: ImagePreviewProps) {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'style-blend-output.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
        {isLoading && (
          <>
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 font-semibold">Generating...</p>
            </div>
          </>
        )}
        {!isLoading && generatedImage && (
          <Image
            src={generatedImage}
            alt="Generated image with new style"
            fill
            className="object-contain"
          />
        )}
        {!isLoading && !generatedImage && (
          <div className="flex flex-col items-center text-muted-foreground p-8 text-center">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p className="font-semibold">Your generated image will appear here.</p>
          </div>
        )}
      </div>
      <Button
        onClick={handleDownload}
        disabled={!generatedImage || isLoading}
        className="w-full"
        variant="secondary"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Image
      </Button>
    </div>
  );
}
