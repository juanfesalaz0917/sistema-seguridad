export interface Password {
    id: number;
    user_id: number;
    content: string;
    startAt: Date;
    endAt: Date;
}