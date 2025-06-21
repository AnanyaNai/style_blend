"use client";

import { useState, useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File | null | undefined) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (e.g., PNG, JPG, WEBP).",
          variant: "destructive",
        });
      }
    }
  }, [onImageUpload, toast]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  return (
    <div
      className={cn(
        "relative w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out",
        "border-border hover:border-primary/50 bg-background/50",
        isDragging && "border-primary bg-primary/10"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Image upload zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview ? (
        <div className="relative w-full aspect-video">
           <Image
            src={preview}
            alt="Image preview"
            fill
            className="object-contain rounded-md"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 space-y-2 text-muted-foreground">
          <UploadCloud className="w-12 h-12" />
          <p className="text-lg font-semibold">Drag & drop an image here</p>
          <p className="text-sm">or click to select a file</p>
        </div>
      )}
    </div>
  );
}
