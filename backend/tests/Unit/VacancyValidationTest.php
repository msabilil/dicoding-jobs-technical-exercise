<?php

namespace Tests\Unit;

use App\Http\Requests\StoreVacancyRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class VacancyValidationTest extends TestCase
{
    public function test_required_fields_reject_missing_and_whitespace_values(): void
    {
        $rules = (new StoreVacancyRequest())->rules();
        $missing = Validator::make([], $rules)->errors();
        foreach (['title', 'position', 'employment_type', 'candidate_count', 'active_until', 'location', 'description', 'salary_min', 'minimum_experience'] as $field) {
            $this->assertTrue($missing->has($field), "$field should be required");
        }

        $input = [
            'title' => '   ', 'position' => 'Engineering',
            'employment_type' => 'Full-Time', 'candidate_count' => 1,
            'active_until' => today()->addWeek()->toDateString(),
            'location' => 'Bandung', 'description' => '<p>Bangun produk.</p>',
            'salary_min' => null, 'minimum_experience' => '1-3 tahun',
        ];
        $errors = Validator::make($input, $rules)->errors();
        $this->assertTrue($errors->has('title'));
        $this->assertTrue($errors->has('salary_min'));
    }

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
