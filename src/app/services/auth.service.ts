import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { Base64 } from 'js-base64'
import { AuthInfo, LoginResponse ,Token} from './../interface/auth'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private get _token(): string{
        return localStorage.getItem('token')
    }
    private set _token(newToken:string){
        localStorage.setItem('token',newToken)
    }
    private get _refreshToken(): string{
        return localStorage.getItem('refreshToken')
    }
    private set _refreshToken(newRefreshToken:string){
        localStorage.setItem('refreshToken',newRefreshToken)
    }
    private authInfo: AuthInfo

    get token(): string {
        return this.isValid ? this._token : ''
    }

    get refreshToken(): string {
        return this.isValid ? this._refreshToken : ''
    }

    get userId(): string {
        return this.isValid ? this.authInfo.userId : ''
    }

    private isValid(token:Token): boolean {
        if (token.exp>Math.round(new Date().getTime()/1000)) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }
    }

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {

    }

    login(username: string, password: string) {
        this.http.post<LoginResponse>('/api/auth/login', {
            username, password
        }).subscribe(data => {
            console.log(data)
            this.resolveToken(data)
        }, error => {
            console.error(error)
        })
    }

    getToken():Observable<string>{
        
        return Observable.of('')
    }

    private resolveToken(rawToken: LoginResponse) {
        let token = this._token = rawToken.token
        let refreshToken = this._refreshToken = rawToken.refreshToken
        let refreshTokenInfo = JSON.parse(Base64.decode(refreshToken.split('.')[1]))
        this.authInfo = JSON.parse(Base64.decode(token.split('.')[1]))
        console.log(this.authInfo)
        console.log(this.authInfo.exp)
        console.log(refreshTokenInfo)
        this.router.navigate(['/'])
    }

}


function tokenValid(token:Token):boolean{
    return token&&token.token&&token.exp&&token.exp>Math.round(new Date().getTime()/1000)
}


let authInfo = {
    'sub': 'sysadmin@thingsboard.org',  // 用户
    'scopes': ['SYS_ADMIN'],
    'userId': 'f92d1cd0-0561-11e8-882b-99de6e796ca4',
    'enabled': true,
    'isPublic': false,
    'tenantId': '13814000-1dd2-11b2-8080-808080808080',
    'customerId': '13814000-1dd2-11b2-8080-808080808080',
    'iss': 'thingsboard.io', // 签发者
    'iat': 1517279125,  // 签发时间
    'exp': 1517280025  // 过期时间
}
