export interface ISocketEmitter {
    emit(
        eventName: string,
        data?: any,
        callback?: (response: any) => void,
    ): any;

    on(eventName: string, callback: (response: any) => void): void;

    once(eventName: string, callback: (response: any) => void): void;
}
