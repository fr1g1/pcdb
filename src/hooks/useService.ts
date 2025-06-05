import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"

import { Id, Pc } from "../types"

const API_URL = "http://localhost:5000"
const headers: HeadersInit = {
    "Content-Type": "application/json",
}

export const queryClient = new QueryClient()

export const useFetchAllPcs = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetch(`${API_URL}/pcs`, { headers })
            if (!response.ok) {
                throw new Error("Failed to fetch data")
            }
            try {
                const data: { id: Id }[] = await response.json()
                return data
            } catch {
                throw new Error("Failed to parse response")
            }
        },
        queryKey: ["pcs"],
    })
}

export const useFetchPc = (id: Id) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetch(`${API_URL}/pc/${id}`, { headers })
            if (!response.ok) {
                throw new Error("Failed to fetch data")
            }
            try {
                const data: Pc = await response.json()
                return data
            } catch {
                throw new Error("Failed to parse response")
            }
        },
        queryKey: ["pc", { id }],
    })
}

type UseUpdateNoteParams = {
    onError?: () => void
    onFinish?: () => void
    onSuccess?: (notes: string) => void
}

export const useUpdateNote = ({ onError, onFinish, onSuccess, }: UseUpdateNoteParams) => {
    return useMutation({
        mutationFn: async (data: { pc_id: Id; notes: string }) => {
            const response = await fetch(`${API_URL}/update_notes`, {
                body: JSON.stringify(data),
                headers,
                method: 'POST',
            })
            if (!response.ok) {
                throw new Error("Failed to update data")
            }
            try {
                const data: { pc_id: Id } = await response.json()
                return data
            } catch {
                throw new Error("Failed to parse response")
            }
        },
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: ["pc", vars.pc_id] })
            queryClient.setQueryData(["pc", { id: vars.pc_id }], old => old ? ({ ...old, notes: vars.notes }) : old)
            onSuccess?.(vars.notes)
        },
        onSettled: onFinish,
        onError,
    })
}

type UseDeletePcParams = {
    onError?: () => void
    onFinish?: () => void
    onSuccess?: () => void
}

export const useDeletePc = ({ onError, onFinish, onSuccess }: UseDeletePcParams) => {
    return useMutation({
        mutationFn: async (data: { pcId: Id }) => {
            const response = await fetch(`${API_URL}/pc/${data.pcId}/delete`, {
                headers,
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error("Failed to update data")
            }
            try {
                const data: { pc_id: Id } = await response.json()
                return data
            } catch {
                throw new Error("Failed to parse response")
            }
        },
        onSuccess,
        onSettled: onFinish,
        onError,
    })
}
