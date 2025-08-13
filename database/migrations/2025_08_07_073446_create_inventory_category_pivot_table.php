<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inventory_category', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['inventory_id']);
            $table->dropForeign(['category_id']);
            
            // Re-add with cascade
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
        Schema::dropIfExists('inventory_category');
    }

};