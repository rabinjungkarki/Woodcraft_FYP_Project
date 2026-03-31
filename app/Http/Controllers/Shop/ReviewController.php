<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        Review::updateOrCreate(
            ['user_id' => auth()->id(), 'product_id' => $request->product_id],
            ['rating' => $request->rating, 'comment' => $request->comment],
        );

        return back()->with('success', 'Review submitted.');
    }

    public function destroy(Review $review)
    {
        abort_if($review->user_id !== auth()->id() && !auth()->user()->isAdmin(), 403);
        $review->delete();
        return back()->with('success', 'Review deleted.');
    }
}
