import { Bot } from '@kokkoro/core'
/**
 * @type {import('@kokkoro/core').BotConfig}
 */
const config = {
    appid: 'xxx',
    token: 'xxxx',
    secret: 'xxx',
    events: ['PUBLIC_GUILD_MESSAGES'],
    log_level: 'INFO' && 'DEBUG'
}
const geo_key = 'xxx'
const weather_key = 'xxx'

export { geo_key, weather_key }
export const bot = new Bot(config)