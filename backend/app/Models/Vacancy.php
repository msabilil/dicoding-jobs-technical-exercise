<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'position', 'employment_type', 'candidate_count', 'active_until',
        'location', 'is_remote', 'description', 'salary_min', 'salary_max',
        'show_salary', 'minimum_experience',
    ];

    protected function casts(): array
    {
        return [
            'active_until' => 'date:Y-m-d',
            'is_remote' => 'boolean',
            'show_salary' => 'boolean',
            'candidate_count' => 'integer',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
        ];
    }
}
