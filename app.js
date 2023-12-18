import {bot} from './index.js'
import { mountPlugin } from '@kokkoro/core'

await mountPlugin('./plugins/roleSetting.js');
await mountPlugin('./plugins/weatherQuery.js');

bot.online()