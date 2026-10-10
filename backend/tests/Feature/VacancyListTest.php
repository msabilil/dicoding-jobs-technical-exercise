<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyListTest extends TestCase
{
    use RefreshDatabase;

    public function test_empty_list_returns_an_empty_data_array(): void
    {
        $this->getJson('/api/vacancies')
            ->assertOk()
            ->assertExactJson(['data' => []]);
    }

    public function test_list_contains_only_active_vacancies_newest_first(): void
    {
        Vacancy::factory()->create(['title' => 'Lowongan lama', 'created_at' => now()->subDays(2)]);
        Vacancy::factory()->create(['title' => 'Lowongan kedaluwarsa', 'active_until' => today()->subDay()]);
        Vacancy::factory()->create(['title' => 'Lowongan terbaru', 'created_at' => now()->subDay()]);

        $this->getJson('/api/vacancies')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title', 'Lowongan terbaru')
            ->assertJsonPath('data.1.title', 'Lowongan lama');
    }
}
