import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'

import { AuthService } from './../../services/auth.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup
    constructor(private fb: FormBuilder, private auth: AuthService,private http:HttpClient) { }

    ngOnInit() {
        this.creatForm()
    }

    creatForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSubmit(){
        let formValue = this.loginForm.value
        this.auth.login(formValue.username,formValue.password)
    }

}
