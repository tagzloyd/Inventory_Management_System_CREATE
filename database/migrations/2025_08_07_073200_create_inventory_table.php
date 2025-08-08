<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id(); // Creates unsigned bigint auto-increment primary key
            $table->string('equipment_name', 255);
            $table->string('serial_number', 255)->nullable();
            $table->string('date_acquired', 255)->nullable();
            $table->text('notes')->nullable();
            $table->string('remarks', 255)->default('Functional');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('office_id')->nullable();
            $table->unsignedBigInteger('faculty_id')->nullable();
            $table->timestamps(); // Creates created_at and updated_at columns

            // Set charset and collation
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';

            // Foreign key constraints (assuming these tables exist)
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('set null');
            $table->foreign('faculty_id')->references('id')->on('faculty')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};