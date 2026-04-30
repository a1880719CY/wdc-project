/**
 * 发送 Ajax 请求
 * @param {Object} options - 请求配置对象
 * @param {string} options.method - 请求方法，默认为 GET
 * @param {string} options.url - 请求 URL
 * @param {Object} options.headers - 请求头对象
 * @param {string|Object} options.data - 请求体数据，可以是字符串或对象
 * @param {string} options.dataType - 响应数据类型，可以是 'text' 或 'json'，默认为 'text'
 * @param {function} options.success - 请求成功回调函数，接收响应数据作为参数
 * @param {function} options.error - 请求失败回调函数，接收状态码和状态文本作为参数
 */
function ajax(options) {
  // 创建 XMLHttpRequest 对象
  var xhr = new XMLHttpRequest();

  // 设置请求方法和 URL
  xhr.open(options.method || 'GET', options.url);

  // 设置请求头
  if (options.headers) {
    for (var header in options.headers) {
      console.log(header,options.headers[header])
      xhr.setRequestHeader(header, options.headers[header]);
    }
  }

  // 监听 readyState 变化事件
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // 请求完成，处理响应
      var response = xhr.responseText;
      if (options.dataType === 'json') {
        response = JSON.parse(response);
      }
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        // 请求成功
        options.success && options.success(response);
      } else {
        // 请求失败
        options.error && options.error(xhr.status, xhr.statusText);
      }
    }
  };

  // 发送请求
  xhr.send(options.data || null);
}





// 第一步:构建一个构造函数,携带一个json对象的参数,json指的是大括号里的内容
function Page(json) {
  this.option = {
    count: 100,//总数据
    pagenum: 10,//每页显示的数据数量
    pageindex: 5//每页显示的页码数量
  }
  Object.assign(this.option, json.data);
  this.callback = json.callback;
  // this.target指向的dom元素，获取元素
  this.target = document.querySelector(json.el);
  // 第三步，根据option里的数据动态生成ul里的li，option里的数据到时候是动态请求的
  this.showpageindex = 1;//显示的页面用checked的class属性
  // 第二步:获取dom元素后，虚拟dom,生成页面,用封装函数来生成调用
  this.creat();
  this.creatdata();
  // this.clickevent();
}
Page.prototype.clickevent = function () {
  this.prev.className = 'checked';
  this.next.className = 'checked';
  this.prev.onclick = "";
  this.next.onclick = "";
  // 这里两层函数，需要注意的是this指针指向问题
  if (this.showpageindex != 1) {
    this.prev.onclick = () => {
      this.showpageindex--;
      this.creatdata();
    }
    this.prev.className = "";
  }
  if (this.showpageindex != this.maxShowNum) {
    this.next.onclick = () => {
      this.showpageindex++;
      this.creatdata();
    }
    this.next.className = "";
    //可以做到切换页面，但会生成重复的dom元素
  }
}


Page.prototype.creatdata = function () {
  var middle = Math.floor(this.option.pageindex / 2);//向下取整
  var start = 1;
  var maxShowNum = Math.ceil(this.option.count / this.option.pagenum);//最大页数
  this.maxShowNum = maxShowNum;
  var end = this.option.pageindex;
  end = end > maxShowNum ? maxShowNum : end;//判断自定义的end数，与数据之间生成的最大页数相比关系，避免页码过多

  this.content.innerHTML = "";//这一步操作指向的是clickevent函数的bug问题，生成li之前，先清空li

  if (this.showpageindex > middle) {//如果带class的页码大于中间值之后，因为页码是奇数，就是+-中间值就行
    start = this.showpageindex - middle;
    end = this.showpageindex + middle;
  }
  if (this.showpageindex > (maxShowNum - middle)) {
    start = maxShowNum - this.option.pageindex + 1;
    end = maxShowNum;
  }
  if (start <= 1) {
    start = 1
  }
  var that = this;
  for (var i = start; i <= end; i++) {
    var li = document.createElement('li');
    li.innerHTML = i;
    if (i == this.showpageindex) {
      li.className = 'checked';
    }
    this.content.appendChild(li);

    li.onclick = function () {
      that.showpageindex = this.innerHTML * 1;
      that.creatdata();
    }
  }
  this.clickevent();
  this.callback(this.showpageindex);
}


// 对应的是第二步的封装函数
Page.prototype.creat = function () {
  // 创造元素并加入到页面中
  this.prev = document.createElement('span');
  this.prev.className = 'page-prev';
  this.prev.innerHTML = '上一页';
  this.target.appendChild(this.prev)//写入，appendChild用法

  this.content = document.createElement('ul');
  this.content.className = 'page-content';
  this.target.appendChild(this.content);

  this.next = document.createElement('span');
  this.next.className = 'page-next';
  this.next.innerHTML = '下一页';
  this.target.appendChild(this.next);
}



