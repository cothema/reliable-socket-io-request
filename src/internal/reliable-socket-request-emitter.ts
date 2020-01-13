import { ReliableSocketRequestInQueueType } from '../enums/reliable-socket-request-in-queue-type';
import { IReliableSocketEmitOptions } from '../interfaces/i-reliable-socket-emit-options';
import { IReliableSocketRequest } from '../interfaces/i-reliable-socket-request';
import { IReliableSocketRequestPack } from '../interfaces/i-reliable-socket-request-pack';
import { IReliableSocketRequestQueues } from '../interfaces/i-reliable-socket-request-queues';
import { ISocketEmitter } from '../interfaces/i-socket-emitter';

export class ReliableSocketRequestEmitter {
    private defaultEmitOptions = {
        inQueueType: ReliableSocketRequestInQueueType.anytime,
        maxTryCount: 0,
        queueName: 'default',
        retryTime: 1000,
    };
    private emitQueues: IReliableSocketRequestQueues = {
        default: [],
    };
    private emitRequestCounter = 0;

    public constructor(private socket: ISocketEmitter) {
    }

    public emit(
        eventName: string,
        emitDataPack: any,
        options: IReliableSocketEmitOptions = this.defaultEmitOptions,
    ): Promise<any> {
        options = Object.assign({}, this.defaultEmitOptions, options);

        const socketRequest = {
            eventName,
            id: this.emitRequestCounter++,
            isCompleted: false,
            options,
        } as IReliableSocketRequest;

        this.emitQueues[options.queueName].push(socketRequest);

        emitDataPack.requestCounter = this.emitRequestCounter;

        return this.createEmitPromise(socketRequest, options);
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
        socketRequest: IReliableSocketRequest,
        options: IReliableSocketEmitOptions,
    ): Promise<any> {
        return new Promise(resolve => {
            socketRequest.isCompleted = false;

            this.emitRequest(socketRequest, response => {
                resolve(response);
            });

            socketRequest.interval = setInterval(() => {
                this.emitRequest(socketRequest, response => {
                    resolve(response);
                });
            }, options.retryTime);
        });
    }

    /**
     * Emit the request in a package and mark as completed if success
     */
    private emitRequest(
        socketRequest: IReliableSocketRequest,
        callback: (response: any) => void,
    ): void {
        if (socketRequest.isCompleted) {
            if (socketRequest.interval) {
                clearInterval(socketRequest.interval);
            }
            return;
        }

        this.socket.emit(
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
