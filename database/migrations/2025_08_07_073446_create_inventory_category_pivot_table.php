<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_category', function (Blueprint $table) {
            $table->foreignId('inventory_id')->constrained('inventory');
            $table->foreignId('category_id')->constrained('categories');
            $table->timestamps();
            
            $table->primary(['inventory_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_category');
    }
};