//富文本编辑器
/**
 * 1.使用方法先试用 editorHtml()方法渲染表格
 * 2.然后执行js代码 editor()必须要在editorHtml()后面执行
 * 3.document.getElementById("edit").oninput = function () {
 *    // val为富文本的值
        let val= document.getElementById("edit").innerHTML
    }
 */
const editor = () => {

  // 富文本编辑器类
  class Editor {
    constructor() {
      this.bindElem();
    }
    bindElem() {

      var toolbar = document.getElementById("toolbar");
      var bs = toolbar.querySelectorAll('input,select');
      for (var i = 0; i < bs.length; i++) {
        if (bs[i].tagName.toLowerCase() == 'select') {
          bs[i].onchange = function () {
            document.execCommand(this.name, true, this.value);
          }
        } else if (bs[i].tagName.toLowerCase() == 'input') {
          this.action(bs[i], bs[i].name);
        }
      }


    }

    action(obj, attr) {
      obj.onclick = function () {
        document.execCommand(attr, true);
      }
    }

  }
  new Editor();

}

const editorHtml = (title="") => {
  return `
      <div class="toolbarTitle" style="display:flex">
      <div style="width:150px; text-align:right;">${title}:</div>
      <div style="width:80%;margin-left:10px;">
      <div id="toolbar"
          style="border-radius: 5px 5px 0 0;width:100%;margin:10px 0 0 0;border:2px solid gray;padding: 5px;overflow: auto;font-family: 'Courier New', Courier, monospace;border-bottom: none;">
          <input  class='tableAdd' type="button" name="bold" value='Bold' class="bold">
          <input  class='tableAdd' type="button" name="italic" value='Italic' class="italic">
          <input  class='tableAdd' type="button" name="underline" value='Underline' class="decotation">
      </div>
      <div id="edit" 
          style="width:100%;height:200px;margin:0 0 0 0px;border:2px solid gray;padding: 5px;overflow: auto;"
          contenteditable="true">
      </div>
      </div>
      </div>
      `
      // <button id="save" style="width:300px;height:30px;margin:auto;margin-top:30px;
      // background-color: green;border:1px solid green;display: block;color: white;font-family:'Courier New', Courier, monospace;
      // font-weight: 500;font-size: 20px;">点 击</button>
}

//message 


// 消息类型
const MessageType = {
  MESSAGE: 'message', // 普通
  SUCCESS: 'success', // 成功
  ERROR: 'error', // 错误
  WARNING: 'warning' // 警告
}

// 状态icon图标
const MessageIcons = {
  MESSAGE: 'el-icon-info',
  SUCCESS: 'el-icon-success',
  ERROR: 'el-icon-error',
  WARNING: 'el-icon-warning'
}

// 状态对应的主色
const MessageTypeColor = {
  MESSAGE: '#909399',
  SUCCESS: '#67c23a',
  ERROR: '#f56c6c',
  WARNING: '#e6a23c'
}

// 创建DOM
const createDom = ({ isId = false, name = '', tag = 'div' }) => {
  if (!tag) {
    return null
  }
  const ele = document.createElement(tag)
  if (name) {
    if (isId) {
      ele.id = name
    } else {
      ele.className = name
    }
  }
  return ele
}

// 获取类型对应的背景色
const getTypeBGColor = type => {
  let bgColor = ''
  switch (type) {
    case MessageType.SUCCESS:
      bgColor = 'background-color: #f0f9eb'
      break
    case MessageType.ERROR:
      bgColor = 'background-color: #f0f9eb'
      break
    case MessageType.WARNING:
      bgColor = 'background-color: #f0f9eb'
      break
    default:
      bgColor = 'background-color: #edf2fc'
      break
  }
  return bgColor
}

// 获取类型对应的背景色、文字颜色
const getTypeDomCss = type => {
  let cssStr = ''
  let commonCss = ''
  switch (type) {
    case MessageType.SUCCESS:
      cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.SUCCESS};`
      break
    case MessageType.ERROR:
      cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.ERROR};`
      break
    case MessageType.WARNING:
      cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.WARNING};`
      break
    default:
      cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.MESSAGE};`
      break
  }
  return cssStr
}

// 获取类型对应的icon图标的code
const getIconClass = type => {
  let iconClass = ''
  switch (type) {
    case MessageType.SUCCESS:
      iconClass = MessageIcons.SUCCESS
      break
    case MessageType.ERROR:
      iconClass = MessageIcons.ERROR
      break
    case MessageType.WARNING:
      iconClass = MessageIcons.WARNING
      break
    default:
      iconClass = MessageIcons.MESSAGE
      break
  }
  return iconClass
}

