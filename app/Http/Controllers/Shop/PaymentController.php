<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function khalti(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $user = auth()->user();

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://a.khalti.com/api/v2/epayment/initiate/', [
            'return_url'        => route('payment.khalti.verify', $order->id),
            'website_url'       => config('app.url'),
            'amount'            => (int) ($order->total * 100), // paisa
            'purchase_order_id' => (string) $order->id,
            'purchase_order_name' => 'Wood Kala Order #' . $order->id,
            'customer_info'     => [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $order->phone,
            ],
        ]);

        if ($response->successful() && $response->json('payment_url')) {
            return redirect($response->json('payment_url'));
        }

        Log::error('Khalti initiation failed', [
            'order_id' => $order->id,
            'status'   => $response->status(),
            'body'     => $response->json(),
        ]);

        // Show fallback page with error details
        return Inertia::render('shop/payment-khalti', [
            'order' => $order,
            'error' => $response->json('detail') ?? 'Could not initiate Khalti payment.',
        ]);
    }

    public function khaltiVerify(Request $request, Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $pidx = $request->query('pidx');

        if (! $pidx) {
            return redirect()->route('orders.show', $order->id)
                ->with('error', 'Payment was cancelled.');
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

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Payment successful! Your order is being processed. 🎉');
        }

        Log::error('Khalti verification failed', [
            'order_id' => $order->id,
            'pidx'     => $pidx,
            'status'   => $response->status(),
            'body'     => $response->json(),
        ]);

        return redirect()->route('orders.show', $order->id)
            ->with('error', 'Payment verification failed. If money was deducted, please contact support.');
    }
}
