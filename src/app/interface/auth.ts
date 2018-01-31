export interface TokenResponse {
    refreshToken:string,
    token:string
}

export interface TokenInfo {
    sub: string,
    scopes: string[],
    userId: string,
    tenantId: string,
    customerId: string,
    enabled: boolean,
    isPublic: boolean,
    iss: string,
    iat: number,
    exp: number
}

export interface Token {
    token:string,
    expiration:string
}
