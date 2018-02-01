import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HomeRoutingModule } from './home-routing.module'

import { HomeComponent } from './home/home.component';
import { WebsocketComponent } from './websocket/websocket.component'

@NgModule({
    imports: [
        CommonModule, FormsModule,HomeRoutingModule
    ],
    declarations: [HomeComponent, WebsocketComponent],
    bootstrap: [ HomeComponent ]
})
export class HomeModule { }
