import {Notification} from '@alifd/next'
import {getFullscreenElement, addWatchFullScreen} from '@/component/FullSreen/api'
addWatchFullScreen(() => {
  Notification.config({
    getContainer: () => getFullscreenElement()
  })
})
export default Notification