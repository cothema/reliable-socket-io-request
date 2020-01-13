import { ReliableSocketRequestInQueueType } from "../enums/reliable-socket-request-in-queue-type";

export interface IReliableSocketRequestPack {
    meta: {
        id: number;
        queueName: string;
        inQueueType: ReliableSocketRequestInQueueType;
    };
    body: any;
}
