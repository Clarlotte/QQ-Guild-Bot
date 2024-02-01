// plugins/demo/index.js
import { useCommand, useEvent, } from '@kokkoro/core';
import { weather_key, geo_key, bot } from '../config.js'
import common from './common/common.js';
import axios from 'axios'
/**
 * @type {import('@kokkoro/core').Metadata}
 */
export const metadata = {
    name: '天气查询',
    description: '用于查询天气',
};

let pathAddr = process.cwd().replace(/\\/g, '/')
let YamlReader = await import('./config/config.js')
YamlReader = YamlReader.default
let weather_config = new YamlReader(pathAddr + '/plugins/config/weather_skycon.yaml', true)

export default function weatherQuery() {
    useCommand('/天气查询 <cityName>', async function (event) {
        //获取需要查询的城市名
        let cityName = event.query.cityName
        let gaode_url = `https://restapi.amap.com/v3/geocode/geo?address=${cityName}&output=JSON&key=${geo_key}`
        const gaode_response = await axios.get(gaode_url)
        //检查是否存在 cityName
        let status = gaode_response.data.status
        if (status == '1') {//存在 cityName
            //获取城市 cityName 格式化地址
            let formatted_address = gaode_response.data.geocodes[0].formatted_address
            //获取城市 cityName 经纬度坐标
            let location = gaode_response.data.geocodes[0].location
            const weather_url = `https://api.caiyunapp.com/v2.6/${weather_key}/${location}/weather?alert=true`
            const weather_response = await axios.get(weather_url)
            //获取城市 cityName 当前实况天气
            const weather_data = weather_response.data.result.realtime
            //获取城市 cityName 预警信息
            const weather_alert = weather_response.data.result.alert
            //获取城市 cityName 风速
            const wind_speed = weather_data.wind.speed
            //获取城市 cityName 风向角度
            const wind_direction = weather_data.wind.direction
            //将获取到的风速风向角度转化为风力等级
            const wind_level = common.get_wind_level(wind_speed, wind_direction)
            //获取城市 cityName 天气情况
            const weather_condition = weather_config.get(weather_data.skycon)
            if (weather_alert.content.length) {//城市 cityName 存在预警信息
                bot.api.sendChannelMessage(event.channel_id, {
                    'markdown': {
                        'custom_template_id': 'xxx',
                        'params': [
                            {
                                'key': 'title',
                                'values': [`${formatted_address}当前天气如下：`],
                            },
                            {
                                'key': 'text1',
                                'values': [`当前天气：${weather_condition}`],
                            },
                            {
                                'key': 'text2',
                                'values': [`温度：${weather_data.temperature}℃`],
                            },
                            {
                                'key': 'text3',
                                'values': [`体感温度：${weather_data.apparent_temperature}℃`],
                            },
                            {
                                'key': 'text4',
                                'values': [`相对湿度：${Math.round(weather_data.humidity * 100)}%`],
                            },
                            {
                                'key': 'text5',
                                'values': [`风力：${wind_level}`],
                            },
                            {
                                'key': 'text6',
                                'values': [`空气质量：${weather_data.air_quality.description.chn}  ${weather_data.air_quality.aqi.chn}`],
                            },
                            {
                                'key': 'text7',
                                'values': [`本地降水强度：${weather_data.precipitation.local.intensity}mm/hr`],
                            },
                            {
                                'key': 'tips',
                                'values': [`预警信息：${weather_alert.content[0].description}`],
                            },
                        ]
                    },
                    "keyboard": {
                        "id": "xxx",
                    }
                })
            } else {//城市 cityName 不存在预警信息
                bot.api.sendChannelMessage(event.channel_id, {
                    'markdown': {
                        'custom_template_id': 'xxx',
                        'params': [
                            {
                                'key': 'title',
                                'values': [`${formatted_address}当前天气如下：`],
                            },
                            {
                                'key': 'text1',
                                'values': [`当前天气：${weather_condition}`],
                            },
                            {
                                'key': 'text2',
                                'values': [`温度：${weather_data.temperature}`],
                            },
                            {
                                'key': 'text3',
                                'values': [`体感温度：${weather_data.apparent_temperature}`],
                            },
                            {
                                'key': 'text4',
                                'values': [`相对湿度：${Math.round(weather_data.humidity * 100)}`],
                            },
                            {
                                'key': 'text5',
                                'values': [`风力：${wind_level}`],
                            },
                            {
                                'key': 'text6',
                                'values': [`空气质量：${weather_data.air_quality.description.chn}  ${weather_data.air_quality.aqi.chn}`],
                            },
                            {
                                'key': 'text7',
                                'values': [`本地降水强度：${weather_data.precipitation.local.intensity}mm/hr`],
                            },
                            {
                                'key': 'tips',
                                'values': [`当前城市无任何预警信息`],
                            },
                        ]
                    },
                    "keyboard": {
                        "id": "102057740_1706503262",
                    }
                })
            }
        } else {//不存在 cityName
            event.reply({
                'content': `无法查询到城市${cityName}的实况天气，请检查是否拼写正确`
            })
        }
    })
    useCommand('/明日天气 <cityName>', async function (event) {
        //获取需要查询的城市名
        let cityName = event.query.cityName
        let gaode_url = `https://restapi.amap.com/v3/geocode/geo?address=${cityName}&output=JSON&key=${geo_key}`
        const gaode_response = await axios.get(gaode_url)
        //检查是否存在 cityName
        let status = gaode_response.data.status
        if (status == '1') {//存在 cityName
            //获取城市 cityName 格式化地址
            let formatted_address = gaode_response.data.geocodes[0].formatted_address
            //获取城市 cityName 经纬度坐标
            let location = gaode_response.data.geocodes[0].location
            const weather_url = `https://api.caiyunapp.com/v2.6/${weather_key}/${location}/daily?dailysteps=2&unit=metric:v2&alert=true`
            const weather_response = await axios.get(weather_url)
            //获取城市 cityName 最近两天天气
            const weather_data = weather_response.data.result.daily
            //获取城市 cityName 预警信息
            const weather_alert = weather_response.data.result.alert
            //获取城市 cityName 明日平均风速
            const wind_speed_avg = weather_data.wind[1].avg.speed
            //获取城市 cityName 明日风向角度
            const wind_direction_avg = weather_data.wind[1].avg.speed
            //将获取到的风速风向角度转化为风力等级
            const wind_level_avg = common.get_wind_level(wind_speed_avg, wind_direction_avg)
            //获取城市 cityName 天气情况
            const weather_condition = weather_config.get(weather_data.skycon[1].value)
            if (weather_alert.content.length) {//城市 cityName 存在预警信息
                bot.api.sendChannelMessage(event.channel_id, {
                    'markdown': {
                        'custom_template_id': '102057740_1706632651',
                        'params': [
                            {
                                'key': 'title',
                                'values': [`${formatted_address}明日天气状况如下：`],
                            },
                            {
                                'key': 'text1',
                                'values': [`明日天气：${weather_condition}`],
                            },
                            {
                                'key': 'text2',
                                'values': [`日出-日落：${weather_data.astro[1].sunrise.time}-${weather_data.astro[1].sunset.time}`],
                            },
                            {
                                'key': 'text3',
                                'values': [`最低/最高温度：${weather_data.temperature[1].min}℃/${weather_data.temperature[1].max}℃`],
                            },
                            {
                                'key': 'text4',
                                'values': [`平均相对湿度：${Math.round(weather_data.humidity[1].avg * 100)}%`],
                            },
                            {
                                'key': 'text5',
                                'values': [`平均风力等级：${wind_level_avg}`],
                            },
                            {
                                'key': 'text6',
                                'values': [`平均空气质量：${weather_data.air_quality.aqi[1].avg.chn}`],
                            },
                            {
                                'key': 'text7',
                                'values': [`明日平均降水强度：${Math.round(weather_data.precipitation[1].avg)}mm/hr`],
                            },
                            {
                                'key': 'tips',
                                'values': [`当前预警信息：${weather_alert.content[0].description}`],
                            },
                        ]
                    }
                })
            } else {//城市 cityName 不存在预警信息
                bot.api.sendChannelMessage(event.channel_id, {
                    'markdown': {
                        'custom_template_id': '102057740_1706632651',
                        'params': [
                            {
                                'key': 'title',
                                'values': [`${formatted_address}明日天气状况如下：`],
                            },
                            {
                                'key': 'text1',
                                'values': [`明日天气：${weather_condition}`],
                            },
                            {
                                'key': 'text2',
                                'values': [`明日日出-日落：${weather_data.astro[1].sunrise.time}-${weather_data.astro[1].sunset.time}`],
                            },
                            {
                                'key': 'text3',
                                'values': [`最低/最高温度：${weather_data.temperature[1].min}℃/${weather_data.temperature[1].max}℃`],
                            },
                            {
                                'key': 'text4',
                                'values': [`平均相对湿度：${Math.round(weather_data.humidity[1].avg * 100)}%`],
                            },
                            {
                                'key': 'text5',
                                'values': [`平均风力等级：${wind_level_avg}`],
                            },
                            {
                                'key': 'text6',
                                'values': [`平均空气质量：${weather_data.air_quality.aqi[1].avg.chn}`],
                            },
                            {
                                'key': 'text7',
                                'values': [`明日平均降水强度：${Math.round(weather_data.precipitation[1].avg)}mm/hr`],
                            },
                            {
                                'key': 'tips',
                                'values': [`当前城市无任何预警信息`],
                            },
                        ]
                    }
                })
            }
        } else {
            event.reply({
                'content': `无法查询到城市${cityName}的实况天气，请检查是否拼写正确`
            })
        }
    })
}