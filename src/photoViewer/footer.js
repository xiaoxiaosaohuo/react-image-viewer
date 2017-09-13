import React,{PureComponent} from "react";
import classnames from 'classnames/bind'

import iconStyle from './fonts/icon.css'
import styles from './style.css'
let cn = classnames.bind(styles);
let icons = classnames.bind(iconStyle);
class Footer  extends PureComponent {
    render(){
        const {rotateLeft,rotateRight,reset,zoomIn,zoomOut,ratio} = this.props;
        return(
            <div className={cn("footer")}>
                <div className={cn("toolbar")}>
                    <ul >
                        <li className={icons("iconfont","icon-rotateLeft")} onClick={rotateLeft}></li>
                        <li className={icons("iconfont","icon-rotateRight")} onClick={rotateRight}></li>
                        <li className={icons("iconfont","icon-reset")} onClick={reset}></li>
                        <li className={icons("iconfont","icon-zoomIn")} onClick={zoomIn}></li>
                        <li className={icons("iconfont","icon-zoomOut")} onClick={zoomOut}></li>
                        <li className={icons("iconfont")} > | </li>
                        <li className={icons("iconfont")} >{ratio}</li>
                    </ul>
                </div>
            </div>

        )
    }

}

export default Footer
