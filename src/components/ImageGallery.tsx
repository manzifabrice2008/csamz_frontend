import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  altPrefix?: string;
}

export default function ImageGallery({ images, altPrefix = "Gallery image" }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = ''; // Reset to default
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-lg shadow-lg hover-lift animate-scaleIn cursor-pointer group"
            onClick={() => openLightbox(index)}
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
          >
            <img 
              src={src} 
              alt={`${altPrefix} ${index + 1}`}
              loading="lazy"
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                Click to view
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button - Top Right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-red-500 hover:text-white bg-black/50 rounded-full w-12 h-12 z-50 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Close Text Hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-50 bg-black/50 px-4 py-2 rounded-full">
            Press ESC or click outside to close
          </div>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Image */}
          <div 
            className="relative max-w-7xl max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={`${altPrefix} ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 px-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                className={`h-16 w-20 object-cover rounded cursor-pointer transition-all duration-300 ${
                  index === selectedImage 
                    ? 'ring-2 ring-school-accent scale-110' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(index);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
