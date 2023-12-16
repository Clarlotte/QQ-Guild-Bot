// plugins/demo/index.js
import { Bot, useCommand, useEvent, } from '@kokkoro/core';
import { Client } from 'amesu';
import { bot } from '../index.js'

/**
 * @type {import('@kokkoro/core').Metadata}
 */
export const metadata = {
  name: '身份认领',
  description: '插件示例',
};

export default function Demo() {
  useEvent(() => console.log('Bot online.'), ['session.ready']);
  useCommand('/身份认证 <message>', async function (event) {
    //获取聊天数据
    const channel_id = event.channel_id, user_id = event.author.id,
      guild_id = event.guild_id, message = event.query.message,
      member = event.member
    //获取频道 guild_id 中的身份组 
    const guildRoles = await (await bot.api.getGuildRoles(guild_id)).data.roles
    console.log(event)
    //判断频道 guild_id 中是否存在身份组 message
    const roleExists = guildRoles.some(role => role.name === message)
    if (roleExists) {//频道 guild_id 中存在身份组 message
      //获取身份组 message 的 role_id
      const role_id = guildRoles.find(item => item.name === message).id
      //判断用户 user_id 是否存在于身份组 message
      const isRolePresent = member.roles.includes(role_id)
      if (isRolePresent) { //用户 user_id 存在于身份组 message
        event.reply({ 'content': `【操作失败】\n<@!${user_id}>你已经在对应的身份组中了，无需重复加入。` })
      } else { //用户 user_id 不存在于身份组 message
        //统计用户 user_id 在频道 guild_id 中部分身份组的数量
        const role_num = member.roles.filter(item => parseInt(item, 10) > 16400000)
        //判断用户 user_id 在频道 guild_id 中在多个部分身份组中
        if (role_num.length >= 1) {
          event.reply({ 'content': `【操作失败】\n<@!${user_id}>加入失败，没人最多只能加入1个身份组。` })
        } else {
          //将用户 user_id 添加到身份组 message 中
          bot.api.addGuildMemberRole(guild_id, user_id, role_id)
          event.reply({
            'content': `【操作成功】\n<@!${user_id}>恭喜你成为【${message}】的一份子。` 
              // `①现在你可以前往<#634327094>和大家一起交流！` +
              // `②每天在<#634327429>签到打卡获得悟境点，另外达到指定天数，可获得额外悟境点，悟境点后续可在<#634327359>中兑换礼品` +
              // `③对频道有任何建议，可在<#634336088>中提出，若采纳，发帖者将获得额外的悟境点奖励`
          })
        }
      }
    } else {//频道 guild_id 中不存在身份组 message
      event.reply({ 'content': `【操作失败】\n<@!${user_id}>找不到对应的身份组` })
    }
  })

  useCommand('/取消身份组 <at_user> <role_name>', async function (event) {
    const role_name = event.query.role_name, guild_id = event.guild_id,
      mentions = event.mentions, user_id = event.author.id
    //判断用户 user_id 是否为频道主
    if (event.member.roles.includes('4')) {//用户 user_id 是频道主
      //获取频道 guild_id 中的身份组 
      const guildRoles = await (await bot.api.getGuildRoles(guild_id)).data.roles
      //判断频道 guild_id 中是否存在身份组 role_name
      const roleExists = guildRoles.some(role => role.name === role_name)
      if (roleExists) {//频道 guild_id 中存在身份组 role_name
        for (let i = 1; i < mentions.length; i++) {
          const at_user_id = mentions[i].id
          // 获取频道 guild_id 下 at_user_id 的信息
          const user_info = await (await bot.api.getGuildUserMember(guild_id, at_user_id)).data
          //获取身份组 role_name 的 role_id
          const role_id = guildRoles.find(item => item.name === role_name).id
          //判断用户 user_id 是否存在于身份组 role_name
          const isRolePresent = user_info.roles.includes(role_id)
          if (isRolePresent) {//用户 user_id 在身份组 role_name 中
            //将用户 user_id 在身份组 role_name 中移除
            bot.api.deleteGuildMemberRole(guild_id, at_user_id, role_id)
            event.reply({ 'content': `【操作成功】\n<@!${user_id}>以成功为<@!${at_user_id}>取消【${role_name}】身份组。` })
          } else {//用户 user_id 不在身份组 role_name 中
            event.reply({ 'content': `【操作失败】\n<@!${at_user_id}>不在【${role_name}】身份组中。` })
          }
        }
      } else {//频道 guild_id 中不存在身份组 role_name
        event.reply({ 'content': `【操作失败】\n<@!${user_id}>找不到对应的身份组` })
      }
    } else {//用户 user_id 不是频道主
      event.reply({ 'content': `【操作失败】\n<@!${user_id}>当前指令只开放给频道主使用。` })
    }
  })

  useCommand('/测试', () => 'hello world')
  useCommand('/复读 <message>', event => event.query.message)
}