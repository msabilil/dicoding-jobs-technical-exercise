<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardVacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_lists_all_vacancies_including_expired_ones(): void
    {
        Vacancy::factory()->create(['title' => 'Lowongan lama', 'active_until' => today()->subDay()]);
        Vacancy::factory()->create(['title' => 'Lowongan aktif']);

        $this->getJson('/api/dashboard/vacancies')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title', 'Lowongan aktif');
    }

    public function test_dashboard_can_update_and_delete_a_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();
        $payload = Vacancy::factory()->raw(['title' => 'Product Engineer Baru']);

        $this->putJson("/api/vacancies/{$vacancy->id}", $payload)->assertOk()
            ->assertJsonPath('data.title', 'Product Engineer Baru');
        $this->getJson("/api/vacancies/{$vacancy->id}")
            ->assertJsonPath('data.title', 'Product Engineer Baru');

        $this->putJson("/api/vacancies/{$vacancy->id}", ['title' => ''])
            ->assertUnprocessable()->assertJsonValidationErrors(['title', 'position']);

        $this->deleteJson("/api/vacancies/{$vacancy->id}")->assertNoContent();
        $this->getJson("/api/vacancies/{$vacancy->id}")->assertNotFound();
    }
}
