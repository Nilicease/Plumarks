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
}

export type SubjectRecord = {
    name: string
    teacher: string
    color: string
    categories: GradingCategory[]
}

export type DashboardSubject = {
    name: string
    teacher: string
    grade: number
    color: string
    detail: string
}
