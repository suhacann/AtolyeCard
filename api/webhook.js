// Vercel sunucu fonksiyonu: POST /api/webhook (bkz. server/handlers.js)
import { handleWebhook } from '../server/handlers.js'
import { toVercelHandler } from '../server/vercelHandler.js'

export default toVercelHandler(handleWebhook)
