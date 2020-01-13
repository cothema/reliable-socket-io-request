import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ng-socket-io';
import { SocketProvider, ReliableSocketRequestService } from 'reliable-socket-io-request';

@NgModule({
    imports: [SocketIoModule],
    providers: [ReliableSocketRequestService, SocketProvider],
})
export class ReliableSocketRequestNgxModule {
}
