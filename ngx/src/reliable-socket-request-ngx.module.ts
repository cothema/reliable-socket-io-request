import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ng-socket-io';
import { ReliableSocketRequestService } from 'reliable-socket-io-request';

@NgModule({
    imports: [SocketIoModule],
    providers: [ReliableSocketRequestService],
})
export class ReliableSocketRequestNgxModule {
}
