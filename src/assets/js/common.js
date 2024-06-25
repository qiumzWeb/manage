/**
 * @desc 公共方法
 * @Time 2021-04-28
 */

/**
 * @desc 节流
 * @param {Function} fn 回调函数
 * @param {Number} delay 延时时间
 * @param {Object} options 参数
 */
export const throttle = (
  fn,
  delay = 300,
  options = {
    ctx: null
  }
) => {
  let lastTime = 0;
  return function (...args) {
    const nowTime = new Date().getTime();
    if (nowTime - lastTime > delay) {
      fn.call(options.ctx, ...args);
      lastTime = nowTime;
    }
  };
};

/**
 * @desc 防抖
 * @param {Function} fn 回调函数
 * @param {Number} delay 延时时间
 * @param {Object} options 参数
 */
export const debounce = (
  fn,
  delay = 300,
  options = {
    ctx: null
  }
) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(options.ctx, ...args);
    }, delay);
  };
};

/**
 * @desc 异步防抖
 * @param {*} val 
 * @returns 
 */
export function AsyncDebounce(fn, delay = 300) {
  let timer = null;
  return async function(...args) {
    clearTimeout(timer)
    const res = await new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        fn(...args).then(resolve).catch(reject).finally(() => clearTimeout(timer))
      }, delay)
    })
    return res
  }
}
/**
 * @desc 判断是不是null
 * @param {Any} val
 */
export const isNUll = val => typeof val === 'object' && !val;

/**
 * @desc 判断是不是JSON数据
 * @param {Any} val
 */
export const isJSON = str => {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};


/**
 * @desc 合并对象
 */
export function mergeObj(a, b) {
  isObj(a) &&
    isObj(b) &&
    Object.keys(b).forEach(k => {
      if (isObj(a[k]) && isObj(b[k])) {
        mergeObj(a[k], b[k]);
      } else {
        a[k] = b[k];
      }
    });
  return a;
}

/**
 * @desc 深度合并，多个对象
 * @param {*} args
 */
export function deepAssign(...args) {
  if (args.some(a => !isObj(a) && isTrue(a))) {
    throw new Error('all args must be a Object');
  }
  if (!args[0]) {
    throw new Error('target args[0] must be a Object');
  }
  return args.reduce(mergeObj);
}

/**
 * @desc 深度克隆
 * @param {Any} obj
 * @return {Any}
 */
export const deepClone = obj => {
  if (
    getObjType(obj) === 'Object' ||
    Array.isArray(obj)
  ) {
    return deepAssign(JSON.parse(JSON.stringify(obj, function (key, value) {
      if (getObjType(value) == 'Object') {
        // react 组件 不做克隆处理，直接过虑
        if (value.$$typeof || value.isReactComponent || (value.setState && value.replaceHook)) {
          return {}
        }
      }
      return value
    })), obj);
  }
  return obj;
};

/**
 * @desc 计算dom元素到顶部的距离
 * @param {Element} target
 * @return {Number}
 */
export function getOffsetTop(target, topParent) {
  let top = 0;
  let parent = target;
  if (parent instanceof HTMLElement) {
    while (parent instanceof HTMLElement && parent !== (topParent || document.body)) {
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }
  }
  return top;
}


/**
 * @desc 只调用一次
 * @param {Function} fn
 */
