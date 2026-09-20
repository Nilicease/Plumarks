import type { GradeCategory, GradingCategory, GradeTask } from "../types/academic"

export function totalWeight(categories: Pick<GradingCategory, "weight">[]) {
    return categories.reduce((total, category) => total + category.weight, 0)
}

export function subcategoryWeightTotal(category: Pick<GradingCategory, "subcategories">) {
    return category.subcategories.reduce((total, subcategory) => total + subcategory.weight, 0)
}

export function categoryPercentage(category: GradeCategory) {
    const earned = category.tasks.reduce((total, task) => total + task.earned, 0)
    const possible = category.tasks.reduce((total, task) => total + task.possible, 0)
    return possible ? Math.round((earned / possible) * 100) : 0
}

export function taskPercentage(task: GradeTask) {
    return task.possible ? Math.round((task.earned / task.possible) * 100) : 0
}
