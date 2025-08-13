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
         Schema::create('planned', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cal_id')->constrained('calibration');;
                $table->string('jan')->nullable();
                $table->string('feb')->nullable();
                $table->string('mar')->nullable();
                $table->string('apr')->nullable();
                $table->string('may')->nullable();
                $table->string('jun')->nullable();
                $table->string('jul')->nullable();
                $table->string('aug')->nullable();
                $table->string('sep')->nullable();
                $table->string('oct')->nullable();
                $table->string('nov')->nullable();
                $table->string('dec')->nullable();
                $table->timestamps();
            });
            Schema::create('actual', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cal_id')->constrained('calibration');
                $table->string('jan')->nullable();
                $table->string('feb')->nullable();
                $table->string('mar')->nullable();
                $table->string('apr')->nullable();
                $table->string('may')->nullable();
                $table->string('jun')->nullable();
                $table->string('jul')->nullable();
                $table->string('aug')->nullable();
                $table->string('sep')->nullable();
                $table->string('oct')->nullable();
                $table->string('nov')->nullable();
                $table->string('dec')->nullable();
                $table->timestamps();
            });
            Schema::create('remarks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cal_id')->constrained('calibration');
                $table->string('jan')->nullable();
                $table->string('feb')->nullable();
                $table->string('mar')->nullable();
                $table->string('apr')->nullable();
                $table->string('may')->nullable();
                $table->string('jun')->nullable();
                $table->string('jul')->nullable();
                $table->string('aug')->nullable();
                $table->string('sep')->nullable();
                $table->string('oct')->nullable();
                $table->string('nov')->nullable();
                $table->string('dec')->nullable();
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planned');
        Schema::dropIfExists('actual');
        Schema::dropIfExists('remarks');
    }
};
