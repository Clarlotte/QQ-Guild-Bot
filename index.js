import { Bot, mountPlugin } from '@kokkoro/core'
/**
 * @type {import('@kokkoro/core').BotConfig}
 */
const config = {
    appid: '102057740',
    token: 'kO32sbWGyrCEmL93cjOtioQ1Q7Y4X6Ms',
    secret: 'kOp21tY1FE7mCNJD',
    events: ['PUBLIC_GUILD_MESSAGES'],
    log_level: 'INFO' && 'DEBUG'
}
export const bot = new Bot(config)