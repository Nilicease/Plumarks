<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class GradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'grading_category_id' => ['required', 'integer', 'exists:grading_categories,id'],
            'grading_subcategory_id' => ['nullable', 'integer', 'exists:grading_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'earned_score' => ['required', 'numeric', 'min:0'],
            'possible_score' => ['required', 'numeric', 'gt:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator): void {
            if ((float) $this->input('earned_score', 0) > (float) $this->input('possible_score', 0)) {
                $validator->errors()->add('earned_score', 'Earned score cannot exceed possible score.');
            }
        });
    }
}
