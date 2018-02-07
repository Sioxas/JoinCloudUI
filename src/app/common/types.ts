export const types = {
    localStorageKey:{
        ACCESS_TOKEN:'access_token',
        ACCESS_TOKEN_EXPIRATION:'access_token_expiration',
        REFRESH_TOKEN:'refresh_token',
        REFRESH_TOKEN_EXPIRATION:'refresh_token_expiration'
    },
    token:{
        HEADER_PREFIX:'Bearer ',
        JWT_TOKEN_HEADER_PARAM:'X-Authorization'
    },
    websocketState:{
        CONNECTING:0,
        OPEN:1,
        CLOSING:2,
        CLOSED:3
    }
}
