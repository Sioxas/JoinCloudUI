import { uuid } from '../common/utils'

export class MySubject{
    private subscriptionList:Array<MySubscription> = []
    constructor(){}
    next(data:any){
        for(const sub of this.subscriptionList)
            sub.next(data)
    }
    error(data:any){
        for(const sub of this.subscriptionList)
            sub.error(data)
    }
    subscribe(next:Function,error?:Function,complete?:Function){
        const _error = error || (()=>{})
        const _complete = complete || (()=>{})
        const sub = new MySubscription(next,_error,_complete,this)
        this.subscriptionList.push(sub)
        return sub
    }
    unregister(sub:MySubscription){
        this.subscriptionList = this.subscriptionList.filter(f=>f!==sub)
    }
}

export class MySubscription{
    private subscribeId:string 

    constructor(private _next:Function,private _error:Function,private _complete:Function,private mySubect:MySubject){
        this.subscribeId = uuid()
    }

    unsubscribe(){
        this._complete()
        this.mySubect.unregister(this)
    }

    error(data){
        this._error()
    }

    next(data:any){
        this._next(data)
    }
}
