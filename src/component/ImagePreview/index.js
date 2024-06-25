import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getUuid } from 'assets/js'
import { Dialog, Slider, Icon } from '@/component'
export default function App(props) {
    const { 
      urlList,
      imgWidth = 80,
      imgHeight = 40,
      preViewWidth = window.innerWidth,
      children,
      imgAlign
    } = props
    const [picState, setPicState] = useState({
        visible: false,
        picIndex: 0,
        preViewPic: null
    })
    const [slidesToShowCount, setSlidesToShowCount] = useState(3)
    const boxRef = useRef()
    useEffect(() => {
      if (boxRef.current && boxRef.current.getBoundingClientRect) {
        const { width } = boxRef.current.getBoundingClientRect();
        const slidesShowCount = Math.max(Math.floor(width / imgWidth), 1);
        setSlidesToShowCount(slidesShowCount)
      }
    }, [])
    // 生成图片
    function getPicDom({type = 'small',  url, onClick = ()=> {}} = {}) {
        const ImageHeight = {
          small: imgHeight,
          big: 'auto'
        }
        const MinHeight = {
          small: 0,
          big: 300
        }
        return <div key={getUuid()}>
          <div style={{
            height: '100%',
            minHeight: MinHeight[type],
            display: 'flex',
            alignItems: imgAlign || 'center',
            justifyContent: 'center',
            overflowY: 'auto',
            padding: 5
        }}>
            {url && <img src={url} onClick={onClick} style={{
              width: '100%',
              height: ImageHeight[type],
              cursor: 'pointer'
            }} alt="图片已过期"></img>}
          </div>
        </div>
    }
    // 预览图片
    // 大图片渲染
    const PreViewPicList = useMemo(() => {
      return Array.isArray(urlList) && urlList.map(pic => getPicDom({
        type: 'big',
        url: pic
      })) || getPicDom()
    }, [JSON.stringify(urlList)])
    // 获取预览图片
    const getPreViewPic = (imageList, type) => {
      return Array.isArray(imageList) ? imageList.map(pic => getPicDom({
        type,
        url: pic
      })) : PreViewPicList
    }
    /**
     * 打开图片预览
     * @param {Number} index 图片序号，默认打开第几张图片
     * @param {Array} imageList 图片列表， 默认为组件传入的图片，
     */
    function openImage(index = 0, imageList) {
      setPicState({
        visible: true,
        picIndex: index,
        preViewPic: getPreViewPic(imageList, 'big')
      })
    }
    // 小图渲染
    const smallPicList = useMemo(() => {
      if (Array.isArray(urlList)) {
        return urlList.map((v, index) => {
          return getPicDom({url: v, onClick: () => {
              setPicState({
                  visible: true,
                  picIndex: index,
                  preViewPic: getPreViewPic()
              })
          }})
        })
      } else {
        return getPicDom()
      }
    }, [JSON.stringify(urlList)])

    return <div style={{width: '100%'}} ref={boxRef}>
      {children ? <div>
        {typeof children === 'function' && children(urlList, openImage) || <span onClick={() => openImage()}>{children}</span>}
      </div> : <div style={{width: '100%', height: imgHeight}}>
        <Slider
            arrows={false}
            dots={false}
            infinite={false}
            slidesToShow={slidesToShowCount}
            autoplay={false}
        >
            {smallPicList}
        </Slider>
    </div>}
    <Dialog
        visible={picState.visible}
        style={{width: preViewWidth + 50}}
        footer={false}
        onClose={() => setPicState({
            ...picState,
            visible: false,
            picIndex: 0,
        })}
    >
        <Slider
            arrowPosition= "outer"
            dots={false}
            infinite={false}
            slidesToShow={1}
            defaultActiveIndex={picState.picIndex}
            autoplay={false}
            centerMode
            nextArrow={<Icon type="arrow-right" s="xxl"></Icon>}
            prevArrow={<Icon type="arrow-left" s="xxl"></Icon>}
        >
            {picState.preViewPic}
        </Slider>
    </Dialog>
    </div>
}