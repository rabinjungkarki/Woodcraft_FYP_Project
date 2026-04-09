// Wood Kala brand logo — used in sidebar and anywhere AppLogo is referenced
export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <img
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=40&h=40&fit=crop&q=80"
                alt="Wood Kala"
                className="h-8 w-8 rounded object-cover shrink-0"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Wood Kala</span>
                <span className="truncate text-xs text-muted-foreground">Furniture Marketplace</span>
            </div>
        </div>
    );
}
