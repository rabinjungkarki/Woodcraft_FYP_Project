<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
    Route::resource('products', ProductController::class)->except(['show', 'create', 'edit']);
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});
