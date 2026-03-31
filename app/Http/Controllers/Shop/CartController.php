<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        $total = $items->sum(fn($i) => $i->product->price * $i->quantity);

        return Inertia::render('shop/cart', [
            'items' => $items,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id', 'quantity' => 'integer|min:1']);

        $qty = $request->get('quantity', 1);

        $item = CartItem::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->increment('quantity', $qty);
        } else {
            CartItem::create([
                'user_id'    => auth()->id(),
                'product_id' => $request->product_id,
                'quantity'   => $qty,
            ]);
        }

        return back()->with('success', 'Added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);
        return back();
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();
        return back()->with('success', 'Item removed.');
    }
}
