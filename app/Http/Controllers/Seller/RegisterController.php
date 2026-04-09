<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        if ($user->isSeller()) {
            return redirect()->route('seller.dashboard');
        }
        if ($user->role === 'pending_seller') {
            return Inertia::render('seller/register', ['pendingApproval' => true]);
        }
        return Inertia::render('seller/register', ['pendingApproval' => false]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shop_name'            => 'required|string|max:255',
            'shop_description'     => 'nullable|string|max:1000',
            'phone'                => 'required|string|max:20',
            'bank_name'            => 'required|string|max:255',
            'bank_account_number'  => 'required|string|max:30',
            'bank_account_name'    => 'required|string|max:255',
            'bank_branch'          => 'nullable|string|max:255',
            'id_type'              => 'required|in:citizenship,passport,license',
            'id_number'            => 'required|string|max:50',
        ]);

        auth()->user()->update([
            'role'                 => 'pending_seller',
            'shop_name'            => $request->shop_name,
            'shop_description'     => $request->shop_description,
            'phone'                => $request->phone,
            'bank_name'            => $request->bank_name,
            'bank_account_number'  => $request->bank_account_number,
            'bank_account_name'    => $request->bank_account_name,
            'bank_branch'          => $request->bank_branch,
            'id_type'              => $request->id_type,
            'id_number'            => $request->id_number,
            'seller_status'        => 'pending',
        ]);

        return redirect()->route('seller.register')->with('pending', true);
    }
}
