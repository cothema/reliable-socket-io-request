import { InQueueType } from "../enums/in-queue-type";

export interface IReliableSocketRequestPack {
    meta: {
        id: number;
        queueName: string;
        inQueueType: InQueueType;
    };
    body: any;
}
