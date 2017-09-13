import React,{PureComponent} from "react"
import ReactDOM, { findDOMNode } from 'react-dom'
import styles from "./style.css"
import classnames from 'classnames/bind'
let cn = classnames.bind(styles);
class Portal extends PureComponent {
    constructor() {
        super();
        this.state = { active: false };
        this.portal = null;
        this.node = null;
    }
    componentDidMount() {

        if (this.props.visible) {
          this.openPortal();
        }
    }
    componentWillReceiveProps(newProps) {
            if (typeof newProps.visible !== 'undefined') {
              if (newProps.visible) {
                if (this.state.active) {
                  this.renderPortal(newProps);
                } else {
                  this.openPortal(newProps);
                }
              }
              if (!newProps.visible && this.state.active) {
                this.closePortal();
              }
            }

            if (typeof newProps.visible === 'undefined' && this.state.active) {
              this.renderPortal(newProps);
            }
      }
      componentWillUnmount() {
            this.closePortal(true);
      }
      openPortal(props = this.props) {
        this.setState({ active: true });
        this.renderPortal(props, true);
      }

      closePortal(isUnmounted = false) {
            const resetPortalState = () => {
              if (this.node) {
                  this.node.className=cn("portal","animated","zoomOut");
                  this.timer = setTimeout(()=>{
                      ReactDOM.unmountComponentAtNode(this.node);
                      document.body.removeChild(this.node);
                      this.timer=null ;
                      this.portal = null;
                      this.node = null;
                  },500)

              }

              if (isUnmounted !== true) {
                this.setState({ active: false });
              }
            };

            if (this.state.active) {
              if (this.props.beforeClose) {
                this.props.beforeClose(this.node, resetPortalState);
              } else {
                resetPortalState();
              }

            }
        }
      renderPortal(props, visible) {
            if (!this.node) {
              this.node = document.createElement('div');

               this.node.className=cn("portal","animated","zoomIn");
               this.node.style.zIndex=props.zIndex;

              document.body.appendChild(this.node);
            }

            let children = props.children;
            if (typeof props.children.type === 'function') {
              children = React.cloneElement(props.children, {
                closePortal: this.closePortal
              });
            }

            this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
              this,
              children,
              this.node,
              this.props.onUpdate
            );
      }

    render(){
        return null;
    }
}

export default Portal
