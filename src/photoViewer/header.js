import React ,{PureComponent} from "react";
import classnames from 'classnames/bind'

import iconStyle from './fonts/icon.css'
import styles from './style.css'
let cn = classnames.bind(styles);
let icons = classnames.bind(iconStyle);

class Header extends PureComponent {
    render(){
        const {onClose,fullScreen} = this.props;
        return(
            <header className="viewer-header">
                <div >
                    <span className={cn("close")}>
                        <i
                            className={icons("iconfont","icon-close")}
                            onClick={onClose}
                            >
                        </i>
                    </span>

                </div>

            </header>
        )
    }
}


export default Header
