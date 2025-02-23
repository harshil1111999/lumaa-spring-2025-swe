export interface Task {
    id: number;
    title: string;
    description: string | null;
    is_complete: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    username: string;
}