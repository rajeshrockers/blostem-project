import { useState } from 'react';
import { ImageGalleryProps } from '../../types';

export function ImageGallery({ images, thumbnail, title }: ImageGalleryProps) {
  const allImages = [thumbnail, ...images];
  const [activeImage, setActiveImage] = useState(thumbnail);

  return (
    <div>
      <img
        src={activeImage}
        alt={title}
        className="w-full h-80 object-cover rounded-lg"
      />
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
              activeImage === img ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
