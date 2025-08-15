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
        Schema::create('annual_preventive_maintenance', function (Blueprint $table) {
            $table->id();
            $table->string('daily')->nullable();
            $table->string('weekly')->nullable();
            $table->string('monthly')->nullable();
            $table->string('quarterly')->nullable();
            $table->string('semi_annually')->nullable();
            $table->string('annually')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annual_preventive_maintenance');
    }
};
