import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { Base64 } from 'js-base64'
import { Observable } from 'rxjs/Observable'
import { TokenInfo, TokenResponse, Token } from './../interface/auth'
import { types } from './../types'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/throw'

@Injectable()
export class AuthService {
    private get authInfo(): TokenInfo {
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

    private isPending = false

    private pendingToken: Observable<string>

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        // this.getAccessToken()
    }

    login(username: string, password: string) {
        this.http.post<TokenResponse>('/api/auth/login', {
            username, password
        }).subscribe(data => {
            this.resolveToken(data)
        }, error => {
            console.error(error)
        })
    }

    getAccessToken(): Observable<string> {
        if (tokenValid(this.accessToken)) {
            return Observable.of(this.accessToken.token)
        } else {
            return this.updateToken()
        }

    }

    getUserId(): Observable<string> {
        return this.getAccessToken().map(token => {
            return parseToken(token).userId
        })
    }

    private resolveToken(rawToken: TokenResponse) {
        const accessToken = rawToken.token
        const refreshToken = rawToken.refreshToken
        const accessTokenInfo: TokenInfo = parseToken(accessToken)
        const refreshTokenInfo: TokenInfo = parseToken(refreshToken)

        this.accessToken = {
            token: accessToken,
            expiration: accessTokenInfo.exp.toString()
        }

        this.refreshToken = {
            token: refreshToken,
            expiration: refreshTokenInfo.exp.toString()
        }

        this.router.navigate(['/'])
    }


    private updateToken(): Observable<string> {
        if (tokenValid(this.refreshToken)) {
            if (this.isPending)
                return this.pendingToken
            this.isPending = true
            this.pendingToken = this.http.post<TokenResponse>('/api/auth/token', {
                refreshToken: this.refreshToken.token
            }).do(data => {
                this.isPending = false
                this.resolveToken(data)
            }).map(data => {
                return data.token
            }).share()
            return this.pendingToken
        } else {
            this.router.navigate(['/login'])
            return Observable.throw(new Error('登录过期'))
        }
    }

}

function tokenValid(token: Token): boolean {
    return token && token.token && token.expiration
        && parseInt(token.expiration, 10) > Math.round(new Date().getTime() / 1000)
}

function parseToken(tokenStr: string): TokenInfo {
    return JSON.parse(Base64.decode(tokenStr.split('.')[1]))
}
