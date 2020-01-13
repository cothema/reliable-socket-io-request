import { IReliableSocketRequest } from "./i-reliable-socket-request";

export interface IReliableSocketRequestQueues {
    [key: string]: IReliableSocketRequest[];
}