// 获取类型对应的icon图标的额外样式
const getTypeIconCss = type => {
  let cssStr = ''
  let commonCss = 'margin-right: 10px;font-size: 20px;'
  switch (type) {
    case MessageType.SUCCESS:
      cssStr = commonCss + `color: ${MessageTypeColor.SUCCESS};`
      break
    case MessageType.ERROR:
      cssStr = commonCss + `color: ${MessageTypeColor.ERROR};`
      break
    case MessageType.WARNING:
      cssStr = commonCss + `color: ${MessageTypeColor.WARNING};`
      break
    default:
      cssStr = commonCss + `color: ${MessageTypeColor.MESSAGE};`
      break
  }
  return cssStr
}

const createMessage = ({ type, content, duration, delay, againBtn, minWidth, maxWidth }, mainContainer) => {
  if (!mainContainer) {
    console.error('主容器不存在，查看调用流程，确保doucument.body已生成!')
    return
  }
  /**随机的key */
  const randomKey = Math.floor(Math.random() * (99999 - 10002)) + 10002

  /**属性配置 */
  const config = {
    isRemove: false, // 是否被移除了
    type: type || MessageType.MESSAGE, // 类型 message success error warning
    content: content || '', // 提示内容
    duration: duration || 3000, // 显示时间
    delay: delay || 0, // 弹出延迟
    timeout: null, // 计时器事件
    againBtn: againBtn || false // 是否需要显示 不再提示 按钮
  }
  // #region 生成DOM、样式、关系
  const messageContainer = createDom({ name: `message-${randomKey}`, tag: 'div' })
  messageContainer.style = `
  min-width: ${minWidth}px;
  max-width:${maxWidth}px;
  padding: 12px 12px;
  margin-top: -20px;
  border-radius: 4px;
  box-shadow: -5px 5px 12px 0 rgba(204, 204, 204, 0.8);
  ${getTypeBGColor(config.type)};
  animation: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.4s;
  transition: all .4s;
  pointer-events: auto;
  overflow:hidden;
  `
  /**内容区域 */
  const messageTypeDom = createDom({ tag: 'div' })
  messageTypeDom.style = getTypeDomCss(config.type)
  // icon
  // const messageTypeIcon = createDom({ name: `icon iconfont ${getIconClass(config.type)}`, tag: 'i' })
  const messageTypeIcon = createDom({ name: `${getIconClass(config.type)}`, tag: 'i' })
  messageTypeIcon.style = getTypeIconCss(config.type)
  /**文本内容 */
  const messageTypeText = createDom({ tag: 'span' })
  messageTypeText.style = 'font-size: 14px;line-height: 20px;'
  messageTypeText.innerHTML = config.content
  /**建立html树关系 */
  messageTypeDom.appendChild(messageTypeIcon)
  messageTypeDom.appendChild(messageTypeText)
  messageContainer.appendChild(messageTypeDom)
  /**不再提示的按钮 */
  if (config.againBtn) {
    const messageAgainDiv = createDom({ name: 'message-again-btn', tag: 'div' })
    messageAgainDiv.style = `margin-top: 5px;text-align: right;`
    const messageAgainBtnText = createDom({ name: 'message-again-text', tag: 'span' })
    messageAgainBtnText.innerHTML = '不再提示'
    messageAgainBtnText.style = `
      font-size: 12px;
      color: rgb(204, 201, 201);
      border-bottom: 1px solid rgb(204, 201, 201);
      cursor: pointer;
      `
    // 鼠标移入
    messageAgainBtnText.onmouseover = () => {
      messageAgainBtnText.style.color = '#fdb906'
      messageAgainBtnText.style.borderBottom = '1px solid #fdb906'
    }
    // 鼠标移出
    messageAgainBtnText.onmouseout = () => {
      messageAgainBtnText.style.color = 'rgb(204, 201, 201)'
      messageAgainBtnText.style.borderBottom = '1px solid rgb(204, 201, 201)'
    }
    messageAgainDiv.appendChild(messageAgainBtnText)
    messageContainer.appendChild(messageAgainDiv)
    config.elsAgainBtn = messageAgainBtnText
  }
  mainContainer.appendChild(messageContainer)
  // #endregion

  /**绑定DOM、销毁事件，以便进行控制内容与状态 */
  config.els = messageContainer
  config.destory = destory.bind(this)
  function destory(mainContainer, isClick) {
    if (!config.els || !mainContainer || config.isRemove) {
      // 不存在，或已经移除，则不再继续
      return
    }
    config.els.style.marginTop = '-20px' // 为了过渡效果
    config.els.style.opacity = '0' // 为了过渡效果
    config.isRemove = true
    if (isClick) {
      mainContainer.removeChild(messageContainer)
      _resetMianPosition(mainContainer)
      free()
    } else {
      setTimeout(() => {
        mainContainer.removeChild(messageContainer)
        _resetMianPosition(mainContainer)
        free()
      }, 400)
    }
  }

  // 销毁重置绑定
  function free() {
    config.els = null
    config.elsAgainBtn = null
    config.destory = null
  }

  return config
}

