<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VacancyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'position' => 'Engineering',
            'employment_type' => 'Full-Time',
            'candidate_count' => 1,
            'active_until' => today()->addMonth()->toDateString(),
            'location' => 'Bandung',
            'is_remote' => false,
            'description' => '<p>Bangun produk yang berguna.</p>',
            'salary_min' => 6000000,
            'salary_max' => 9000000,
            'show_salary' => false,
            'minimum_experience' => '1-3 tahun',
        ];
    }
}
