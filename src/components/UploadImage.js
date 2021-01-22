import React, {Component} from 'react'

class UploadImage extends Component {
  onImageChange = ({target}) => {
    this.props.uploadCallback(target.files)
  }

  render() {
    return (
      <label className='mdi mdi-attachment rsc-attachment'>
        <input
          multiple
          type='file'
          onChange={this.onImageChange}
          style={{visibility: 'hidden', position: 'absolute'}}
        />
      </label>
    )
  }
}

export default UploadImage
