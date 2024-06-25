
// 老地址 正则
export const pathReg = /(https?\:\/\/(pre-)?pcs-manage(\.wt)?\.cainiao\.com)/
// 获取菜单url
export const getUrl = m => m.href || m.menuUrl
// 设置 菜单url
export const setUrl = (m, url) => {
  const urlName = ['menuUrl', 'href']
  urlName.forEach(key => {
    if (m.hasOwnProperty(key)) {
      m[key] = url
    }
  })
}
export const setTitle = (m, title) => {
  const titleName = ['menuTitle', 'text']
  titleName.forEach(key => {
    if (m.hasOwnProperty(key)) {
      m[key] = title
    }
  })
}
// 获取菜单 id
export const getId = m => (m.menuId || m.id)
// 获取菜单 title
export const getTitle = m => m.menuTitle || m.text
// 获取菜单 父ID
export const getParentId = m => (m.menuParentId || m.parentMenuId)
// 获取菜单 children
export const getChildren = m => m.subMenus || m.childrens
// 删除children
export const deleteChildren = m => {
  delete m.subMenus
  delete m.childrens
}
// 转换url 
export const toUrl = str => {
  if (/^\//.test(str)) return str
  return '/' + str
}

// 选择菜单自动滚动到可视区域
let countT = 0
let timer = null
export function getSelectedScrollIntoView() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const menuBox = document.querySelector('.pcs-menu')
    const menuSelectedCell = menuBox && menuBox.querySelector('.next-selected')
    if (menuSelectedCell) {
      const { top, bottom } = menuSelectedCell.getBoundingClientRect();
      if (bottom + 20 > window.innerHeight || top < 75) {
        menuSelectedCell.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        })
      }
      countT = 0
    } else {
      // 5秒内未找到选中菜单，则放弃
      if (countT < 10) {
        getSelectedScrollIntoView()
        countT++
      } else {
        countT = 0
      }
    }
    clearTimeout(timer)
  }, 500)
}