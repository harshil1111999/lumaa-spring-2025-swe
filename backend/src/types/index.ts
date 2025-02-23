export interface User {
    id: number;
    username: string;
    password: string;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    is_complete: boolean;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
    };
}