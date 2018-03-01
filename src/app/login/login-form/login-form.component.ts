import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from './../../services/auth.service'

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    loginForm: FormGroup

    constructor(private fb: FormBuilder,private auth: AuthService) { }

    ngOnInit() {
        this.creatForm()
    }

    creatForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSubmit() {
        let formValue = this.loginForm.value
        this.auth.login(formValue.username, formValue.password)
    }

}
