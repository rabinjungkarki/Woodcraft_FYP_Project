<?php

use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\RegisterController;
use Illuminate\Support\Facades\Route;

// Seller registration (any logged-in user)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/seller/register', [RegisterController::class, 'show'])->name('seller.register');
    Route::post('/seller/register', [RegisterController::class, 'store'])->name('seller.register.store');
});

// Seller panel (seller role only)
Route::middleware(['auth', 'verified', 'seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});
