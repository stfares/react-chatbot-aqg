import React, {Component} from 'react'
import BotMessage from './BotMessage'

class ShowImages extends Component {
  render() {
    return (
      <div>
        <BotMessage message='Below are the uploaded files(s), now click Send to generate quiz.' />
        <div style={{display: 'flex', flexWrap: 'wrap', padding: 5}}>
          {this.props.files.map((file, index) => {
            const src = URL.createObjectURL(file)
            return (
              <img
                src={src}
                alt=''
                key={index}
                style={{width: 80, height: 80, margin: 5}}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default ShowImages
