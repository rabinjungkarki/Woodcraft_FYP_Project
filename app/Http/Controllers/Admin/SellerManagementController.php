<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerManagementController extends Controller
{
    public function index()
    {
        $sellers = User::whereIn('role', ['seller', 'pending_seller'])
            ->withCount('products')
            ->latest()
            ->get()
            ->map(function ($seller) {
                $productIds = $seller->products()->pluck('id');
                $seller->total_revenue = OrderItem::whereIn('product_id', $productIds)
                    ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
                    ->selectRaw('SUM(price * quantity) as total')
                    ->value('total') ?? 0;
                $seller->total_orders = OrderItem::whereIn('product_id', $productIds)
                    ->distinct('order_id')->count('order_id');
                return $seller;
            });

        return Inertia::render('admin/sellers/index', ['sellers' => $sellers]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $request->validate(['seller_status' => 'required|in:pending,approved,suspended']);
        if ($request->seller_status === 'approved') {
            $user->update(['seller_status' => 'approved', 'role' => 'seller']);
        } elseif ($request->seller_status === 'suspended') {
            $user->update(['seller_status' => 'suspended', 'role' => 'customer']);
        } else {
            $user->update(['seller_status' => 'pending', 'role' => 'pending_seller']);
        }
        return back()->with('success', 'Seller status updated.');
    }

    public function recordPayout(Request $request, User $user)
    {
        $request->validate(['payout_note' => 'nullable|string|max:255']);
        // Store payout note in shop_description as a simple log (extend with a payouts table for production)
        $note = '[PAYOUT ' . now()->format('Y-m-d') . '] ' . ($request->payout_note ?? 'Manual payout recorded.');
        $user->update(['shop_description' => $user->shop_description . "\n" . $note]);
        return back()->with('success', 'Payout recorded.');
    }
}
