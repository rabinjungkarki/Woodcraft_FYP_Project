<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class BuyerDashboardController extends Controller
{
    public function index()
    {
        $user   = auth()->user();
        $orders = Order::where('user_id', $user->id)->with('items.product')->latest()->get();

        $stats = [
            'total_orders'   => $orders->count(),
            'total_spent'    => $orders->whereNotIn('status', ['cancelled'])->sum('total'),
            'delivered'      => $orders->where('status', 'delivered')->count(),
            'pending'        => $orders->whereIn('status', ['pending', 'processing', 'shipped'])->count(),
        ];

        $recent   = $orders->take(5);
        $wishlist = $user->wishlist()->with('product.category')->latest()->take(4)->get();

        return Inertia::render('shop/dashboard', compact('stats', 'recent', 'wishlist'));
    }
}
