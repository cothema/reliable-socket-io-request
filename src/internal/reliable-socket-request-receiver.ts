import { IReliableSocketRequestPack } from "../interfaces/i-reliable-socket-request-pack";
import { IReliableSocketRequestQueues } from "../interfaces/i-reliable-socket-request-queues";
import { ISocketEmitter } from "../interfaces/i-socket-emitter";

export class ReliableSocketRequestReceiver {
    private emitQueuesConfirmations: IReliableSocketRequestQueues = {
        default: [],
    };

    public on(
        socket: ISocketEmitter,
        eventName: string,
        callback: (response: any) => void,
    ) {
        socket.on(eventName, (response: IReliableSocketRequestPack) => {
            callback(response.body);
        });
    }

    public once(
        socket: ISocketEmitter,
        eventName: string,
        callback: (response: any) => void,
    ) {
        socket.once(eventName, (response: IReliableSocketRequestPack) => {
            callback(response.body);
        });
    }
}
