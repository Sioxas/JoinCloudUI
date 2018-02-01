import { Injectable, Injector } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { AuthService } from './../services/auth.service'
import { Observable } from 'rxjs/Observable';
import { types } from './../types'
import 'rxjs/add/operator/switchMap'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private auth: AuthService

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.auth = this.injector.get(AuthService)
        console.log(req.url)
        if (['/api/auth/login', '/api/auth/token'].includes(req.url)) {
            return next.handle(req)
        } else {
            return this.auth.getAccessToken().switchMap(token => {
                // Get the auth header from the service.
                const authHeader = types.token.HEADER_PREFIX + token
                // Clone the request to add the new header.
                const authReq = req.clone({ headers: req.headers.set(types.token.JWT_TOKEN_HEADER_PARAM, authHeader) })
                // Pass on the cloned request instead of the original request.
                return next.handle(authReq)
            })

        }

    }
}
