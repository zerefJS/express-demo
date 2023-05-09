import "dotenv/config"
import express from "express"
import cors from "cors"
import { videoRouter } from "./routers/index.js"

const port = Number(process.env.PORT) || 3000
const app = express()


app.use(cors())
app.use(express.json())

app.use('/video', videoRouter)



app.listen(port, () => {
    console.log(`Server is ready at: http://localhost:${port}`)
})
