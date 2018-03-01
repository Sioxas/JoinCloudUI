import { Component, OnInit } from '@angular/core'
import { AuthService } from './../../services/auth.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-fast-login',
    templateUrl: './fast-login.component.html',
    styleUrls: ['./fast-login.component.scss']
})
export class FastLoginComponent implements OnInit {

    constructor(private auth: AuthService,private router: Router) { }

    get accountList(): Array<string> {
        return this.auth.getLocalAccounts()
    }
    ngOnInit() {
    }

    switchAccount(username){
        this.auth.switchAccount(username)
        this.router.navigate(['/'])
    }

}
