<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::where('id', '!=', auth()->id())
                ->withCount('orders')
                ->latest()
                ->get(['id', 'name', 'email', 'role', 'phone', 'shop_name', 'created_at']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        abort_if($user->id === auth()->id(), 403);
        $request->validate(['role' => 'required|in:customer,seller,admin']);
        $user->update(['role' => $request->role]);
        return back()->with('success', "Role updated to {$request->role}.");
    }

    public function destroy(User $user)
    {
        abort_if($user->id === auth()->id(), 403);
        $user->delete();
        return back()->with('success', 'User deleted.');
    }
}
