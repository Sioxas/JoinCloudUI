import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { Base64 } from 'js-base64'
import { Observable } from 'rxjs/Observable'
import { TokenInfo, TokenResponse, Token } from './../interface/auth'
import { types } from './../types'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/switchMap'

@Injectable()
export class AuthService {
    private get authInfo(): TokenInfo{
        return parseToken(this.accessToken.token)
    }

    private get accessToken(): Token {
        return {
            token: localStorage.getItem(types.localStorageKey.ACCESS_TOKEN),
            expiration: localStorage.getItem(types.localStorageKey.ACCESS_TOKEN_EXPIRATION)
        }
    }

    private set accessToken(token: Token) {
        localStorage.setItem(types.localStorageKey.ACCESS_TOKEN, token.token)
        localStorage.setItem(types.localStorageKey.ACCESS_TOKEN_EXPIRATION, token.expiration)
    }

    private get refreshToken(): Token {
        return {
            token: localStorage.getItem(types.localStorageKey.REFRESH_TOKEN),
            expiration: localStorage.getItem(types.localStorageKey.REFRESH_TOKEN_EXPIRATION)
        }
    }

    private set refreshToken(token: Token) {
        localStorage.setItem(types.localStorageKey.REFRESH_TOKEN, token.token)
        localStorage.setItem(types.localStorageKey.REFRESH_TOKEN_EXPIRATION, token.expiration)
    }

    get userId(): string {
        if(tokenValid(this.accessToken)){
            return this.authInfo.userId
        }
    }

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        
    }

    login(username: string, password: string) {
        this.http.post<TokenResponse>('/api/auth/login', {
            username, password
        }).subscribe(data => {
            console.log(data)
            this.resolveToken(data)
        }, error => {
            console.error(error)
        })
    }

    getAccessToken(): Observable<string> {
        if(tokenValid(this.accessToken)){
            return Observable.of(this.accessToken.token)
        }else{
            return this.updateToken()
        }
    }

    private resolveToken(rawToken: TokenResponse) {
        const accessToken = rawToken.token
        const refreshToken = rawToken.refreshToken
        const accessTokenInfo:TokenInfo = parseToken(accessToken)
        const refreshTokenInfo:TokenInfo = parseToken(refreshToken)

        this.accessToken = {
            token:accessToken,
            expiration:accessTokenInfo.exp.toString()
        }

        this.refreshToken = {
            token:refreshToken,
            expiration:refreshTokenInfo.exp.toString()
        }

        this.router.navigate(['/'])
    }

    private updateToken():Observable<string> {
        if(tokenValid(this.refreshToken))
            return this.http.post<TokenResponse>('/api/auth/token',{
                refreshToken:this.refreshToken.token
            }).do(data=>{
                this.resolveToken(data)
            }).switchMap(data=>{
                return data.token
            })
        else {
            this.router.navigate(['/login'])
            throw Observable.of('登录过期')
        }
    }

}


function tokenValid(token: Token): boolean {
    return token && token.token && token.expiration
        && parseInt(token.expiration, 10) > Math.round(new Date().getTime() / 1000)
}

function parseToken(tokenStr:string):TokenInfo{
    return JSON.parse(Base64.decode(tokenStr.split('.')[1]))
}

// let authInfo = {
//     'sub': 'sysadmin@thingsboard.org',  // 用户
//     'scopes': ['SYS_ADMIN'],
//     'userId': 'f92d1cd0-0561-11e8-882b-99de6e796ca4',
//     'enabled': true,
//     'isPublic': false,
//     'tenantId': '13814000-1dd2-11b2-8080-808080808080',
//     'customerId': '13814000-1dd2-11b2-8080-808080808080',
//     'iss': 'thingsboard.io', // 签发者
//     'iat': 1517279125,  // 签发时间
//     'exp': 1517280025  // 过期时间
// }
