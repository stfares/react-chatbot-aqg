import React from 'react';
import Styles from './LoadingIndicator.module.css';

const Loading = (props) => {
  return <div className={Styles.wrapper} style={props.style}>
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="66" height="18" viewBox="0 0 66 18">
      <title>wm-loading</title>
      <circle className={Styles.dot1} id="dot-1" cx="9" cy="9" r="9"/>
      <circle className={Styles.dot2} id="dot-2" cx="33" cy="9" r="9"/>
      <circle className={Styles.dot3} id="dot-3" cx="57" cy="9" r="9"/>
    </svg>
  </div>
}

export default Loading;
