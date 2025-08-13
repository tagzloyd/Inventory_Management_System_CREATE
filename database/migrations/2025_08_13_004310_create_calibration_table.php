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
        Schema::create('calibration', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('issued_to')->nullable();
                $table->string('freq_of_cal')->nullable();
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calibration');
    }
};
