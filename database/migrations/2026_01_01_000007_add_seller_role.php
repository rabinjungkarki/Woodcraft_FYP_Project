<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add seller to role enum
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->change(); // change to string to support seller
            $table->string('shop_name')->nullable()->after('address');
            $table->text('shop_description')->nullable()->after('shop_name');
        });

        // Link products to seller
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('seller_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['seller_id']);
            $table->dropColumn('seller_id');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['shop_name', 'shop_description']);
        });
    }
};
