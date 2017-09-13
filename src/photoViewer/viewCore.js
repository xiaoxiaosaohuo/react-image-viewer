import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'

import retrieveImageUrl from './utils/retrieve-image-url'

const isTouchDevice = !!(
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  ('ontouchstart' in window || navigator.msMaxTouchPoints > 0)
)

const isFileAPISupported = typeof File !== 'undefined'

const draggableEvents = {
  touch: {
    react: {
      down: 'onTouchStart',
      mouseDown: 'onMouseDown',
      move: 'onTouchMove',
      mouseMove: 'onMouseMove',
      up: 'onTouchEnd',
      mouseUp: 'onMouseUp'
    },
    native: {
      down: 'touchstart',
      mouseDown: 'mousedown',
      move: 'touchmove',
      mouseMove: 'mousemove',
      up: 'touchend',
      mouseUp: 'mouseup'
    }
  },
  desktop: {
    react: {
      down: 'onMouseDown',
      move: 'onMouseMove',
      up: 'onMouseUp'
    },
    native: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup'
    }
  }
}
const deviceEvents = isTouchDevice
  ? draggableEvents.touch
  : draggableEvents.desktop

const pixelRatio =
  typeof window !== 'undefined' && window.devicePixelRatio
    ? window.devicePixelRatio
    : 1

const drawRoundedRect = (context, x, y, width, height) => {
    context.rect(x, y, width, height)
}

class ViewCore extends React.Component {


    constructor(props){
        super(props)
        this.state={
            my: null,
            mx: null,
            image: {
              x: 0,
              y: 0
            },
        }
        this.drag=false
    }


  isVertical () {
    return this.props.rotate % 180 !== 0
  }


  getDimensions () {
    const { width, height, rotate } = this.props
    const canvas = {}
    const canvasWidth = width
    const canvasHeight = height

    if (this.isVertical()) {
      canvas.width = canvasHeight
      canvas.height = canvasWidth
    } else {
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }


    return {
      canvas,
      rotate,
      width,
      height,
    }
  }




  getCroppingRect () {
    const position = {
      x: this.state.image.x,
      y: this.state.image.y
    }
    const {width,height} = this.state.image
    const dimensions = this.getDimensions()
    const canvasWidth = dimensions.width
    const canvasHeight = dimensions.height
    const croppingRect = {
      x: position.x,
      y: position.y,
    }
    //XY轴最大距离
    let maxX = (width*this.props.scale - canvasWidth) / 2
    let maxY  = (height*this.props.scale - canvasHeight) / 2
    let xMin = 0
    let xMax = maxX
    let yMin = 0
    let yMax = maxY

    const isLargerThanImage = this.props.scale > 1

    if (isLargerThanImage) {
      xMin = xMax>=0?-xMax:0
      xMax = xMax>=0?xMax:0
      yMin = yMax>=0?-yMax:0
      yMax = yMax>=0?yMax:0
    }
    return {
      ...croppingRect,
      x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
      y: Math.max(yMin, Math.min(croppingRect.y, yMax))
    }
  }

  isDataURL (str) {
    if (str === null) {
      return false
    }
    const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
    return !!str.match(regex)
  }

  loadImageURL (imageURL) {
      if(!imageURL){
          return false
      }
    const imageObj = new Image()
    imageObj.onload = this.handleImageReady.bind(this, imageObj)
    imageObj.onerror = this.props.onLoadFailure
    if (!this.isDataURL(imageURL) && this.props.crossOrigin) { imageObj.crossOrigin = this.props.crossOrigin }
    imageObj.src = imageURL
  }


  componentDidMount () {
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d')
    if (this.props.image) {
      this.loadImageURL(this.props.image)
    }
    this.paint(context)
    if (document) {
      const nativeEvents = deviceEvents.native
      document.addEventListener(nativeEvents.move, this.handleMouseMove, false)
      document.addEventListener(nativeEvents.up, this.handleMouseUp, false)
      if (isTouchDevice) {
        document.addEventListener(
          nativeEvents.mouseMove,
          this.handleMouseMove,
          false
        )
        document.addEventListener(
          nativeEvents.mouseUp,
          this.handleMouseUp,
          false
        )
      }
    }
  }

