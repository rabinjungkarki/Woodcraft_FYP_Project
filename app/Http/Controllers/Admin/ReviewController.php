<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/reviews/index', [
            'reviews' => Review::with(['user', 'product'])->latest()->get(),
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted.');
    }
}
