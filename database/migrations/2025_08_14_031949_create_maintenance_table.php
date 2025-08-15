<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('maintenance', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_id')->primary(); // Make inventory_id the primary key
            
            // Add foreign keys with cascade
            $table->foreign('inventory_id')
                  ->references('id')
                  ->on('inventory')
                  ->onDelete('cascade');

            $table->string('number_of_available_units')->nullable();
            $table->string('update_unit')->nullable();
            $table->string('remarks')->nullable();
            $table->string('maintenance_schedule')->nullable();
            $table->string('activities')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance');
    }
};