function _toBindEvents(domConfig, _self) {
  if (!domConfig) {
    return
  }
  // 不再提示按钮的事件绑定
  if (domConfig.againBtn && domConfig.elsAgainBtn) {
    // 鼠标点击：将内容记录下来，下次就不显示同内容的弹框
    domConfig.elsAgainBtn.onclick = () => {
      clearTimeout(domConfig.timeout)
      let sessionJson = sessionStorage.getItem('MESSAGE_DONT_REMIND_AGAIN')
      let tempArr = sessionJson ? JSON.parse(sessionJson) : []
      let dontRemindAgainList = Array.isArray(tempArr) ? tempArr : []
      dontRemindAgainList.push(domConfig.content)
      sessionStorage.setItem(_self.sessionStorageName, JSON.stringify(dontRemindAgainList))
      domConfig.destory(_self.mainContainer, true)
    }
  }

  // 鼠标移入：对销毁计时器进行销毁
  domConfig.els.onmouseover = () => {
    clearTimeout(domConfig.timeout)
  }
  // 鼠标移出： 一秒后销毁当前message
  domConfig.els.onmouseout = () => {
    domConfig.timeout = setTimeout(() => {
      domConfig.destory(_self.mainContainer)
      clearTimeout(domConfig.timeout)
    }, 1000)
  }

  // 延时隐藏
  domConfig.timeout = setTimeout(() => {
    domConfig.destory(_self.mainContainer)
    clearTimeout(domConfig.timeout)
  }, domConfig.duration)
}

function _resetMianPosition(mainContainer) {
  if (!mainContainer) {
    return
  }
  mainContainer.style.left = `calc(50vw - ${mainContainer.scrollWidth / 2}px)`
}

class messageControl {
  constructor() {
    this.minWidth = 380 // 内容显示宽度：最小值
    this.maxWidth = 800 // 内容显示宽度：最大值
    this.top = 45 // 整体的最顶部距离
    this.zIndex = 999 // 层级
    this.mainContainerIdName = 'selfDefine-message-box' // 主体DOM的id名
    this.sessionStorageName = 'MESSAGE_DONT_REMIND_AGAIN' // 存储session信息的key
    /**生成主体DOM、样式容器 */
    let mainDom = document.getElementById(this.mainContainerIdName)
    if (mainDom) {
      document.body.removeChild(mainDom)
    }
    this.mainContainer = createDom({ isId: true, name: this.mainContainerIdName, tag: 'div' })
    this.mainContainer.style = `
    pointer-events:none;
    position:fixed;
    top:${this.top}px;
    left:calc(50vw - ${this.minWidth / 2}px);
    z-index:${this.zIndex};
    display: flex;
    flex-direction: column;
    align-items:center;
    `
    document.body.appendChild(this.mainContainer)
  }

  /**
   * 消息提示
   * @param {String} type 类型 | 必传 | 可选值：message success error warning
   * @param {String} content 内容 | 必传 | ''
   * @param {Number} duration 显示时间 | 非必传 | 默认3000毫秒
   * @param {Number} delay 出现的延时 | 非必传 | 默认0
   * @param {Boolean} againBtn 是否显示 不再提示 按钮 | 非必传 | 默认false
   */
  message(config = {}) {
    // 不再提示（相同文字内容）的存储与判断逻辑待优化
    let sessionJson = sessionStorage.getItem(this.sessionStorageName)
    let dontRemindAgainList = sessionJson ? JSON.parse(sessionJson) : null
    // 需要显示不再提示按钮，且内容有效，且不再提示的记录数组中包含本次内容，则不提示
    if (config.againBtn && config.content && dontRemindAgainList && Array.isArray(dontRemindAgainList) && dontRemindAgainList.includes(config.content)) {
      return
    }

    const domConfig = createMessage(
      {
        type: config.type,
        content: config.content,
        duration: config.duration,
        delay: config.delay,
        againBtn: config.againBtn,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth
      },
      this.mainContainer
    )
    this.mainContainer.appendChild(domConfig.els)
    domConfig.els.style.marginTop = '20px' // 为了过渡效果
    _resetMianPosition(this.mainContainer)
    _toBindEvents(domConfig, this)
  }

  beforeDestory() {
    if (this.mainContainer && this.mainContainer.remove) {
      this.mainContainer.remove()
    } else {
      document.body.removeChild(this.mainContainer)
    }
    this.mainContainer = null
  }
}
