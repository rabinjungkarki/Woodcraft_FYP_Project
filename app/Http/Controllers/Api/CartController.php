<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = CartItem::with('product.category')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'items' => $items,
            'total' => $items->sum(fn($i) => $i->quantity * $i->product->price),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        $item = CartItem::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $request->product_id],
            ['quantity' => $request->quantity]
        );

        return response()->json($item->load('product'), 201);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $this->authorize('update', $cartItem);
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);
        return response()->json($cartItem->load('product'));
    }

    public function destroy(CartItem $cartItem)
    {
        $this->authorize('delete', $cartItem);
        $cartItem->delete();
        return response()->json(['message' => 'Removed']);
    }
}