  componentWillUnmount () {
    if (document) {
      const nativeEvents = deviceEvents.native
      document.removeEventListener(
        nativeEvents.move,
        this.handleMouseMove,
        false
      )
      document.removeEventListener(nativeEvents.up, this.handleMouseUp, false)
      if (isTouchDevice) {
        document.removeEventListener(
          nativeEvents.mouseMove,
          this.handleMouseMove,
          false
        )
        document.removeEventListener(
          nativeEvents.mouseUp,
          this.handleMouseUp,
          false
        )
      }
    }
  }

  shouldComponentUpdate(nextProps,nextState){
     if(nextProps.image !== this.props.image ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.scale !== this.props.scale ||
      nextProps.rotate !== this.props.rotate||
      nextState.my !== this.state.my ||
      nextState.mx !== this.state.mx ||
      nextState.image.x !== this.state.image.x ||
      nextState.image.y !== this.state.image.y||
      nextState.image.y !== this.state.image.y||
      nextState.image.height !== this.state.image.height ||
      nextState.image.width !== this.state.image.width||
      this.state.image !=nextState.image

  ){
      return true
  }
      return false
  }
  componentDidUpdate (prevProps, prevState) {
    const canvas = ReactDOM.findDOMNode(this.canvas)
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    this.paint(context)
    this.paintImage(context, this.state.image)
    if (
      prevProps.image !== this.props.image ||
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height ||
      prevProps.position !== this.props.position ||
      prevProps.scale !== this.props.scale ||
      prevProps.rotate !== this.props.rotate ||
      prevState.my !== this.state.my ||
      prevState.mx !== this.state.mx ||
      prevState.image.x !== this.state.image.x ||
      prevState.image.y !== this.state.image.y
    ) {
      this.props.onImageChange()
    }
  }

  handleImageReady (image) {
    const imageState = this.getInitialSize(image.width, image.height)
    imageState.resource = image
    imageState.x = 0.5
    imageState.y = 0.5
    this.drag = false
    this.setState({ image: imageState }, this.props.onImageReady)
    this.props.onLoadSuccess(imageState)
  }

  getInitialSize (width, height) {
    let newHeight
    let newWidth

    const dimensions = this.getDimensions()
    const canvasRatio = dimensions.height / dimensions.width
    const imageRatio = height / width
    const canvasWidth = dimensions.width
    const canvasHeight = dimensions.height

    let newImg = {}
      if (width / height >= canvasWidth / canvasHeight) {
            if (width > canvasWidth) {
                newImg.width = canvasWidth;
                newImg.height = (height *canvasWidth ) / width;
                newImg.ratio = canvasWidth/width
            } else {
                newImg.width = width;
                newImg.height = height;
                newImg.ratio=1
            }
        } else {
            if (height > canvasHeight) {
                newImg.height = canvasHeight;
                newImg.width = (width * canvasHeight) / height;
                newImg.ratio=canvasHeight/height;
            } else {
                newImg.width = width;
                newImg.height = height;
                newImg.ratio=1
            }
        }



    return {
      height: newImg.height,
      width: newImg.width
    }
  }

  componentWillReceiveProps (newProps) {
    if (
      (newProps.image && this.props.image !== newProps.image) ||
      this.props.width !== newProps.width ||
      this.props.height !== newProps.height
    ) {
      this.loadImageURL(newProps.image)
    }
    if(this.props.activeIndex!=newProps.activeIndex){

    }
  }

  paintImage (context, image, scaleFactor = pixelRatio) {
    if (image.resource) {
      const position = this.calculatePosition(image)
      context.save()

      context.translate(context.canvas.width / 2, context.canvas.height / 2)
      context.rotate(this.props.rotate * Math.PI / 180)
      context.translate(
        -(context.canvas.width / 2),
        -(context.canvas.height / 2)
      )

      if (this.isVertical()) {
        context.translate(
          (context.canvas.width - context.canvas.height) / 2,
          (context.canvas.height - context.canvas.width) / 2
        )
      }

      context.scale(scaleFactor, scaleFactor)

      context.globalCompositeOperation = 'destination-over'
      context.drawImage(
        image.resource,
        position.x,
        position.y,
        position.width,
        position.height
      )

      context.restore()
    }
  }

