
import React,{PureComponent} from "react"
import classnames from 'classnames/bind'
import iconStyle from './fonts/icon.css'
import styles from './style.css'
let cn = classnames.bind(styles);
let icons = classnames.bind(iconStyle);
class ArrowLeft extends PureComponent {
  render() {
    const { onClick } = this.props;
    return (<div className={cn("arrow-prev")} onClick={onClick}>
        <i className={icons("iconfont","icon-prev")}> </i>
    </div>)
  }
}

export default ArrowLeft
