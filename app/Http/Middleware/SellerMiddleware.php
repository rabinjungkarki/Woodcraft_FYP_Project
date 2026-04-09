<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SellerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return redirect('/seller/login');
        }

        // Both sellers and admins can access seller panel
        if (!$request->user()->isSeller() && !$request->user()->isAdmin()) {
            if ($request->user()->role === 'pending_seller') {
                return redirect()->route('seller.register')->with('error', 'Your seller account is pending admin approval.');
            }
            return redirect('/shop')->with('error', 'Seller access required.');
        }

        return $next($request);
    }
}
