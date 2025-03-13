import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

interface SwipeableCarouselProps {
  images: string[];
  interval?: number;
}

export const SwipeableCarousel = ({ images, interval = 4000 }: SwipeableCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);

    // Auto-play functionality
    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, interval);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [emblaApi, interval]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0.5,
                  scale: currentIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}>
                <img src={image} alt={`Cherry App Demo ${index + 1}`} className="w-full h-full object-contain" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom pagination */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-[#B87CED]" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
