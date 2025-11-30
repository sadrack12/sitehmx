<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticias', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('date');
            $table->string('image')->nullable();
            $table->string('color')->nullable();
            $table->boolean('published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticias');
    }
};

