import {bot} from './index.js'
import { mountPlugin } from '@kokkoro/core'

await mountPlugin('./plugins/index.js');

bot.online()