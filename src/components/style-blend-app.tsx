"use client";

import { useState } from 'react';
import ImageUploader from '@/components/image-uploader';
import StyleGallery from '@/components/style-gallery';
import ImagePreview from '@/components/image-preview';
import { Button } from '@/components/ui/button';
import { Wand2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { styleTransfer } from '@/ai/flows/style-transfer-flow';
import { useToast } from '@/hooks/use-toast';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StyleBlendApp() {
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [targetImageUrl, setTargetImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [galleryKey, setGalleryKey] = useState(0);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setTargetImage(file);
    const url = await fileToDataUrl(file);
    setTargetImageUrl(url);
    setGeneratedImage(null); // Clear previous generation
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setGeneratedImage(null); // Clear previous generation
  };

  const handleGenerate = async () => {
    if (!targetImageUrl || !selectedStyle) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await styleTransfer({
        targetImage: targetImageUrl,
        style: selectedStyle,
      });
      setGeneratedImage(result.generatedImage);
    } catch (error) {
      console.error("Style transfer failed:", error);
      toast({
        title: "Generation Failed",
        description: "Sorry, we couldn't generate your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreStyles = () => {
    setGalleryKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 font-headline">1. Upload Your Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold font-headline">2. Select a Style</h2>
                <Button variant="outline" size="sm" onClick={handleMoreStyles}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  More Styles
                </Button>
              </div>
              <StyleGallery
                key={galleryKey}
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 font-headline">3. Generate & Download</h2>
              <div className="space-y-6">
                <Button
                  onClick={handleGenerate}
                  disabled={!targetImage || !selectedStyle || isLoading}
                  className="w-full text-lg py-6"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  {isLoading ? 'Blending Style...' : 'Generate Image'}
                </Button>
                <Separator />
                <ImagePreview generatedImage={generatedImage} isLoading={isLoading} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
