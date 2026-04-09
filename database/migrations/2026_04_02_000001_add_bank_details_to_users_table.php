<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('bank_name')->nullable()->after('shop_description');
            $table->string('bank_account_number')->nullable()->after('bank_name');
            $table->string('bank_account_name')->nullable()->after('bank_account_number');
            $table->string('bank_branch')->nullable()->after('bank_account_name');
            $table->string('id_type')->nullable()->after('bank_branch');
            $table->string('id_number')->nullable()->after('id_type');
            $table->enum('seller_status', ['pending', 'approved', 'rejected'])->default('pending')->after('id_number');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bank_name','bank_account_number','bank_account_name','bank_branch','id_type','id_number','seller_status']);
        });
    }
};
