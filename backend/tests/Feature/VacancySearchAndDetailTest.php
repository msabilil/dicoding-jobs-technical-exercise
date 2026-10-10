<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancySearchAndDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_matches_partial_title_case_insensitively(): void
    {
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->create(['title' => 'iOS Developer']);
        Vacancy::factory()->create(['title' => 'Product Engineer']);

        $this->getJson('/api/vacancies?q=DEVELOPER')->assertOk()->assertJsonCount(2, 'data');
        $this->getJson('/api/vacancies?q=%20%20')->assertOk()->assertJsonCount(3, 'data');
        $this->getJson('/api/vacancies?q=designer')->assertOk()->assertExactJson(['data' => []]);
    }

    public function test_detail_returns_one_vacancy_or_not_found(): void
    {
        $vacancy = Vacancy::factory()->create(['title' => 'Product Engineer']);
        $this->getJson("/api/vacancies/{$vacancy->id}")->assertOk()
            ->assertJsonPath('data.title', 'Product Engineer');
        $this->getJson('/api/vacancies/99999')->assertNotFound();
    }
}
