<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::where('role', 'customer')
                ->withCount('orders')
                ->latest()
                ->get(['id', 'name', 'email', 'phone', 'created_at']),
        ]);
    }
}
