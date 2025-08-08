<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_category', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps(); // creates created_at and updated_at columns
            
            // Set the charset and collation (matches your SQL)
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            
            // Add foreign key constraints (recommended)
            $table->foreign('inventory_id')->references('id')->on('inventory')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            
            // Set composite primary key
            $table->primary(['inventory_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_category');
    }
};