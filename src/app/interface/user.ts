export interface ID {
    entityType: string,
    id: string
}
export interface UserProfile {
    id: ID,
    createdTime: number,
    tenantId: ID,
    customerId: ID,
    email: string,
    authority: string,
    firstName?: string,
    lastName?: string,
    additionalInfo?: {
        lang?: string,
        theme?: string
    },
    name: string,
    phone:string
}
