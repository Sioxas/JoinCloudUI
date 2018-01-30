import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { HomeModule } from './home/home.module'
import { LoginModule } from './login/login.module'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './interceptor/auth-interceptor'


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
    providers: [UserService, AuthService,{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor, 
        multi: true,
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
