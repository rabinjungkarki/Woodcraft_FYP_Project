<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SellerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isSeller()) {
            abort(403);
        }
        return $next($request);
    }
}