export function onceCall(fn) {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

/**
 * @desc 首字母大写
 * @param {String} str
 * @return {String}
 */
export function firstToUp(str) {
  if (typeof str !== 'string') return str;
  return str[0].toLocaleUpperCase() + str.slice(1);
}

/**
 * @desc 下划线转驼峰
 * @param {String} name
 * @return {String}
 */
export function toUpper(name) {
  if (typeof name !== 'string') return name;
  return name.replace(/(?:\_|\-|\/)(\w+?)/g, function ($1, $2) {
    return $2.toLocaleUpperCase();
  });
}

/**
 * @desc 驼峰转中划线
 * @param {String} name
 * @return {String}
 */
export function upperToLine(name) {
  if (typeof name !== 'string') return name;
  return name
    .replace(/(?:[A-Z])(\w+?)/g, function ($1, $2) {
      return '-' + $1.toLocaleLowerCase();
    })
    .replace(/^\-/, '');
}

/**
 * @desc 是否为空
 * @param {Any} obj
 * @return {Boolean}
 */
export function isEmpty(obj) {
  if (isObj(obj)) {
    if (['Object', 'Array'].includes(getObjType(obj))) return !Object.values(obj).toString();
  }
  return !isTrue(obj);
}

/**
 * @desc 数组扁平化
 * @param {Array} arr
 * @param {Object} options
 * @return {Array}
 */
export function flatMap(arr, options) {
  const flatArr = [];
  const { childrenCode, callBack, clone } = deepAssign(
    {
      childrenCode: 'children',
      clone: true
    },
    options
  );
  const flat = (ar, parent) => {
    if (Array.isArray(ar)) {
      const d = clone && deepClone(ar) || ar;
      d.forEach(a => {
        flatArr.push(a);
        typeof callBack === 'function' && callBack(a, parent);
        isObj(a) && flat(a[childrenCode], a);
      });
    }
  };
  flat(arr);
  return flatArr;
}
/**
 * @desc 多维数组递归处理数据
 * @param {Array}
 */
 export function deepForEach(arr, options) {
  const { childrenCode, callBack, clone } = deepAssign(
    {
      childrenCode: 'children',
      clone: false
    },
    options
  );
  arr = clone ? deepClone(arr) : arr
  const flat = (ar, parent) => {
    if (Array.isArray(ar)) {
      ar.forEach(a => {
        typeof callBack === 'function' && callBack(a, parent);
        isObj(a) && flat(a[childrenCode], a);
      });
    }
  };
  flat(arr);
  return arr;
}


/**
 * @desc 数组去重
 * @param {Array} arr
 * @param {String} code
 * @return {Array}
 */
export function uniqBy(Arr, code) {
  const resultArr = [];
  const valArr = [];
  const codeArr = [];
  Array.isArray(Arr) &&
    Arr.forEach(a => {
      if (isObj(a) && isTrue(code)) {
        !codeArr.includes(a[code]) && resultArr.push(a);
        !codeArr.includes(a[code]) && codeArr.push(a[code]);
      } else {
        !valArr.includes(a) && resultArr.push(a);
        !valArr.includes(a) && valArr.push(a);
      }
    });
  return resultArr;
}

/**
 * @desc 获取数据类型
 * @param {Any} obj
 * @return {Boolean}
 */
export function getObjType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * @desc 清空对象
 * @param {Any} obj
 */
export function setEmpty(obj) {
  try {
    return new window[getObjType(obj)]().valueOf();
  } catch (e) {
    return '';
  }
}

/**
 * @desc 获取结果 支持 方法，对象，promise
 * @param {Any} source
 * @return {Any}
 */
export async function getResult(source, ...args) {
  const type = typeof source;
  let r = source;
  if (type === 'function') {
    r = source(...args);
    if (r && getObjType(r) === 'Promise') {
      r = await r;
    }
  } else if (type === 'object') {
    if (getObjType(source) === 'Promise') {
      r = await source;
    }
  }
  return r;
}

/**
 * @desc 对象检测
 * @param {Any} target
 * @return {Boolean}
 */
export function isObj(target) {
  return target !== null && typeof target === 'object';
}

/**
 * @desc 判断是不是非空值
 * @param {Any} val
 * @return {Boolean}
 */
 export function isTrue(target) {
  const type = [null, undefined, '', 'null', 'undefined']
  return type.every(t => target !== t)
}

/**
 * @desc 随机生成uuid
 * @param {String} val
 * @return {String}
 */
export function getUuid(s = '') {
  return s + _uid() + _uid() + _uid() + Date.now().toString(32)
}

export function _uid() {
  return (Math.random() * 9999).toString(32).split('.')[1].slice(-4)
}

/**
 * @desc 获取地址栏参数
 * @param {String} val
 * @return {String}
 */
 export function getQuery(q) {
  var m = window.location.search.match(new RegExp("(\\?|&)" + q + "=([^&]*)(&|$)"));
  return !m ? "" : decodeURIComponent(m[2]);
}

/**
 * @desc 获取设备
 * @return {Boolean}
 */
export function getDevice() {
  const u  = window.navigator.userAgent
  return {
    isPhone: !!u.match(/AppleWebKit.*Mobile.*/),
    isPad: u.indexOf('iPad') > -1,
    IsAndroid: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    isIPhone: u.indexOf('iPhone') > -1
  }
}
/**
 * @desc 判断http 路径
 * @param {*} url 
 * @returns {Boolean}
 */
export function isHttpUrl(url) {
  return /^(https?:)?\/\//.test(url)
}

/**
 * 保留两位小数千分位
 * @param {*} num 
 * @param {*} precision 
 * @returns 
 */
export const decimal = (num, precision = 2) => {
  if (typeof num !== 'number' && !num) {
    return ''
  }
  if (typeof num === 'string' && (num.includes('**') || num.includes('✽✽'))) {
    return num
  }
  return `${(+num).toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
}
/**
 * 千分位
 * @param {*} num 
 * @returns 
 */
export const thousands = (num) => {
  if (!num) return 0
  if (isNaN(num)) return num
  return (+num).toLocaleString()
}
/**
 * 等待
 */
export async function sleepTime(time = 0, cb) {
  let timer = null
  await new Promise(resolve => {
    function getStatus() {
      timer = setTimeout(() => {
        if (typeof cb === 'function') {
          if (cb()) {
            resolve(true)
          } else {
            getStatus()
          }
        } else {
          resolve(true)
        }
        clearTimeout(timer)
      }, time)
    }
    getStatus()
  })
  return timer
}
/**
 * 通过value 匹配 label 值
 */
export function _getName(options, value, _ = "") {
  return Array.isArray(options) ? (
    (options.find(o => isObj(o) && o.value == value) || {label: _ }).label
  ) : value
}
export function isAllIncludes(options, value) {
  value = Array.isArray(value) ? value : [value]
  return Array.isArray(options) && value.every(v => options.some(s => s.value == v))
}

// 空数据过虑
export function filterNotEmptyData(data) {
  const newData = {}
  Object.entries(data).forEach(([key, val]) => {
    isTrue(val) && (newData[key] = val)
  })
  return newData
}

// 获取可枚举长度空数组
export function getEmptyList(length = 0) {
  return new Array(length).fill()
}

// 下载数据
export function download(res, {fileName, mimeType}) {
  const blob = new Blob(res, {type: mimeType})
  if (window.navigator.msSaveBlob) { // IE
    window.navigator.msSaveBlob(blob, fileName)
  } else { // 其它
    const url = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.download = fileName
    a.href= url
    a.click()
    window.URL.revokeObjectURL(url)
    a = null
  }
}

// 获取TextArea 批量code , 支持 空格 回车 换行 制表符, 自定义符号
export function getStringCodeToArray(strCode, split) {
  if (typeof strCode === 'string') {
    let reg = /\s|\r|\n|\t/;
    if (split) {
      reg = split
    }
    const trimStr = strCode.trim();
    return trimStr.split(reg).filter(s => s);
  } else {
    return []
  }
}
// 判断是否是无效时间
export function isInvalidDate(time) {
  return new Date(time) == 'Invalid Date'
}

// 短字符串（HH:mm:ss）转时间长字符串(YYYY-MM-DD HH:mm:ss)
export function getShortStrToTimeLongStr(str) {
  const format = [
    /^[0-2]?[0-9]\:[0-6]?[0-9]$/,
    /^[0-2]?[0-9]\:[0-6]?[0-9]\:[0-6]?[0-9]$/,
  ]
  if (format.some(reg => reg.test(str))) {
    return new Date().toLocaleDateString() + ` ${str}`
  }
  if (isInvalidDate(str)) {
    return new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
  }
  return str
}

// 时间戳 转换为 HH:mm:ss
export function getToTT(str) {
  if (isNaN(str)) return '00';
  return String(str)[1] ? str : '0' + str;
}
export function getTimeStampToHMS(timeStamp, lang = 'zh') {
  if (isNaN(timeStamp)) return timeStamp;
  const time = timeStamp / 1000;
  const d = parseInt(time / (3600 * 24))
  const ht = time % (3600 * 24)
  const h = parseInt(ht / 3600);
  const mt = ht % 3600
  const m = parseInt(mt / 60);
  const st = mt % 60
  const s = parseInt(st);
  const g = (t, n) => t ? t + n : '';
  const output = {
    en: getToTT(h) + ':' + getToTT(m) + ':' + getToTT(s),
    zh: g(d, '天') + g(h, '小时') + g(m, '分钟') + g(s, '秒')
  }
  return output[lang] || timeStamp
}

// 判断两个符串是否相同，不区分大小写
export function isSameURLStr(str1, str2) {
  if (typeof str1 === 'string' && typeof str2 === 'string') {
    return str1.toLowerCase() === str2.toLowerCase()
  }
  return false
}

// 多选字段转换为字符串提交
export function transMultipleToStr(val, { action }) {
  const result = {
    inset: typeof val === 'string' && val.split(',').filter(f => isTrue(f)) || [],
    output: Array.isArray(val) && val.join() || ''
  }
  return result[action]
}

/**
 * 
 * @param {*} obj 需要取值的 对象
 * @param {*} key 提供取值的key 
 * @returns 
 */
// 获取对象对应 key 的值 ，支持 key.childKey 模式
export function getValueOfObj(obj, key) {
  if (isEmpty(obj) || isEmpty(key)) return null;
  const keys = String(key).split('.').filter(f => f);
  const value = keys.reduce((item, key) => {
    return ['Object', 'Array'].includes(getObjType(item)) ? item[key] : item
  }, obj);
  return value
}

/**
 * 数字转百分比
 */
export function NumToPercentage(num, radix = 100, unit = "%") {
  if (isNaN(num)) return '-' + unit;
  return decimal(+num * radix) + unit;
}