/** Resolves product image to correct URL (external or local storage) */
export function imgSrc(images: string[] | null | undefined, idx = 0): string | null {
    const img = images?.[idx];
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `/storage/${img}`;
}
