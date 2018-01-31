import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {UserProfile} from './../../interface/user'
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    userInfo = {} as UserProfile
    constructor(private user: UserService,private auth:AuthService) { }

    ngOnInit() {
        this.user.getUserProfile().subscribe(data=>{
            this.userInfo = data
        })
    }

    get userInfoString():string{
        return JSON.stringify(this.userInfo)
    }

}
