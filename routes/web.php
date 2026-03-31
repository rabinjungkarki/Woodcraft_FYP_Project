<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister'      => Features::enabled(Features::registration()),
        'featured'         => Product::with('category')->where('is_active', true)->latest()->take(8)->get(),
        'categories'       => Category::withCount('products')->get(),
        'total_products'   => Product::where('is_active', true)->count(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $user = auth()->user();
        $orders = $user->orders()->with('items.product')->latest()->take(5)->get();
        return inertia('dashboard', [
            'orders'       => $orders,
            'total_orders' => $user->orders()->count(),
            'total_spent'  => $user->orders()->where('payment_status', 'paid')->sum('total'),
            'cart_count'   => $user->cartItems()->count(),
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';

