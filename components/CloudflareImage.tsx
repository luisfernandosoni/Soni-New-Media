import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ASSET_PREFIX = 'https://assets.soninewmedia.com/';

interface CloudflareImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: string; // The filename on R2 (e.g., "logo.png")
  priority?: boolean;
}

export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  name,
  className = '',
  priority = false,
  alt,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const src = `${ASSET_PREFIX}${name}`;

  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onLoad={() => setIsLoaded(true)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // @ts-ignore - Explicit support for modern browser optimizations
      fetchpriority={priority ? "high" : "auto"}
      className={`${className}`}
      {...props}
    />
  );
};