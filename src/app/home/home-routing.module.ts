import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './home/home.component'
import { WebsocketComponent } from './websocket/websocket.component'

const homeRoutes:Routes = [
    {
        path:'',
        component:HomeComponent,
        children:[
            {
                path:'',
                component:WebsocketComponent
            }
        ]
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(homeRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class HomeRoutingModule{}
