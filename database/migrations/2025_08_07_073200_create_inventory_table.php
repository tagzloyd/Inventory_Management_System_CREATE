<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->string('equipment_name');
            $table->string('serial_number')->nullable();
            $table->string('date_acquired')->nullable();
            $table->text('notes')->nullable();
            $table->string('remarks')->default('Functional');
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->foreignId('office_id')->nullable()->constrained('offices');
            $table->foreignId('faculty_id')->nullable()->constrained('faculty');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};