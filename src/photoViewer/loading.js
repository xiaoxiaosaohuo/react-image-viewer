import  React,{PureComponent} from 'react';
import classnames from 'classnames/bind';
import styles from "./style.css";
let cn = classnames.bind(styles);

export default class Loading extends PureComponent{
  constructor() {
    super();
    this.state={
        spinning:false
    }
  }


  componentWillReceiveProps(nextProps) {
    const currentSpinning = this.props.spinning;
    const spinning = nextProps.spinning;
    const { delay } = this.props;
    if (currentSpinning && !spinning) {
        if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
    }
    if (spinning && delay && !isNaN(Number(delay))) {
       if (this.delayTimeout) {
         clearTimeout(this.delayTimeout);
       }
       this.delayTimeout = setTimeout(() => this.setState({ spinning }), delay);
     } else {
       this.setState({ spinning });
     }
}

  render() {
    let cls = 'spin spin-spinning';
    const { spinning } = this.state;
    return (
      <div className={cn("spin-wrap")} style={this.props.style}>
        {spinning&&<div className={cn(cls)}>
          <div className={cn("spin-dot")}></div>
      </div>}
      </div>
    );
  }
}
