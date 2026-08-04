import type { ImgHTMLAttributes } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { useShop } from '@/context/shop-context';

type StoreLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  className?: string;
  iconClassName?: string;
};

export function StoreLogo({ className = 'h-8 w-auto', iconClassName = 'h-6 w-6' }: StoreLogoProps) {
  const { settings } = useShop();
  const [imageFailed, setImageFailed] = useState(false);

  if (settings.logoImage && !imageFailed) {
    return (
      <img
        src={settings.logoImage}
        alt={settings.logo || 'Game Galaria'}
        className={className}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="rounded-lg bg-primary/10 p-2">
        <Gamepad2 className={iconClassName} />
      </span>
      <span className="text-xl font-bold tracking-tight">
        {settings.logo || 'GAMEGALARIA'}
      </span>
    </span>
  );
}