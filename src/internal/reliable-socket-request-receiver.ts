import { IReliableSocketRequestPack } from "../interfaces/i-reliable-socket-request-pack";
import { IReliableSocketRequestQueues } from "../interfaces/i-reliable-socket-request-queues";
import { ISocketEmitter } from "../interfaces/i-socket-emitter";

export class ReliableSocketRequestReceiver {
    private emitQueuesConfirmations: IReliableSocketRequestQueues = {
        default: [],
    };

    public constructor(private socket: ISocketEmitter) {}

    public on(eventName: string, callback: (response: any) => void) {
        this.socket.on(eventName, (response: IReliableSocketRequestPack) => {
            callback(response.body);
        });
    }

    public once(eventName: string, callback: (response: any) => void) {
        this.socket.once(eventName, (response: IReliableSocketRequestPack) => {
            callback(response.body);
        });
    }
}
