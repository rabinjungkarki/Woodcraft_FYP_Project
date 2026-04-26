// Wood Kala brand logo — used in sidebar and anywhere AppLogo is referenced
export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <img
                src="/logo-high-res.png" 
                alt="Wood-कला"
            
                loading="eager"
            
                className="h-14 w-auto object-contain shrink-0 transition-transform duration-300 hover:scale-105"
            />
            <span className="serif text-xl font-bold text-foreground hidden sm:block">
                Wood Kala
            </span>
        </div>
    );
}