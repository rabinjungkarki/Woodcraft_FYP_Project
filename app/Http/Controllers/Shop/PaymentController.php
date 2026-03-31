<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function khalti(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        return inertia('shop/payment-khalti', ['order' => $order]);
    }

    public function khaltiVerify(Request $request, Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $request->validate(['token' => 'required|string', 'amount' => 'required|integer']);

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://khalti.com/api/v2/payment/verify/', [
            'token'  => $request->token,
            'amount' => $request->amount,
        ]);

        if ($response->successful()) {
            $order->update([
                'payment_status' => 'paid',
                'payment_ref'    => $request->token,
                'status'         => 'processing',
            ]);
            return redirect()->route('orders.show', $order->id)->with('success', 'Payment successful!');
        }

        return back()->withErrors(['payment' => 'Payment verification failed.']);
    }
}
