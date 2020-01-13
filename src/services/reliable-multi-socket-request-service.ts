import { IReliableSocketEmitOptions } from "../interfaces/i-reliable-socket-emit-options";
import { ISocketEmitter } from "../interfaces/i-socket-emitter";
import { ReliableSocketRequestEmitter } from "../internal/reliable-socket-request-emitter";
import { ReliableSocketRequestReceiver } from "../internal/reliable-socket-request-receiver";

/**
 * Mostly for server side
 */
export class ReliableMultiSocketRequestService {
    private emitter: ReliableSocketRequestEmitter;
    private receiver: ReliableSocketRequestReceiver;

    public constructor() {
        this.emitter = new ReliableSocketRequestEmitter();
        this.receiver = new ReliableSocketRequestReceiver();
    }

    /**
     * Returns promise with response.
     *
     * @param eventName
     * @param emitDataPack
     * @param options
     */
    public emit(
        socket: ISocketEmitter,
        eventName: string,
        emitDataPack: any,
        options: Partial<IReliableSocketEmitOptions> = {},
    ): Promise<any> {
        return this.emitter.emit(socket, eventName, emitDataPack, options);
    }

    public on(socket: ISocketEmitter, eventName: string, callback: () => void) {
        this.receiver.on(socket, eventName, callback);
    }

    public once(
        socket: ISocketEmitter,
        eventName: string,
        callback: () => void,
    ) {
        this.receiver.once(socket, eventName, callback);
    }
}
