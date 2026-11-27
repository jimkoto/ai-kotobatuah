import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export function MediaImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 text-stone-500 p-6 ${className}`}
      >
        <ImageOff className="w-6 h-6 mb-2 text-stone-400" aria-hidden="true" />
        <span className="text-xs font-medium text-center text-stone-600">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
