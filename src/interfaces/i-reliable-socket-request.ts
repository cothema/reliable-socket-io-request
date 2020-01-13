import { IReliableSocketEmitOptions } from './i-reliable-socket-emit-options';

export interface IReliableSocketRequest {
    id: number;
    eventName: string;
    options: IReliableSocketEmitOptions;
    interval?: any;
    isCompleted: boolean;
    tryCountLeft: number;
    /**
     * Data for transfer
     */
    body: any;
}
