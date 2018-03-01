import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { LoginRoutingModule } from './login-routing.module'
import { LoginComponent } from './login/login.component'
import { LoginFormComponent } from './login-form/login-form.component'
import { FastLoginComponent } from './fast-login/fast-login.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent, LoginFormComponent, FastLoginComponent]
})
export class LoginModule { }
