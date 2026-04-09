<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->category)  $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        if ($request->search)    $query->where('name', 'like', "%{$request->search}%");
        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);
        if ($request->in_stock)  $query->where('stock', '>', 0);

        match ($request->sort) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'rating'     => $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating'),
            'popular'    => $query->withCount('orderItems')->orderByDesc('order_items_count'),
            default      => $query->latest(),
        };

        return response()->json($query->paginate(12)->withQueryString());
    }

    public function show(Product $product)
    {
        $product->load(['category', 'reviews.user']);
        return response()->json([
            'product'    => $product,
            'avg_rating' => round($product->reviews->avg('rating'), 1),
        ]);
    }

    public function categories()
    {
        return response()->json(Category::withCount('products')->get(['id', 'name', 'slug']));
    }
}
