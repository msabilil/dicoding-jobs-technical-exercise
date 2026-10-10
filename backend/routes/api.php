<?php

use App\Http\Requests\StoreVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/vacancies', function (Request $request) {
    $query = trim((string) $request->query('q', ''));
    return response()->json(['data' => Vacancy::query()
        ->whereDate('active_until', '>=', today())
        ->when($query !== '', fn ($builder) => $builder->whereRaw('LOWER(title) LIKE ?', ['%'.mb_strtolower($query).'%']))
        ->orderByDesc('created_at')
        ->orderByDesc('id')
        ->get()]);
});

Route::get('/vacancies/{vacancy}', function (Vacancy $vacancy) {
    return response()->json(['data' => $vacancy]);
});

Route::post('/vacancies', function (StoreVacancyRequest $request) {
    $data = $request->validated();
    $data['description'] = preg_replace('/<([a-z][a-z0-9]*)\b[^>]*>/i', '<$1>', strip_tags($data['description'], '<p><br><strong><em><ul><ol><li><h2><h3>'));
    $vacancy = Vacancy::create($data);
    return response()->json(['data' => $vacancy], 201);
});
