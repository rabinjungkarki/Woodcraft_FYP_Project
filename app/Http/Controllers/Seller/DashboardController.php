<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $seller = auth()->user();

        return Inertia::render('seller/dashboard', [
            'stats' => [
                'total_products' => $seller->products()->count(),
                'active_products' => $seller->products()->where('is_active', true)->count(),
                'total_orders' => \App\Models\OrderItem::whereIn('product_id', $seller->products()->pluck('id'))->distinct('order_id')->count(),
                'total_revenue' => \App\Models\OrderItem::whereIn('product_id', $seller->products()->pluck('id'))
                    ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
                    ->selectRaw('SUM(price * quantity) as total')
                    ->value('total') ?? 0,
            ],
            'recent_products' => $seller->products()->with('category')->latest()->take(5)->get(),
        ]);
    }
}
