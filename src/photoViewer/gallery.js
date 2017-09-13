import React ,{Component} from "react"
import ImgItem from "./imgItem"
import Viewer from "./index"
class Gallery extends Component{
    constructor(props){
		super(props)
		this.state= {
            visible:false,
            activeIndex:0,
		}
	}
    onClose =() => {
        this.setState({ visible: false });
    }
    onClick = (index,e) => {
      this.setState({
        visible: true,
        activeIndex: Number(index),
      });
    }
    renderTxet =() =>{
		const {text} = this.props;
		return (
			<a onClick={(e) => this.onClick(0,e)}>{text}</a>
		)
	}
    renderImage = ()=>{
		const gallery = this.props.images.map((item, index) => {
		  return (
			 item.src?<ImgItem
			  handleClick = {this.onClick}
			  imgSrc = {item.src}
			  key = {index}
			  imgIndex = {index}
			  ></ImgItem>:null

		  )
		})
		return gallery
	}
    render(){
        const {visible,activeIndex} = this.state;
        const {images,thumbnail,zIndex} = this.props;
        return(
            <div>
                {thumbnail?this.renderImage():this.renderTxet()}
                {visible&&<Viewer
                    visible={visible}
                    onClose={this.onClose}
                    images={images}
                    activeIndex={activeIndex}
                    zIndex={zIndex}
                    >
                </Viewer>}
            </div>

        )
    }
}
Gallery.defaultProps={
	thumbnail:true,
	text:"",
	images:[{}],
}

export default Gallery;
