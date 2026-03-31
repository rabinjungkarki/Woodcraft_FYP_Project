<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);
        if ($request->sort === 'price_asc')  $query->orderBy('price');
        elseif ($request->sort === 'price_desc') $query->orderByDesc('price');
        else $query->latest();

        return Inertia::render('shop/index', [
            'products'   => $query->paginate(12)->withQueryString(),
            'categories' => Category::all(['id', 'name', 'slug']),
            'filters'    => $request->only(['category', 'search', 'min_price', 'max_price', 'sort']),
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'reviews.user', 'seller']);

        return Inertia::render('shop/show', [
            'product'     => $product,
            'avg_rating'  => round($product->reviews->avg('rating'), 1),
            'user_review' => auth()->check()
                ? $product->reviews->firstWhere('user_id', auth()->id())
                : null,
        ]);
    }

    // Helper used in views: resolve image src
    public static function imgSrc(?array $images, int $idx = 0): ?string
    {
        $img = $images[$idx] ?? null;
        if (!$img) return null;
        // External URL
        if (str_starts_with($img, 'http')) return $img;
        // Local storage
        return '/storage/' . $img;
    }
}
