<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SellerController extends Controller
{
    public function products()
    {
        return response()->json(auth()->user()->products()->with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'images'      => 'nullable|array',
        ]);
        $data['slug']      = Str::slug($data['name']) . '-' . Str::random(5);
        $data['seller_id'] = auth()->id();
        return response()->json(Product::create($data), 201);
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->seller_id !== auth()->id(), 403);
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'is_active'   => 'boolean',
        ]);
        $product->update($data);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        abort_if($product->seller_id !== auth()->id(), 403);
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
