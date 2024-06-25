// bold：加粗按钮。
// italic：斜体按钮。
// underline：下划线按钮。
// strike：删除线按钮。
// blockquote：引用块按钮。
// code-block：代码块按钮。
// header：标题按钮，可以设置为1级或2级标题。
// list：列表按钮，可以设置为有序列表或无序列表。
// bullet：符号列表按钮。
// indent：缩进按钮，可以增加或减少缩进。
// outdent：取消缩进按钮。
// link：链接按钮。
// image：图片按钮。
// clean：清除格式按钮。
// direction：文本方向按钮，可以设置为从左到右或从右到左。

// var toolbarOptions = [  
//   ['bold', 'italic', 'underline', 'strike'], // toggled buttons  
//   ['blockquote', 'code-block'], // custom button values  
//   [{ 'header': 1 }, { 'header': 2 }], // custom button values  
//   [{ 'list': 'ordered'}, { 'list': 'bullet' }], // custom button values  
//   [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript  
//   [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent  
//   [{ 'direction': 'rtl' }] // text direct  
// ];

export const editorConfig = {
  placeholder: '请输入内容...',
}

export const modulesConfig = {
  toolbar: {
    container: [
      [{ 'size': ['small', false, 'large', 'huge'] }], //字体设置
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], //标题字号，不能设置单个字大小
      ['bold', 'italic', 'underline', 'strike'],  
      [{lineheight: ['', '1', '1-5', '1-75', '2', '3', '4', '5'] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'], // a链接和图片的显示
      [{ 'align': [] }],
      [{
        'background': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
          'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
          'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
          'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
          'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
          'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
          'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
          'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
          'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
          'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
          'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
          'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
      }],
      [{
        'color': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
          'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
          'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
          'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
          'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
          'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
          'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
          'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
          'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
          'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
          'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
          'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
      }],
      ['clean'], //清空
      ['emoji'], //emoji表情，设置了才能显示
      ['video2'], //我自定义的视频图标，和插件提供的不一样，所以设置为video2
    ],
  }
  // toolbar: [
  //   [{header: [1, 2, 3, 4, 5, false]}],
  //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //   [
  //     {list: 'ordered'},
  //     {list: 'bullet'},
  //     {indent: '-1'},
  //     {indent: '+1'},
  //   ],
  //   ['link', 'image'],
  //   ['clean']
  // ],
}