  calculatePosition (image) {
    image = image || this.state.image

    const croppingRect = this.getCroppingRect()
    const dimensions = this.getDimensions()
    const canvasWidth = dimensions.width
    const canvasHeight = dimensions.height

    const width = image.width * this.props.scale
    const height = image.height * this.props.scale
    const initalX = (width - canvasWidth) / 2
    const initialY = (height - canvasHeight) / 2
    let x = croppingRect.x-initalX
    let y = croppingRect.y-initialY

    return {
      x,
      y,
      height,
      width
    }
  }

  paint (context) {
    context.save()
    context.scale(pixelRatio, pixelRatio)
    context.translate(0, 0)
    context.fillStyle = 'rgba(' + this.props.color.slice(0, 4).join(',') + ')'

    const dimensions = this.getDimensions()
    const height = dimensions.canvas.height
    const width = dimensions.canvas.width

    context.beginPath()
    drawRoundedRect(
      context,
      0,
      0,
      width ,
      height ,
      0
    )
    context.rect(width, 0, -width, height)
    context.fill('evenodd')

    context.restore()
  }

  handleMouseDown = (e) => {
    e = e || window.event

    e.preventDefault()
    e.stopPropagation()
    this.drag = true
    const mousePositionX = e.targetTouches
      ? e.targetTouches[0].pageX
      : e.clientX
    const mousePositionY = e.targetTouches
      ? e.targetTouches[0].pageY
      : e.clientY
    this.setState({
      mx: mousePositionX,
      my: mousePositionY,
    });

  }
  handleMouseUp = () => {
    if (this.drag) {
        this.drag = false
      this.setState({my:null,mx:null })
    }
  }

  handleMouseMove = (e) => {
      e = e || window.event
        if (this.drag === false) {
          return
        }
      const mousePositionX = e.targetTouches
      ? e.targetTouches[0].pageX
      : e.clientX
      const mousePositionY = e.targetTouches
      ? e.targetTouches[0].pageY
      : e.clientY
      const mx = mousePositionX-this.state.mx
      const my = mousePositionY-this.state.my

      const width = this.state.image.width * this.props.scale
      const height = this.state.image.height * this.props.scale
      const dimensions = this.getDimensions()
      const canvasWidth = dimensions.width
      const canvasHeight = dimensions.height
      let { x: lastX, y: lastY } = this.getCroppingRect()
      let x = lastX + mx
      let y = lastY + my


      let position = {
        x: x ,
        y: y
      }

      this.setState(prevState=>{
         return{
             mx:e.x,
             my:e.y,
             image:Object.assign({},prevState.image,position)
         }

      })

  }

  setCanvas = (canvas) => {
    this.canvas = canvas
  }

  render () {
    const dimensions = this.getDimensions();
    const defaultStyle = {
        width: dimensions.canvas.width,
      height: dimensions.canvas.height,
      cursor: this.drag ? 'grabbing' : 'grab'
    }

    const attributes = {
      width: dimensions.canvas.width * pixelRatio,
      height: dimensions.canvas.height * pixelRatio,
      style: {
        ...defaultStyle,
        ...this.props.style
      }
    }

    attributes[deviceEvents.react.down] = this.handleMouseDown
    if (isTouchDevice) { attributes[deviceEvents.react.mouseDown] = this.handleMouseDown }
    return <canvas ref={this.setCanvas} {...attributes} className={this.props.activeClass} />
  }
}




ViewCore.propTypes = {
  scale: PropTypes.number,
  rotate: PropTypes.number,
  image: PropTypes.oneOfType([
    PropTypes.string,
    ...(isFileAPISupported ? [PropTypes.instanceOf(File)] : [])
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  color: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.object,
  crossOrigin: PropTypes.oneOf(['', 'anonymous', 'use-credentials']),

  onDropFile: PropTypes.func,
  onLoadFailure: PropTypes.func,
  onLoadSuccess: PropTypes.func,
  onImageReady: PropTypes.func,
  onImageChange: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onPositionChange: PropTypes.func,

  disableDrop: PropTypes.bool
}

ViewCore.defaultProps = {
  disableDrop: false,
  scale: 1,
  rotate: 0,
  width: 200,
  height: 200,
  color: [0, 0, 0, 0.5],
  style: {},
  onDropFile () {},
  onLoadFailure () {},
  onLoadSuccess () {},
  onImageReady () {},
  onImageChange () {},
  onMouseUp () {},
  onMouseMove () {},
  onPositionChange () {}
}


export default ViewCore
