export type GradeTask = {
    name: string
    earned: number
    possible: number
    subcategory?: string
}

export type GradeCategory = {
    name: string
    weight: number
    subcategories?: string[]
    tasks: GradeTask[]
}

export type PerformanceSubject = {
    name: string
    teacher: string
    grade: number
    color: string
    categories: GradeCategory[]
}

export type GradingCategory = {
    id: number
    name: string
    weight: number
    subcategories: string[]
    subcategoryWeights?: Record<string, number>
}

export type SubjectRecord = {
    id?: number
    name: string
    teacher: string
    color: string
    categories: GradingCategory[]
}

export type ApiGradingCategory = {
    id: number
    name: string
    weight: number
    subcategories: ApiGradingCategory[]
}

export type ApiSubject = {
    id: number
    name: string
    teacher: string | null
    color: string | null
    categories: ApiGradingCategory[]
}

