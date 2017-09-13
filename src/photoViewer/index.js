import React from 'react'
import ReactDOM from 'react-dom'
import ViewCore from './viewCore'
import classnames from 'classnames/bind'
import Rnd from '../draggable-resizable'
import Header from './header'
import ArrowLeft from './arrowLeft'
import ArrowRight from './arrowRight'
import Footer from './footer'
import styles from './style.css'
import Portal from './portal'
import getWin from './utils/getWH'
import ImgFailure from "./imgFailure.png"
import Loading from "./loading"
import Preload from "./utils/preload"
let cn = classnames.bind(styles)
const winH = getWin().height;
const winW = getWin().width;

class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            visible:false,
            width:800,//默认容器宽度
            height:600,
            position: { x: 0, y: 0 },
            scale: 1,
            rotate: 0,
            activeIndex:props.activeIndex||0,
            error:false,
            loadErrorIndex:-1,
            spinning:false,
         }

        this.scaleStep = 0.05;
        this.timer = null;
        this.curImage={};
        this.ratio = 1;
        this.firstLoad = true;
        this.spinning = false;
    }

    handlePrev = ()=>{
        const {activeIndex} = this.state;
        if (activeIndex - 1 >= 0) {
            this.loadImg(activeIndex-1)

        }
        this.setState({
            error:activeIndex - 1 < 0,
        })


        this.reset()
    }
    handleNext= ()=>{
        const {activeIndex} = this.state;
        const len = this.props.images.length
        if (activeIndex + 1 < len) {
            this.loadImg(activeIndex+1)
        }
        this.setState({
            error:activeIndex + 1 >= len,
        })

        this.reset()

    }
    getInitialSize = (img)=>{
        const winH = getWin().height;
        const winW = getWin().width;
        const{width,height} = this.state;
        let newImg = {}
          if (img.width / img.height >= width / height) {
                if (img.width > width) {
                    newImg.width = width;
                    newImg.height = (img.height *width ) / img.width;
                    newImg.ratio = width/img.width
                } else {
                    newImg.width = img.width;
                    newImg.height = img.height;
                    newImg.ratio=1
                }
            } else {
                if (img.height > height) {
                    newImg.height = height;
                    newImg.width = (img.width * height) / img.height;
                    newImg.ratio=height/img.height;
                } else {
                    newImg.width = img.width;
                    newImg.height = img.height;
                    newImg.ratio=1
                }
            }


          return newImg

    }

    loadImg = (activeIndex) => {
        let images = this.props.images || [];
        this.setState({
            spinning:true,
         })

         Preload.loadImage(images[activeIndex].src)
         .then((img)=>{
             this.curImage.width = img.width;
             this.curImage.height = img.height;
             const newImg = this.getInitialSize(img)
             this.ratio =newImg.ratio;
            //  console.log(img.src);
            let timer =  setTimeout(()=>{
                 this.setState({
                   spinning:false,
                   activeIndex: activeIndex,
                   loadErrorIndex:-1,
                })
                clearTimeout(timer)
            },50)

        },()=>{
            this.onLoadFailure(activeIndex)
        })

    }
    reset = ()=>{

        if(this.curImage.width){
            const newImg = this.getInitialSize(this.curImage)
            this.ratio = newImg.ratio
            this.setState({
                rotate: 0,
                scale:1,
            })
        }

    }
    zoomIn = () => {
        const {scale} = this.state;
        this.ratio = this.ratio+this.scaleStep

        this.setState(prevState=>{
            return{
                scale:prevState.scale+this.scaleStep
            }
        })
    }
    zoomOut =()=>{
        const {scale} = this.state;
        this.ratio= Math.abs(this.ratio-this.scaleStep);
        this.setState(prevState=>{
            return{
                scale:Math.abs(prevState.scale-this.scaleStep)
            }
        })
    }
    rotateLeft = (e) => {
      e.preventDefault()

      this.setState({
        rotate: this.state.rotate - 90
      })
    }
    rotateRight = (e) => {
      e.preventDefault()
      this.setState({
        rotate: this.state.rotate + 90
      })
    }

    bindEvent = (remove) => {
       let funcName = 'addEventListener';
       if (remove) {
         funcName = 'removeEventListener';
       }
       document[funcName]('keydown', this.handleKeydown, false);
     }

    handleKeydown = (e) => {
       let keyCode = e.keyCode || e.which || e.charCode;
       let isFeatrue = false;
       switch (keyCode) {
         // key: esc
         case 27:
           e.stopPropagation()
           this.props.onClose();
           isFeatrue = true;
           break;
         // key: ←
         case 37:
           if (e.ctrlKey) {
             this.rotateLeft(e);
           }else {
             this.handlePrev();
           }
           isFeatrue = true;
           break;
         // key: →
         case 39:
           if (e.ctrlKey) {
             this.rotateRight(e);
           }else {
             this.handleNext();
           }
           isFeatrue = true;
           break;
         // key: ↑
         case 38:
           this.zoomIn();
           isFeatrue = true;
           break;
         // key: ↓
         case 40:
           this.zoomOut();
           isFeatrue = true;
           break;
         default:
           break;
       }
       if (isFeatrue) {
         e.preventDefault();
       }
     }


     onClose = ()=>{
         this.props.onClose()
     }

     renderErrorMsg = ()=>{
         const {error} = this.state;
         if(error&&!this.timer){
            this.timer = setTimeout(()=>{
                 this.setState({
                     error:false
                 })
                 clearTimeout(this.timer)
                 this.timer=null;
             },2000)
         }

         return error?<p className={cn('errorMsg','animated','zoomIn')}>无更多图片</p>:null

     }
     onResizeStop=(e,direction,refToElement,delta)=>{

         this.setState(prevState=>{
             return{
                 width:prevState.width+delta.width,
                 height:prevState.height+delta.height
             }
         })
     }


    onLoadFailure= (activeIndex)=>{
        return ()=>{
            this.setState({
                loadErrorIndex:activeIndex,
                activeIndex:activeIndex,
                spinning:false
            })
        }

    }

     componentDidMount(){
        this.bindEvent();
        this.loadImg(this.props.activeIndex)
        Preload.loadImages(this.props.images)
        }
     componentWillUnmount() {
       this.bindEvent(true);
        }

    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.activeIndex!=this.props.activeIndex||
            nextProps.visible!=this.props.visible||
            // nextState.defaultPos.x!=this.state.defaultPos.x||
            nextState.height != this.state.height||
            nextState.width!= this.state.width||
            nextState.activeIndex !=this.state.activeIndex||
            nextState.scale!=this.state.scale||
            nextState.rotate!=this.state.rotate||
            nextState.width!=this.state.width||
            nextState.height!=this.state.height||
            nextState.error != this.state.error||
            nextState.spinning !=this.state.spinning
        ){
            return true
        }
        return false
    }
    render(){
        const {visible,images,zIndex=1000} = this.props;
        let activeImg = {
          src: '',
          alt: '',
        };
        const {activeIndex,spinning,loadErrorIndex,error,width,height,slide} = this.state;
        const len = images.length;
        activeImg = {...images[activeIndex]};
        if(loadErrorIndex>=0){
            activeImg.src = ImgFailure;
            activeImg.alt = "加载出错";
        }
        const ratio = Math.floor(this.ratio*100)+'%';
        // console.log(activeImage);
        // const activeClass = cn("animated",{fadeIn:activeImage},{fadeOut:!activeImage})
        return (
            <Portal visible={visible} zIndex={zIndex}>
                <div className={styles.portalContainer} >
            <Rnd
              default={{
                x: (winW-width)/2,
                y: (winH-height)/2,
                width: width,
                height: height,
              }}
              minWidth={400}
              minHeight={300}
              z={10000}

              bounds="body"
              dragHandlerClassName=".viewer-header"
              onResizeStop ={this.onResizeStop}
            >
                <div className={cn("modal")} >
                    {activeIndex>0&&<ArrowLeft onClick={this.handlePrev}></ArrowLeft>}

                    <Header onClose = {this.onClose}></Header>
                    <div className={cn("content")}>
                        <Loading spinning = {spinning} delay={500}></Loading>

                        <div className={cn("modalbody")}>
                             <ViewCore
                                 width={width}
                                 height={height}
                                 scale={parseFloat(this.state.scale)}
                                  rotate={parseFloat(this.state.rotate)}
                                  image={activeImg.src}
                                  activeIndex={activeIndex}
                                //   activeClass={activeClass}
                                 >
                              </ViewCore>
                        </div>

                    </div>
                    <Footer
                        rotateLeft = {this.rotateLeft}
                        rotateRight = {this.rotateRight}
                        reset = {this.reset}
                        zoomIn = {this.zoomIn}
                        zoomOut = {this.zoomOut}
                        ratio={ratio}
                        ></Footer>

                    {activeIndex+1<len&&<ArrowRight onClick={this.handleNext}></ArrowRight>}
                </div>
                {this.renderErrorMsg()}
            </Rnd>
            </div>
            </Portal>
        )
    }
}
export default App;
