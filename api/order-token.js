// Vercel sunucu fonksiyonu: GET /api/order-token (bkz. server/handlers.js)
import { handleOrderToken } from '../server/handlers.js'
import { toVercelHandler } from '../server/vercelHandler.js'

export default toVercelHandler(handleOrderToken)
