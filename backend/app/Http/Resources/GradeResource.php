<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $possible = (float) $this->possible_score;
        $percentage = $possible > 0
            ? round(((float) $this->earned_score / $possible) * 100, 2)
            : 0;

        return [
            'id' => $this->id,
            'subject_id' => $this->subject_id,
            'grading_category_id' => $this->grading_category_id,
            'grading_subcategory_id' => $this->grading_subcategory_id,
            'name' => $this->name,
            'earned_score' => (float) $this->earned_score,
            'possible_score' => $possible,
            'percentage' => $percentage,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
