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

        // Initiate Khalti ePay (v2)
        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://a.khalti.com/api/v2/epayment/initiate/', [
            'return_url'       => route('payment.khalti.verify', $order->id),
            'website_url'      => config('app.url'),
            'amount'           => (int) ($order->total * 100), // paisa
            'purchase_order_id'=> (string) $order->id,
            'purchase_order_name' => 'Wood Kala Order #' . $order->id,
        ]);

        if ($response->successful()) {
            return redirect($response->json('payment_url'));
        }

        return back()->with('error', 'Could not initiate Khalti payment. Please try again.');
    }

    public function khaltiVerify(Request $request, Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $pidx = $request->query('pidx');

        if (!$pidx) {
            return redirect()->route('orders.show', $order->id)->with('error', 'Payment cancelled.');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://a.khalti.com/api/v2/epayment/lookup/', [
            'pidx' => $pidx,
        ]);

        if ($response->successful() && $response->json('status') === 'Completed') {
            $order->update([
                'payment_status' => 'paid',
                'payment_ref'    => $pidx,
                'status'         => 'processing',
            ]);
            return redirect()->route('orders.show', $order->id)->with('success', 'Payment successful! 🎉');
        }

        return redirect()->route('orders.show', $order->id)->with('error', 'Payment verification failed.');
    }
}
