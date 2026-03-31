<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        if (auth()->check() && auth()->user()->isSeller()) {
            return redirect()->route('seller.dashboard');
        }
        return Inertia::render('seller/register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'shop_name'        => 'required|string|max:255',
            'shop_description' => 'nullable|string|max:1000',
            'phone'            => 'required|string',
        ]);

        auth()->user()->update([
            'role'             => 'seller',
            'shop_name'        => $request->shop_name,
            'shop_description' => $request->shop_description,
            'phone'            => $request->phone,
        ]);

        return redirect()->route('seller.dashboard')->with('success', 'Seller account activated!');
    }
}
