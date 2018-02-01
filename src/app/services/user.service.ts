import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {UserProfile} from './../interface/user'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap'

@Injectable()
export class UserService {
    constructor(private auth:AuthService,private http:HttpClient) { }
    getUserProfile():Observable<UserProfile>{
        return this.auth.getUserId().switchMap(id=>{
            return this.http.get<UserProfile>('/api/user/'+id)
        }).catch(e=>{
            return Observable.throw(e)
        })
    }
}

let tenantUser: any = {
    'id': {
        'entityType': 'USER',
        'id': 'f1771d31-d017-11e7-b3b5-d1a5a47deb72'
    },
    'createdTime': 1511418691203,
    'tenantId': {
        'entityType': 'TENANT',
        'id': 'f1771d30-d017-11e7-b3b5-d1a5a47deb72'
    },
    'customerId': {
        'entityType': 'CUSTOMER',
        'id': '13814000-1dd2-11b2-8080-808080808080'
    },
    'email': 'tenant@thingsboard.org',
    'authority': 'TENANT_ADMIN',
    'firstName': null,
    'lastName': null,
    'additionalInfo': {
        'lang': 'zh_CN',
        'theme': 'purple'
    },
    'name': 'tenant@thingsboard.org'
}





