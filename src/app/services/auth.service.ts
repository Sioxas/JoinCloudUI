import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { Base64 } from 'js-base64'
import { Observable } from 'rxjs/Observable'
import { TokenInfo, TokenResponse, Token } from './../interface/auth'
import { types } from './../common/types'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/throw'

@Injectable()
export class AuthService {
    /**
     * Token 中的信息
     * 
     * @readonly
     * @private
     * @type {TokenInfo}
     * @memberof AuthService
     */
    private get authInfo(): TokenInfo {
        return parseToken(this.accessToken.token)
    }

    /**
     * 本地账户
     * 
     * @private
     * @type {Object}
     * @memberof AuthService
     */
    private get localAccounts(): Object {
        const accountsJsonStr = localStorage.getItem(types.localStorageKey.LOCAL_ACCOUNTS)
        return JSON.parse(accountsJsonStr)
    }

    private set localAccounts(accounts: Object) {
        const accountsJsonStr = JSON.stringify(accounts)
        localStorage.setItem(types.localStorageKey.LOCAL_ACCOUNTS, accountsJsonStr)
    }

    /**
     * Access Token
     * 
     * @private
     * @type {Token}
     * @memberof AuthService
     */
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

    /**
     * Refresh Token
     * 
     * @private
     * @type {Token}
     * @memberof AuthService
     */
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

    private currentUser: string

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        // this.getAccessToken()
    }

    /**
     * 切换账号
     * 
     * @param {string} username 用户名
     * @memberof AuthService
     */
    switchAccount(username: string): void {
        this.currentUser = username
        this.resolveToken(this.localAccounts[username])
    }

    /**
     * 用户登录
     * 
     * @param {string} username 用户名
     * @param {string} password 密码
     * @memberof AuthService
     */
    login(username: string, password: string): void {
        this.http.post<TokenResponse>('/api/auth/login', {
            username, password
        }).subscribe(data => {
            this.currentUser = username
            this.saveAccount(username, data)
            this.resolveToken(data)
            this.router.navigate(['/'])
        }, error => {
            console.error(error)
        })
    }

    /**
     * 用户注销
     * 
     * @memberof AuthService
     */
    logout(): void {
        [
            types.localStorageKey.ACCESS_TOKEN,
            types.localStorageKey.ACCESS_TOKEN_EXPIRATION,
            types.localStorageKey.REFRESH_TOKEN,
            types.localStorageKey.REFRESH_TOKEN_EXPIRATION
        ].forEach(item => {
            localStorage.removeItem(item)
        })
        this.router.navigate(['/login'])
    }

    /**
     * 获取 Access Token
     * 如果当前 Access Token 有效直接返回 Access Token，否则更新并返回新的 Access Token
     * 
     * @returns {Observable<string>} Access Token 字符串
     * @memberof AuthService
     */
    getAccessToken(): Observable<string> {
        return tokenValid(this.accessToken)
            ? Observable.of(this.accessToken.token)
            : this.updateToken()
    }

    /**
     * 获取用户 ID
     * 从 Token 中获取用户 ID
     * 
     * @returns {Observable<string>} 
     * @memberof AuthService
     */
    getUserId(): Observable<string> {
        return this.getAccessToken().map(token => {
            return parseToken(token).userId
        })
    }

    /**
     * 获取本地保存的用户名
     * 
     * @returns {Array<string>} 用户名列表
     * @memberof AuthService
     */
    getLocalAccounts(): Array<string> {
        return this.localAccounts ? Object.keys(this.localAccounts) : []
    }

    /**
     * 处理 Token 请求响应
     * 
     * @private
     * @param {TokenResponse} rawToken 通过 Http 请求获取的 Token 对象
     * @memberof AuthService
     */
    private resolveToken(rawToken: TokenResponse): void {
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
    }

    /**
     * 使用 Refresh Token 更新 Access Token，
     * 如果 Refresh Token 过期会重新登录
     * 
     * @private
     * @returns {Observable<string>} Token 字符串的可观察对象
     * @memberof AuthService
     */
    private updateToken(): Observable<string> {
        if (tokenValid(this.refreshToken)) {
            if (this.isPending)
                return this.pendingToken
            this.isPending = true
            
            return this.pendingToken = this.http.post<TokenResponse>('/api/auth/token', {
                refreshToken: this.refreshToken.token
            }).do(data => {
                this.isPending = false
                this.saveAccount(this.currentUser, data)
                this.resolveToken(data)
            }).map(data => data.token).share()
        } else {
            this.router.navigate(['/login'])
            return Observable.throw('登录过期')
        }
    }

    /**
     * 保存登录信息
     * 
     * @private
     * @param {string} username 用户名
     * @param {TokenResponse} token Token
     * @memberof AuthService
     */
    private saveAccount(username: string, token: TokenResponse): void {
        let accounts = this.localAccounts
        this.localAccounts = accounts
            ? username in accounts
                ? Object.keys(accounts)
                    .filter(item => item !== username)
                    .reduce((a, b) => ({ ...a, [b]: accounts[b] }), { [username]: token })
                : { ...accounts, [username]: token }
            : { [username]: token }
    }
}

/**
 * 验证 Token 是否有效
 * 包含 Access Token 和 Refresh Token
 * 
 * @param {Token} token 
 * @returns {boolean} 
 */
function tokenValid(token: Token): boolean {
    return token && token.token && token.expiration
        && parseInt(token.expiration, 10) > Math.round(new Date().getTime() / 1000)
}

/**
 * 解析 Token 
 * 
 * @param {string} tokenStr Token 字符串
 * @returns {TokenInfo} 
 */
function parseToken(tokenStr: string): TokenInfo {
    return JSON.parse(Base64.decode(tokenStr.split('.')[1]))
}
