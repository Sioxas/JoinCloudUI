import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {UserProfile} from './../../interface/user'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    userInfo:UserProfile
    constructor(private user: UserService) { }

    ngOnInit() {
        this.user.getUserProfile().subscribe(data=>{
            this.userInfo = data
        })
    }

    get userInfoString():string{
        return JSON.stringify(this.userInfo)
    }

}
