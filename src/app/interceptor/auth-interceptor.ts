import { Injectable, Injector } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { AuthService } from './../services/auth.service'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private auth:AuthService

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.auth = this.injector.get(AuthService)
        console.log(req.url)
        if (req.url === '/api/auth/login') {
            return next.handle(req)
        } else {
            // Get the auth header from the service.
            const authHeader = 'Bearer ' + this.auth.token
            // Clone the request to add the new header.
            const authReq = req.clone({ headers: req.headers.set('X-Authorization', authHeader) })
            // Pass on the cloned request instead of the original request.
            return next.handle(authReq)
        }

    }
}
