<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $items = Wishlist::where('user_id', auth()->id())
            ->with('product.category')
            ->latest()
            ->get();

        return Inertia::render('shop/wishlist', ['items' => $items]);
    }

    public function toggle(Product $product)
    {
        if ($product->seller_id === auth()->id()) {
            return back()->withErrors(['product' => 'You cannot wishlist your own product.']);
        }

        $existing = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $wishlisted = false;
        } else {
            Wishlist::create(['user_id' => auth()->id(), 'product_id' => $product->id]);
            $wishlisted = true;
        }

        return back()->with('success', $wishlisted ? 'Added to wishlist ♥' : 'Removed from wishlist');
    }
}
