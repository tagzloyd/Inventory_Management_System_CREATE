<?php
// inventory migration - should run SECOND
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            
            // Add this check if you might run migrations separately
            if (Schema::hasTable('categories')) {
                $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            } else {
                $table->unsignedBigInteger('category_id');
                // You'll need to add the foreign key later in a separate migration
            }
            
            $table->string('equipment_name');
            $table->string('model')->nullable();
            $table->string('serial_number')->unique();
            $table->date('date_acquired');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};