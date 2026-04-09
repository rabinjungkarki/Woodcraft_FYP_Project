<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BuyerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && ($request->user()->isSeller() || $request->user()->isAdmin())) {
            return redirect('/seller/dashboard')->with('error', 'Please use the seller panel.');
        }

        return $next($request);
    }
}
