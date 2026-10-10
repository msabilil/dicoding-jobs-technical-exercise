<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyCreateTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return [
            'title' => 'Product Engineer', 'position' => 'Engineering',
            'employment_type' => 'Full-Time', 'candidate_count' => 2,
            'active_until' => today()->addMonth()->toDateString(),
            'location' => 'Bandung', 'is_remote' => true,
            'description' => '<p>Bangun produk.</p>', 'salary_min' => 6000000,
            'salary_max' => 9000000, 'show_salary' => true,
            'minimum_experience' => '1-3 tahun',
        ];
    }

    public function test_recruiter_can_create_a_vacancy(): void
    {
        $this->postJson('/api/vacancies', $this->payload())
            ->assertCreated()->assertJsonPath('data.title', 'Product Engineer')
            ->assertJsonPath('data.candidate_count', 2);

        $this->getJson('/api/vacancies')->assertJsonCount(1, 'data');
    }

    public function test_required_fields_and_invalid_numbers_return_field_errors(): void
    {
        $this->postJson('/api/vacancies', [])->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'position', 'employment_type', 'candidate_count', 'active_until', 'location', 'description', 'salary_min', 'minimum_experience']);

        $payload = $this->payload();
        $payload['title'] = '   ';
        $payload['candidate_count'] = 0;
        $payload['salary_max'] = 1;
        $payload['active_until'] = today()->subDay()->toDateString();
        $this->postJson('/api/vacancies', $payload)->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'candidate_count', 'salary_max', 'active_until']);
    }
}
