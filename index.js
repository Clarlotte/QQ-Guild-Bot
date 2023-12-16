import { Bot, mountPlugin } from '@kokkoro/core'
/**
 * @type {import('@kokkoro/core').BotConfig}
 */
const config = {
    appid: '##',
    token: '##',
    secret: '##',
    events: ['PUBLIC_GUILD_MESSAGES'],
    log_level: 'INFO' && 'DEBUG'
    /** 日志等级，具体使用可查阅 log4js 文档 */
    /**type LogLevel = 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';*/
}
export const bot = new Bot(config)
