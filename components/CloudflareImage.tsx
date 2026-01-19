import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ASSET_DOMAIN = 'https://assets.soninewmedia.com';

interface CloudflareImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: string; // The filename on R2 (e.g., "SoniNewMedia.png")
  priority?: boolean;
  width?: number;
  quality?: number;
}

/**
 * CloudflareImage leverages Cloudflare Image Resizing for "magic" optimization.
 * It automatically handles WebP/AVIF conversion and edge-side resizing.
 * 
 * Note: For this to work in production, assets.soninewmedia.com must be 
 * PROXIED (Orange Cloud) in your Cloudflare DNS settings.
 */
export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  name,
  className = '',
  priority = false,
  width,
  quality = 90,
  alt,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Construct the Cloudflare Image Resizing URL
  // format=auto: Automatically serves AVIF/WebP based on browser support
  // metadata=none: Strips EXIF data for smaller file size
  const transformOptions = [
    'format=auto',
    `quality=${quality}`,
    'metadata=none',
    width ? `width=${width}` : '',
  ].filter(Boolean).join(',');

  // If we are in local dev, we might want to bypass resizing if the worker isn't present,
  // but for a Silicon Valley standard, we assume the production-like Edge environment.
  const src = `${ASSET_DOMAIN}/cdn-cgi/image/${transformOptions}/${name}`;

  return (
    <div className={`relative overflow-visible ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 0.95,
          y: isLoaded ? 0 : 5
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.4 }
        }}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        className="w-full h-full object-contain"
        {...props}
      />
    </div>
  );
};