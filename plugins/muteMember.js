import { useCommand, useEvent, } from '@kokkoro/core';
import { bot } from '../config.js'
import common from './common/common.js';

/**
 * @type {import('@kokkoro/core').Metadata}
 */
export const metadata = {
  name: '禁言',
  description: '禁言或解禁某人',
};

const Numreg = '[零一壹二两三四五六七八九十百千万亿\\d]+'

export default function muteMember() {
  useCommand('/禁言 <at_user> <time>', async function (event) {
    const guild_id = event.guild_id, at_user = event.mentions[1].id, time = event.query.time
    let reg = new RegExp(`(${Numreg})?(分|分钟|时|小时|天)?$`)
    //获取禁言时长
    let tTime = common.translateChinaNum(time.match(reg)[1])
    //获取禁言时长单位
    let option = time.match(reg)[2]
    if (option == '分' || option == '分钟') {
      let banTime = (tTime * 60).toString()
      bot.api.guildMemberMute(guild_id, at_user, { 'mute_seconds': banTime })
    } else if (option == '时' || option == '小时') {
      let banTime = (tTime * 60 * 60).toString()
      bot.api.guildMemberMute(guild_id, at_user, { 'mute_seconds': banTime })
    }
    else if (option == '天') {
      let banTime = (tTime * 60 * 60 * 24).toString()
      bot.api.guildMemberMute(guild_id, at_user, { 'mute_seconds': banTime })
    }
  })
  useCommand('/解除禁言 <at_user>', async function (event) {
    const guild_id = event.guild_id, at_user = event.mentions[1].id
    bot.api.guildMemberMute(guild_id, at_user, { 'mute_seconds': '0' })
  })
}