import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { types } from './../common/types'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class WebsocketService {

    private socket: WebSocket

    private get state(): number {
        return this.socket.readyState
    }

    private wsSubject = new Subject()

    messageStream: Observable<any>

    constructor(private auth: AuthService) {
        this.messageStream = this.wsSubject.asObservable()
    }

    open() {
        if (!(this.socket && (this.state === types.websocketState.OPEN))) {
            let wsUri: string
            let port = location.port
            if (location.protocol === 'https:') {
                if (!port) {
                    port = '443'
                }
                wsUri = 'wss:'
            } else {
                if (!port) {
                    port = '80'
                }
                wsUri = 'ws:'
            }
            wsUri += '//' + location.hostname + ':' + port
            wsUri += '/api/ws/plugins/telemetry'
            this.auth.getAccessToken().subscribe(token => {
                const socket = new WebSocket(wsUri + '?token=' + token)
                socket.onopen = e => this.onOpen(e)
                socket.onmessage = e => this.onMessage(e)
                socket.onerror = e => this.onError(e)
                socket.onclose = e => this.onClose(e)
                this.socket = socket
            })
        }
    }

    private close() {
        this.socket.close()
    }

    send(data: any) {
        this.socket.send(data)
    }

    private onMessage(event: MessageEvent) {
        this.wsSubject.next(event.data)
    }

    private onError(event: Event) {
        this.wsSubject.error(event)
    }

    private onOpen(event: Event) {
        console.log('Websocket connected.')
    }

    private onClose(event: CloseEvent) {
        this.wsSubject.error(event)
    }
}
