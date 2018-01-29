import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

const appRoutes:Routes = [
    
    {
        path:'',
        loadChildren:'./home/home.module#HomeModule'
    },
    {
        path:'login',
        loadChildren:'./login/login.module#LoginModule'
    },
    {
        path:'**',
        component:PageNotFoundComponent
    },
]

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes,{
            enableTracing:false
        })
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{}
