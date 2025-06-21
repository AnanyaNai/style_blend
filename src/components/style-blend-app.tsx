"use client";

import { useState } from 'react';
import ImageUploader from '@/components/image-uploader';
import StyleGallery from '@/components/style-gallery';
import ImagePreview from '@/components/image-preview';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

    // Simulate AI style transfer
    // In a real app, you would call an AI model here.
    // For this demo, we'll just show the original image after a delay.
    setTimeout(() => {
      setGeneratedImage(targetImageUrl);
      setIsLoading(false);
    }, 2000); // 2-second delay to simulate processing
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
              <h2 className="text-2xl font-semibold mb-4 font-headline">2. Select a Style</h2>
              <StyleGallery selectedStyle={selectedStyle} onStyleSelect={handleStyleSelect} />
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
