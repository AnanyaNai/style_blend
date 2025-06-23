"use client";

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/image-uploader';
import StyleGallery from '@/components/style-gallery';
import ImagePreview from '@/components/image-preview';
import { Button } from '@/components/ui/button';
import { Wand2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { styleTransfer } from '@/ai/flows/style-transfer-flow';
import { useToast } from '@/hooks/use-toast';

// Define a list of styles with hints for placeholder images
const ALL_STYLES = [
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
  const [styles, setStyles] = useState<{name: string, hint: string}[]>([]);
  const { toast } = useToast();

  const loadNewStyles = () => {
    setStyles(shuffleArray([...ALL_STYLES]).slice(0, 8));
  };
  
  useEffect(() => {
    loadNewStyles();
  }, []);

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
                <Button variant="outline" size="sm" onClick={loadNewStyles}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  More Styles
                </Button>
              </div>
              <StyleGallery
                styles={styles}
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
