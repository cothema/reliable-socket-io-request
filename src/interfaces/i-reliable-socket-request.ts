import { IReliableSocketEmitOptions } from "./i-reliable-socket-emit-options";
import { ISocketEmitter } from "./i-socket-emitter";

export interface IReliableSocketRequest {
    id: number;
    eventName: string;
    options: IReliableSocketEmitOptions;
    interval?: any;
    isCompleted: boolean;
    socket: ISocketEmitter;
}
