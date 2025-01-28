import { MyEvent, Comment } from "./my-event";


export interface EventsResponse {
    events: MyEvent[];
    more: boolean;
    page: number;
    count: number
}

export interface SingleEventResponse {
    event: MyEvent;
}

export interface CommentsResponse {
    comments: Comment[];
}
