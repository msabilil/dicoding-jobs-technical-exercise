<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:100'],
            'employment_type' => ['required', Rule::in(['Full-Time', 'Part-Time', 'Kontrak', 'Intern'])],
            'candidate_count' => ['required', 'integer', 'min:1', 'max:65535'],
            'active_until' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'location' => ['required', 'string', 'max:100'],
            'is_remote' => ['sometimes', 'boolean'],
            'description' => ['required', 'string', 'max:20000'],
            'salary_min' => ['required', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'show_salary' => ['sometimes', 'boolean'],
            'minimum_experience' => ['required', Rule::in(['Kurang dari 1 tahun', '1-3 tahun', '4-5 tahun', '6-10 tahun', 'Lebih dari 10 tahun'])],
        ];
    }
}
