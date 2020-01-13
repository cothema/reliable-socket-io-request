import { InQueueType } from "../enums/in-queue-type";
import { IReliableSocketEmitOptions } from "../interfaces/i-reliable-socket-emit-options";
import { IReliableSocketRequest } from "../interfaces/i-reliable-socket-request";
import { IReliableSocketRequestPack } from "../interfaces/i-reliable-socket-request-pack";
import { IReliableSocketRequestQueues } from "../interfaces/i-reliable-socket-request-queues";
import { ISocketEmitter } from "../interfaces/i-socket-emitter";

export class ReliableSocketRequestEmitter {
    private defaultEmitOptions = {
        inQueueType: InQueueType.anytime,
        maxTryCount: 0,
        queueName: "default",
        retryTime: 1000,
    };
    private emitQueues: IReliableSocketRequestQueues = {
        default: [],
    };
    private emitRequestCounter = 0;

    public emit(
        socket: ISocketEmitter,
        eventName: string,
        emitDataPack: any,
        optionsIn: Partial<IReliableSocketEmitOptions> = this
            .defaultEmitOptions,
    ): Promise<any> {
        const options: IReliableSocketEmitOptions = Object.assign(
            {},
            this.defaultEmitOptions,
            optionsIn,
        );

        const socketRequest = {
            eventName,
            id: this.emitRequestCounter++,
            isCompleted: false,
            options,
            socket,
        } as IReliableSocketRequest;

        this.emitQueues[options.queueName].push(socketRequest);

        emitDataPack.requestCounter = this.emitRequestCounter;

        return this.createEmitPromise(socket, socketRequest, options);
    }

    private removeFromEmitQueue(socketRequest: IReliableSocketRequest) {
        this.emitQueues[socketRequest.options.queueName].splice(
            this.emitQueues[socketRequest.options.queueName].indexOf(
                socketRequest,
            ),
            1,
        );
    }

    private createEmitPromise(
        socket: ISocketEmitter,
        socketRequest: IReliableSocketRequest,
        options: IReliableSocketEmitOptions,
    ): Promise<any> {
        return new Promise(resolve => {
            socketRequest.isCompleted = false;

            this.emitRequest(socket, socketRequest, response => {
                resolve(response);
            });

            socketRequest.interval = setInterval(() => {
                this.emitRequest(socket, socketRequest, response => {
                    resolve(response);
                });
            }, options.retryTime);
        });
    }

    /**
     * Emit the request in a package and mark as completed if success
     */
    private emitRequest(
        socket: ISocketEmitter,
        socketRequest: IReliableSocketRequest,
        callback: (response: any) => void,
    ): void {
        if (socketRequest.isCompleted) {
            if (socketRequest.interval) {
                clearInterval(socketRequest.interval);
            }
            return;
        }

        if (socket) {
            socket.emit(
                socketRequest.eventName,
                this.createEmitPack(socketRequest, socketRequest.options),
                (response: any) => {
                    socketRequest.isCompleted = true;
                    this.removeFromEmitQueue(socketRequest);

                    if (socketRequest.interval) {
                        clearInterval(socketRequest.interval);
                    }

                    callback(response);
                },
            );
        } else {
            throw Error("No provided socket!");
        }
    }

    /**
     * Create transfer package with meta information
     */
    private createEmitPack(
        data: any,
        options: IReliableSocketEmitOptions,
    ): IReliableSocketRequestPack {
        return {
            body: data,
            meta: {
                id: this.emitRequestCounter,
                inQueueType: options.inQueueType,
                queueName: options.queueName,
            },
        };
    }
}
