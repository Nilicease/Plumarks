import api from "../api/api"
import type {
    ApiGradeTask,
    GradeTask,
} from "../types/academic"

type TaskResponse = {
    data: ApiGradeTask
}

type TaskListResponse = {
    data: ApiGradeTask[]
}

export type CreateTaskData = {
    subjectId: number
    gradingCategoryId: number
    name: string
    earned: number
    possible: number
}

export type UpdateTaskData = {
    taskId: number
    gradingCategoryId: number
    name: string
    earned: number
    possible: number
}

function mapApiTask(task: ApiGradeTask): GradeTask {
    return {
        id: task.id,
        name: task.name,
        earned: task.earned_score,
        possible: task.possible_score,
        gradingCategoryId: task.grading_category_id,
    }
}

export async function getTasks(
    subjectId: number,
): Promise<GradeTask[]> {
    const response = await api.get<TaskListResponse>(
        `/api/subjects/${subjectId}/grades`,
    )

    return response.data.data.map(mapApiTask)
}

export async function createTask(
    data: CreateTaskData,
): Promise<GradeTask> {
    const response = await api.post<TaskResponse>(
        `/api/subjects/${data.subjectId}/grades`,
        {
            grading_category_id: data.gradingCategoryId,
            name: data.name,
            earned_score: data.earned,
            possible_score: data.possible,
        },
    )

    return mapApiTask(response.data.data)
}

export async function updateTask(
    data: UpdateTaskData,
): Promise<GradeTask> {
    const response = await api.put<TaskResponse>(
        `/api/grades/${data.taskId}`,
        {
            grading_category_id: data.gradingCategoryId,
            name: data.name,
            earned_score: data.earned,
            possible_score: data.possible,
        },
    )

    return mapApiTask(response.data.data)
}

export async function deleteTask(
    taskId: number,
): Promise<void> {
    await api.delete(`/api/grades/${taskId}`)
}
