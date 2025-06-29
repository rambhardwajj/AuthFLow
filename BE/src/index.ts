
import app from "./app"
import { env } from "./configs/env"
import { logger } from "./configs/logger"


const PORT =  env.PORT || 8008;


app.listen(PORT, () => {
    logger.info("app listening on port , " + PORT)
})