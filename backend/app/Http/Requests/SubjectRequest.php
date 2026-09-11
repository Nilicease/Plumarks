<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'teacher' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:32'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*.name' => ['required', 'string', 'max:255'],
            'categories.*.weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'categories.*.subcategories' => ['sometimes', 'array'],
            'categories.*.subcategories.*.name' => ['required', 'string', 'max:255'],
            'categories.*.subcategories.*.weight' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $categories = $this->input('categories', []);
            $topLevelTotal = collect($categories)->sum(fn (array $category): float => (float) ($category['weight'] ?? 0));

            if (round($topLevelTotal, 2) !== 100.0) {
                $validator->errors()->add('categories', 'Top-level category weights must total 100%.');
            }

            foreach ($categories as $index => $category) {
                if (!array_key_exists('subcategories', $category)) {
                    continue;
                }

                $subcategories = $category['subcategories'] ?? [];
                $nestedTotal = collect($subcategories)->sum(fn (array $subcategory): float => (float) ($subcategory['weight'] ?? 0));

                if (round($nestedTotal, 2) !== 100.0) {
                    $validator->errors()->add("categories.{$index}.subcategories", 'Sub-category weights must total 100%.');
                }
            }
        });
    }
}
