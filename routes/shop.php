<?php

use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\ShopController;
use Illuminate\Support\Facades\Route;

// Public shop routes
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{product:slug}', [ShopController::class, 'show'])->name('shop.show');

// Auth required
Route::middleware(['auth', 'verified'])->group(function () {
    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Payment
    Route::get('/payment/khalti/{order}', [PaymentController::class, 'khalti'])->name('payment.khalti');
    Route::post('/payment/khalti/{order}/verify', [PaymentController::class, 'khaltiVerify'])->name('payment.khalti.verify');
});
