import { bot } from './config.js'
import { mountPlugin } from '@kokkoro/core'

await mountPlugin('./plugins/roleSetting.js');
await mountPlugin('./plugins/weatherQuery.js');
await mountPlugin('./plugins/muteMember.js')

bot.online()