'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  console.log(images);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}    
        height={1000}
        className="min-h-[300]   object-cover
        object-center"
      
      />
      <div className="flex">
        {images.map((image, index) => (
          <div className={cn('border mr-2 cursor-pointer hover:border-orange-600', current === index && 'border-orange-600')} key={index} onClick={() => setCurrent(index)}>
            <Image
              src={image}
              alt="product image"
              width={100}
              height={100}
              className="w-20 h-20 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
