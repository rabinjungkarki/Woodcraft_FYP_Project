// Wood Kala icon — used as standalone icon (e.g. mobile, collapsed sidebar)
// Replaces the Laravel cube SVG entirely
import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=40&h=40&fit=crop&q=80"
            alt="Wood Kala"
            className={`rounded object-cover ${className ?? 'h-10 w-10'}`}
            {...(props as any)}
        />
    );
}
