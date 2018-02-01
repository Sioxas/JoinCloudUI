import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
    selector: 'app-websocket',
    templateUrl: './websocket.component.html',
    styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit {

    textMessage: string
    responseMessages:string[]=[]
    constructor(private ws: WebsocketService) { }

    ngOnInit() {
        this.ws.open()
        this.ws.messageStream.subscribe(data=>{
            this.responseMessages.push(data)
        },error=>{
            this.responseMessages.push(error)
        })
    }

    send(){
        this.ws.send(this.textMessage)
    }

    clean(){
        this.responseMessages = []
    }

}
