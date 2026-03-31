<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $items = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        if ($items->isEmpty()) return redirect()->route('cart.index');

        return Inertia::render('shop/checkout', [
            'items' => $items,
            'total' => $items->sum(fn($i) => $i->product->price * $i->quantity),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone'            => 'required|string',
            'payment_method'   => 'required|in:esewa,khalti,cod',
        ]);

        $items = CartItem::with('product')->where('user_id', auth()->id())->get();
        if ($items->isEmpty()) return back()->withErrors(['cart' => 'Cart is empty.']);

        $total = $items->sum(fn($i) => $i->product->price * $i->quantity);

        $order = DB::transaction(function () use ($request, $items, $total) {
            $order = Order::create([
                'user_id'          => auth()->id(),
                'total'            => $total,
                'shipping_address' => $request->shipping_address,
                'phone'            => $request->phone,
                'payment_method'   => $request->payment_method,
                'payment_status'   => 'unpaid',
                'status'           => 'pending',
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price,
                ]);
                $item->product->decrement('stock', $item->quantity);
            }

            CartItem::where('user_id', auth()->id())->delete();

            return $order;
        });

        if ($request->payment_method === 'khalti') {
            return redirect()->route('payment.khalti', $order->id);
        }

        return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully!');
    }
}
