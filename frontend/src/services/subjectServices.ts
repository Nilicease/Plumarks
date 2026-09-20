import api from "../api/api"
import type {
    ApiSubject,
    SubjectRecord,
} from "../types/academic"

type SubjectResponse = {
    data: ApiSubject
}

type SubjectListResponse = {
    data: ApiSubject[]
}

export async function getSubjects(): Promise<ApiSubject[]> {
    const response = await api.get<SubjectListResponse>(
        "/api/subjects",
    )

    return response.data.data
}

export async function createSubject(
    subject: SubjectRecord,
): Promise<ApiSubject> {
    const response = await api.post<SubjectResponse>(
        "/api/subjects",
        toPayload(subject),
    )

    return response.data.data
}

export async function updateSubject(
    id: number,
    subject: SubjectRecord,
): Promise<ApiSubject> {
    const response = await api.put<SubjectResponse>(
        `/api/subjects/${id}`,
        toPayload(subject),
    )

    return response.data.data
}

export async function deleteSubject(
    id: number,
): Promise<void> {
    await api.delete(`/api/subjects/${id}`)
}

function toPayload(subject: SubjectRecord) {
    return {
        name: subject.name,
        teacher:
            subject.teacher === "No teacher added"
                ? null
                : subject.teacher,
        color: subject.color,

        categories: subject.categories.map((category) => {
            const subcategories = category.subcategories.map((subcategory) => ({
                name: subcategory.name,
                weight: subcategory.weight,
            }))

            return {
                name: category.name,
                weight: category.weight,

                ...(subcategories.length > 0
                    ? { subcategories }
                    : {}),
            }
        }),
    }
}

export function mapApiSubject(
    subject: ApiSubject,
): SubjectRecord {
    return {
        id: subject.id,
        name: subject.name,
        teacher:
            subject.teacher ?? "No teacher added",
        color:
            subject.color ?? "#128f96",

        categories: subject.categories.map(
            (category) => ({
                id: category.id,
                name: category.name,
                weight: category.weight,

                subcategories:
                    category.subcategories.map(
                        (subcategory) => ({
                            id: subcategory.id,
                            name: subcategory.name,
                            weight: subcategory.weight,
                        }),
                    ),
            }),
        ),
    }
}
