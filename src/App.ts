import Koa from "koa"
import logger from "koa-logger"
import bodyParser from "koa-bodyparser"
import cors from "@koa/cors"
import Router from "koa-router"

class App extends Koa {
    private router = new Router()
    private PORT = 4000

    public async start(): Promise<void> {
        this.use(logger())
        this.use(bodyParser())
        this.use(cors())
        
        //this.router.use()
        this.use(this.router.routes())
        this.use(this.router.allowedMethods())

        this.listen(this.PORT, () => {
            console.log(`This app is now listening to port ${this.PORT}`)
        })
    }
}