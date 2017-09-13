import React,{PureComponent} from "react";
import styles from "./style.css";
import {thumbnail} from "../../common/utils";
class ImgItem extends PureComponent{
	render(){
		const {handleClick,imgIndex,imgSrc} = this.props;
		return(
			<div className={styles.pictureWrapper}>
				<a className={styles.pictureA}
				   onClick={(e) => handleClick(imgIndex, e)}
				>
				<img src={thumbnail(imgSrc,"20-")}/>
				</a>
			</div>
		)
	}
}

export default ImgItem;
