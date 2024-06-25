const loop = () => {};
// 触发全屏
export function getFullScreen(node) {
  const toDoFullScreen = node.requestFullscreen || node.mozRequestFullScreen || node.msRequestFullscreen || node.webkitRequestFullscreen;
  if (typeof toDoFullScreen === 'function') {
    toDoFullScreen.call(node)
  }
}
// 退出 全屏
export function CancelFullScreen() {
  const toDoExitFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitCancelFullScreen;
  if (typeof toDoExitFullScreen === 'function') {
    toDoExitFullScreen.call(document)
  }
}
// 获取 全屏元素
export function getFullscreenElement(){
  return  document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}
// 监听全屏事件
export function addWatchFullScreen(success = loop, error = loop) {
  // 成功
  document.addEventListener('fullscreenchange', success);
  document.addEventListener('webkitfullscreenchange', success);
  document.addEventListener('mozfullscreenchange', success);
  document.addEventListener('MSFullscreenChange', success);
  // 失败
  document.addEventListener('fullscreenerror', error);
  document.addEventListener('webkitfullscreenerror',error);
  document.addEventListener('mozfullscreenerror', error);
  document.addEventListener('MSFullscreenError', error);
}