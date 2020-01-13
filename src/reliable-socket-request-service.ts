import { IReliableSocketEmitOptions } from "./interfaces/i-reliable-socket-emit-options";
import { ISocketEmitter } from "./interfaces/i-socket-emitter";
import { ReliableSocketRequestEmitter } from "./internal/reliable-socket-request-emitter";
import { ReliableSocketRequestReceiver } from "./internal/reliable-socket-request-receiver";

export class ReliableSocketRequestService {
    private emitter: ReliableSocketRequestEmitter;
    private receiver: ReliableSocketRequestReceiver;

    public constructor(private socket: ISocketEmitter) {
        this.emitter = new ReliableSocketRequestEmitter(socket);
        this.receiver = new ReliableSocketRequestReceiver(socket);
    }

    /**
     * Returns promise with response.
     *
     * @param eventName
     * @param emitDataPack
     * @param options
     */
    public emit(
        eventName: string,
        emitDataPack: any,
        options: IReliableSocketEmitOptions,
    ): Promise<any> {
        return this.emitter.emit(eventName, emitDataPack, options);
    }

    public on(eventName: string, callback: () => void) {
        this.receiver.on(eventName, callback);
    }

    public once(eventName: string, callback: () => void) {
        this.receiver.once(eventName, callback);
    }
}
