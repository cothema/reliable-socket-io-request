import { IReliableSocketEmitOptions } from "../interfaces/i-reliable-socket-emit-options";
import { ReliableSocketRequestEmitter } from "../internal/reliable-socket-request-emitter";
import { ReliableSocketRequestReceiver } from "../internal/reliable-socket-request-receiver";
import { SocketProvider } from "../providers/socket-provider";

/**
 * Mostly for client side
 */
export class ReliableSocketRequestService {
    private emitter: ReliableSocketRequestEmitter;
    private receiver: ReliableSocketRequestReceiver;

    public constructor(private socketProvider: SocketProvider) {
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
        eventName: string,
        emitDataPack: any,
        options: Partial<IReliableSocketEmitOptions> = {},
    ): Promise<any> {
        if (this.socketProvider.socket) {
            return this.emitter.emit(
                this.socketProvider.socket,
                eventName,
                emitDataPack,
                options,
            );
        } else {
            throw Error("No provided socket!");
        }
    }

    public on(eventName: string, callback: () => void) {
        if (this.socketProvider.socket) {
            this.receiver.on(this.socketProvider.socket, eventName, callback);
        } else {
            throw Error("No provided socket!");
        }
    }

    public once(eventName: string, callback: () => void) {
        if (this.socketProvider.socket) {
            this.receiver.once(this.socketProvider.socket, eventName, callback);
        } else {
            throw Error("No provided socket!");
        }
    }
}
