<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('position');
            $table->string('employment_type', 32);
            $table->unsignedSmallInteger('candidate_count');
            $table->date('active_until');
            $table->string('location');
            $table->boolean('is_remote')->default(false);
            $table->text('description');
            $table->unsignedBigInteger('salary_min');
            $table->unsignedBigInteger('salary_max')->nullable();
            $table->boolean('show_salary')->default(false);
            $table->string('minimum_experience', 32);
            $table->timestamps();
            $table->index(['active_until', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
