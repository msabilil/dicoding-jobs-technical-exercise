<?php

namespace Tests\Unit;

use App\Http\Requests\StoreVacancyRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class VacancyValidationTest extends TestCase
{
    public function test_candidate_count_must_be_positive_and_salary_range_must_be_ordered(): void
    {
        $rules = (new StoreVacancyRequest())->rules();
        $input = [
            'title' => 'Product Engineer', 'position' => 'Engineering',
            'employment_type' => 'Full-Time', 'candidate_count' => 0,
            'active_until' => today()->addWeek()->toDateString(),
            'location' => 'Bandung', 'description' => '<p>Bangun produk.</p>',
            'salary_min' => 6000000, 'salary_max' => 5000000,
            'minimum_experience' => '1-3 tahun',
        ];

        $errors = Validator::make($input, $rules)->errors();
        $this->assertTrue($errors->has('candidate_count'));
        $this->assertTrue($errors->has('salary_max'));

        $input['candidate_count'] = 1;
        $input['salary_max'] = 7000000;
        $this->assertTrue(Validator::make($input, $rules)->passes());
    }
}
