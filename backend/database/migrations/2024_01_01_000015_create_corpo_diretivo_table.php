<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('corpo_diretivo', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cargo');
            $table->text('bio')->nullable();
            $table->string('image')->nullable();
            $table->boolean('published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('corpo_diretivo');
    }
};

