import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    panelMode = 'normal'
    constructor(private auth: AuthService) { }
    ngOnInit() {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.
        if(this.auth.getLocalAccounts().length){
            this.panelMode='fast'
        }
    }
    switchPanelMode(mode){
        this.panelMode = mode
    }
}
