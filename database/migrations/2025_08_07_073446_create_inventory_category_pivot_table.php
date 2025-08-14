<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventory_category', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_id');
            $table->unsignedBigInteger('category_id');
            
            // Add foreign keys with cascade
            $table->foreign('inventory_id')
                  ->references('id')
                  ->on('inventory')
                  ->onDelete('cascade');
                  
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('cascade');
                  
            // Set composite primary key
            $table->primary(['inventory_id', 'category_id']);
            // Add timestamps
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventory_category');
    }
};