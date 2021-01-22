import React, { Component } from 'react';
import BotMessage from './BotMessage';
import Styles from './Options.module.css'

class Options extends Component {
  render() {
    return (
      <div>
        <BotMessage message={this.props.message} />
        <ul className={Styles.options}>
          {this.props.options.map((option, index) => {
            return (
              <li key={index} className={Styles.option}>
                <button onClick={(e) => this.props.clickCallback(e, index, option)} className={Styles.optionElement}>{option}</button>
              </li>
            )
          })}
        </ul>
        
      </div>
    );
  }
}

export default Options;