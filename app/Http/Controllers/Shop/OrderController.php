<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('shop/orders', [
            'orders' => Order::with('items.product')
                ->where('user_id', auth()->id())
                ->latest()
                ->get(),
        ]);
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        return Inertia::render('shop/order-detail', [
            'order' => $order->load('items.product'),
        ]);
    }
}
