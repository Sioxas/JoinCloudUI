import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {HttpClientModule} from '@angular/common/http'

import { HomeModule } from './home/home.module'
import { LoginModule } from './login/login.module'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

import { AuthenticationService } from './services/authentication.service'
import { UserService } from './services/user.service'


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HomeModule,
        LoginModule,
        AppRoutingModule
    ],
    providers: [UserService, AuthenticationService],
    bootstrap: [AppComponent]
})
export class AppModule { }
