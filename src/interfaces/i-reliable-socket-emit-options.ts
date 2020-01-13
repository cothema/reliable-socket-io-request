import { InQueueType } from "../enums/in-queue-type";

export interface IReliableSocketEmitOptions {
    /**
     * Interval when request is sent again.
     * In ms.
     */
    retryTime: number;

    /**
     * Maximum number of emit tries.
     * 0 = infinite
     */
    maxTryCount: number;

    /**
     * Request can be handled in specific queue with defined inQueueType
     * (e.g. you can overwrite all previous requests if they failed)
     */
    queueName: string;

    /**
     * inQueueType defines how the request should be handled in a queue.
     */
    inQueueType: InQueueType;
}
