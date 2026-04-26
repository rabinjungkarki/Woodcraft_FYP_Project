// Wood Kala icon — used as standalone icon (e.g. mobile, collapsed sidebar)
// Replaces the Laravel cube SVG entirely
import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.png"
            alt="WoodKala Nepal"
            className={`rounded object-cover ${className ?? 'h-10 w-10'}`}
            {...(props as any)}
        />
    );
}
