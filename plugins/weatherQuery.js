// plugins/demo/index.js
import { useCommand, useEvent, } from '@kokkoro/core';
import { bot } from '../config.js'
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
let config = new YamlReader(pathAddr + '/plugins/config/weather_icon.yaml', true)

export default function Weather() {
    useCommand('/天气查询 <cityName>', async function (event) {
        let cityName = event.query.cityName
        let url = `https://api.oioweb.cn/api/weather/weather?city_name=${cityName}`
        const response = await axios.get(url)
        let weather_data = response.data.result
        console.log(response.data)
        if (response.data.code == 200) {
            const weather_url = config.get(weather_data.current_condition)
            event.reply({
                'embed': {
                    'title': `${cityName}当前天气如下：`,
                    "prompt": `${cityName}今日天气为${weather_data.dat_condition}`,
                    "thumbnail": {
                        "url": weather_url
                    },
                    "fields": [
                        {
                            'name': `当前天气：${weather_data.current_condition}`
                        },
                        {
                            'name': `当前温度：${weather_data.current_temperature}℃`
                        },
                        {
                            'name': `今日最低/最高温：${weather_data.dat_low_temperature}℃/${weather_data.dat_high_temperature}℃`
                        },
                        {
                            'name': `空气质量：${weather_data.quality_level}  ${weather_data.aqi}`
                        },
                        {
                            'name': `风力：${weather_data.wind_direction}${weather_data.wind_level}级`
                        },
                        {
                            'name': `温馨提示：${weather_data.tips}`
                        },
                        {
                            'name': `数据更新时间：${weather_data.update_time}`
                        },
                    ],
                }
            })
        } else {
            event.reply({
                'embed': {
                    'title': `查询失败`,
                    "prompt": `查询天气失败`,
                    "fields": [
                        {
                            'name': `错误码：${response.data.code}`,
                            'name': `温馨提示：目前天气查询仅支持地级市`
                        },
                    ]
                }
            })
        }
    })
}