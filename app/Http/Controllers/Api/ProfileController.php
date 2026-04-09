<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:users,email,' . $request->user()->id,
            'phone'   => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $request->user()->update($data);
        return response()->json($request->user()->fresh());
    }
}
