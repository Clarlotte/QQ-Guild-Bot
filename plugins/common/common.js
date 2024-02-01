import cheerio from 'cheerio'
import axios from 'axios'

async function get_fish_info(fish_name) {
  const url = `https://wiki.biligame.com/russianfishing4/${fish_name}`
  const response = await axios.get(url)
  const $ = cheerio.load(response.data)
  const adult_weight = $('td:contains("达标体重")').next().text().trim();
  const tv_weight = $('td:contains("电视体重")').next().text().trim();
  const star_weight = $('td:contains("上星重量")').next().text().trim();
  const blue_weight = $('td:contains("上蓝重量")').next().text().trim();
  const fish_info = [adult_weight, tv_weight, star_weight, blue_weight]
  return fish_info
}

function translateChinaNum(s_123) {
  if (!s_123 && s_123 != 0) return s_123
  // 如果是纯数字直接返回
  if (/^\d+$/.test(s_123)) return Number(s_123)
  // 字典
  let map = new Map()
  map.set('一', 1)
  map.set('壹', 1) // 特殊
  map.set('二', 2)
  map.set('两', 2) // 特殊
  map.set('三', 3)
  map.set('四', 4)
  map.set('五', 5)
  map.set('六', 6)
  map.set('七', 7)
  map.set('八', 8)
  map.set('九', 9)
  // 按照亿、万为分割将字符串划分为三部分
  let split = ''
  split = s_123.split('亿')
  let s_1_23 = split.length > 1 ? split : ['', s_123]
  let s_23 = s_1_23[1]
  let s_1 = s_1_23[0]
  split = s_23.split('万')
  let s_2_3 = split.length > 1 ? split : ['', s_23]
  let s_2 = s_2_3[0]
  let s_3 = s_2_3[1]
  let arr = [s_1, s_2, s_3]

  // -------------------------------------------------- 对各个部分处理 --------------------------------------------------
  arr = arr.map(item => {
    let result = ''
    result = item.replace('零', '')
    // [ '一百三十二', '四千五百', '三千二百一十三' ] ==>
    let reg = new RegExp(`[${Array.from(map.keys()).join('')}]`, 'g')
    result = result.replace(reg, substring => {
      return map.get(substring)
    })
    // [ '1百3十2', '4千5百', '3千2百1十3' ] ==> ['0132', '4500', '3213']
    let temp
    temp = /\d(?=千)/.exec(result)
    let num1 = temp ? temp[0] : '0'
    temp = /\d(?=百)/.exec(result)
    let num2 = temp ? temp[0] : '0'
    temp = /\d?(?=十)/.exec(result)
    let num3
    if (temp === null) { // 说明没十：一百零二
      num3 = '0'
    } else if (temp[0] === '') { // 说明十被简写了：十一
      num3 = '1'
    } else { // 正常情况：一百一十一
      num3 = temp[0]
    }
    temp = /\d$/.exec(result)
    let num4 = temp ? temp[0] : '0'
    return num1 + num2 + num3 + num4
  })
  // 借助parseInt自动去零
  return parseInt(arr.join(''))
}

const wind_level = [
  { range: [1, 6], level: '1级' },
  { range: [6, 12], level: '2级' },
  { range: [12, 20], level: '3级' },
  { range: [20, 29], level: '4级' },
  { range: [29, 39], level: '5级' },
  { range: [39, 50], level: '6级' },
  { range: [50, 62], level: '7级' },
  { range: [62, 75], level: '8级' },
  { range: [75, 89], level: '9级' },
  { range: [89, 103], level: '10级' },
  { range: [103, 118], level: '11级' },
  { range: [118, 134], level: '12级' },
  { range: [134, 150], level: '13级' },
  { range: [150, 167], level: '14级' },
  { range: [167, 184], level: '15级' },
  { range: [184, 202], level: '16级' },
  { range: [202, 220], level: '17级' },
];

const wind_direction = [
  { range: [0, 11.26], direction: '北' },
  { range: [11.26, 33.76], direction: '北东北' },
  { range: [33.76, 56.26], direction: '东北' },
  { range: [56.26, 78.76], direction: '东东北' },
  { range: [78.76, 101.26], direction: '东' },
  { range: [101.26, 123.76], direction: '东东南' },
  { range: [123.76, 146.26], direction: '东南' },
  { range: [146.26, 168.76], direction: '南东南' },
  { range: [168.76, 191.26], direction: '南' },
  { range: [191.26, 213.76], direction: '南西南' },
  { range: [213.76, 236.26], direction: '西南' },
  { range: [236.26, 258.76], direction: '西西南' },
  { range: [258.76, 281.26], direction: '西' },
  { range: [281.26, 303.76], direction: '西西北' },
  { range: [303.76, 326.26], direction: '西北' },
  { range: [326.26, 348.76], direction: '北西北' },
  { range: [248.76, 360], direction: '北' },
]

function get_wind_level(speed, dire) {
  let level = null, directions = null
  for (const item of wind_level) {
    const range = item.range
    if (speed >= range[0] && speed < range[1]) {
      level = item.level
      break
    }
  }
  
  for (const item of wind_direction) {
    const range = item.range
    if (dire >= range[0] && dire < range[1]) {
      directions = item.direction
      break
    }
  }
  console.log('======================', directions)
  return directions + '风' + level
}
export default { translateChinaNum, get_fish_info, get_wind_level }