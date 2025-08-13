<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inventory_category', function (Blueprint $table) {
            // First drop existing foreign keys
            $table->dropForeign(['inventory_id']);
            $table->dropForeign(['category_id']);
            
            // Then recreate with cascade
            $table->foreign('inventory_id')
                  ->references('id')
                  ->on('inventory')
                  ->onDelete('cascade');
                  
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('inventory_category', function (Blueprint $table) {
            // Reverse the changes if needed
            $table->dropForeign(['inventory_id']);
            $table->dropForeign(['category_id']);
            
            $table->foreign('inventory_id')
                  ->references('id')
                  ->on('inventory');
                  
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories');
        });
    }
};