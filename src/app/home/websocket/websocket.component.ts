import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MySubscription } from '../../class/my-subject';

@Component({
    selector: 'app-websocket',
    templateUrl: './websocket.component.html',
    styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit,OnDestroy {

    textMessage = `
    {"tsSubCmds":[{"entityType":"DEVICE","entityId":"8f4497c0-1c87-11e8-aded-5d4885335f93","keys":"temperature","cmdId":1},{"entityType":"DEVICE","entityId":"8f4497c0-1c87-11e8-aded-5d4885335f93","keys":"humidity","cmdId":2}],"historyCmds":[],"attrSubCmds":[]}
    `
    responseMessages:string[]=[]

    private sub:MySubscription
    constructor(private ws: WebsocketService) { }

    ngOnInit() {
        this.ws.open()
        this.sub = this.ws.mySuject.subscribe(data=>{
            this.responseMessages.push(data)
        })
    }

    send(){
        this.ws.send(this.textMessage)
    }

    clean(){
        this.responseMessages = []
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.ws.close()
        this.sub.unsubscribe()
    }

}
