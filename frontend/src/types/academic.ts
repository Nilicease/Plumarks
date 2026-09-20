export type GradeTask = {
    id: number
    name: string
    earned: number
    possible: number
    gradingCategoryId: number
}

export type Subcategory = {
    id: number
    name: string
    weight: number
}

export type GradeCategory = {
    id: number
    name: string
    weight: number
    subcategories: Subcategory[]
    tasks: GradeTask[]
}

export type GradingCategory = {
    id: number
    name: string
    weight: number
    subcategories: Subcategory[]
}

export type PerformanceSubject = {
    id: number
    name: string
    teacher: string
    grade: number
    color: string
    categories: GradeCategory[]
}

export type ApiGradeTask = {
    id: number
    subject_id: number
    grading_category_id: number
    name: string
    earned_score: number
    possible_score: number
    percentage: number
    created_at: string
    updated_at: string
}

export type ApiSubcategory = {
    id: number
    name: string
    weight: number
}

export type ApiGradingCategory = {
    id: number
    name: string
    weight: number
    subcategories: ApiSubcategory[]
}

export type ApiSubject = {
    id: number
    name: string
    teacher: string | null
    color: string | null
    categories: ApiGradingCategory[]
    final_grade?: number
}

export type DashboardData = {
    subjects: ApiSubject[]
    overall_average: number | null
}

export type SubjectRecord = {
    id?: number
    name: string
    teacher: string
    color: string
    categories: GradingCategory[]
}
