import React, {Component} from 'react';
import BotMessage from './components/BotMessage';
import Options from './components/Options';
import ShowImages from './components/ShowImages';
import UserMessage from './components/UserMessage';
import UploadImage from './components/UploadImage';
import Quiz from './components/Quiz';
import { v4 as uuidv4 } from 'uuid';

import './App.css'

class App extends Component {
  state = {
    inputValue: '',
    src: '',
    quiz: false,
    files: null,
    questions: [],
    chats: [{
      type: 'bot',
      id: uuidv4(),
      message: 'What is your name'
    }]
  }

  onValueChange = ({target}) => {
    this.setState({
      inputValue: target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.files && this.state.files.length) {
      const formData = new FormData();
      formData.append('image', this.state.files[0])
  
      const url = 'http://localhost:5000/upload';
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      }).then(res => res.json())
      .then(response => {
        this.setState({
          files: null,
          questions: response.Data.multipleChoiceQuestions,
          quiz: true
        })
      })
      .catch(error => {
        console.log(error)
      })
    } else {
      this.setState({
        inputValue: '',
        chats: [...this.state.chats, { type: 'user', id: uuidv4(), message: this.state.inputValue }],
      })
      // Testing purpose
      if (this.state.inputValue === 'tarzen') {
        setTimeout(() => {
          this.setState(prevState => ({
            chats: [...this.state.chats, { 
              type: 'choose',
              id: uuidv4(),
              message: 'Do you want to try out a quiz?',
              options: ['Yes', 'No'],
              clickCallback: this.handleOptionClick
            }],
          }))
        }, 1000)
      }
    }
  }

  handleOptionClick = (e, index) => {
    e.preventDefault()
    // selected true option
    if (index === 0) {
      this.setState({
        chats: [...this.state.chats, { type: 'bot', id: uuidv4(), message: 'Please attach image(s) and hit enter to create mock quiz.' }]
      })
    } else {
      this.setState({
        chats: [...this.state.chats, { type: 'bot', id: uuidv4(), message: 'What can I do for you other than creating a quiz?' }]
      })
    }
  }

  handleCallback = (files) => {
    this.setState({
      files: [...files]
    })
  }

  chat = ({type, ...rest}) => {
    switch (type) {
      case 'bot':
        return <BotMessage {...rest}/>
      case 'user':
        return <UserMessage {...rest} />
      case 'choose':
        return <Options {...rest} />
      default:
        return <BotMessage {...rest} />
    }
  }

  handleSubmitted = () => {
    this.setState({
      quiz: false
    })
  }

  render () {
    const { inputValue, chats, files, quiz, questions } = this.state;
    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit} className='rsc-container'>
          <div className='rsc-header'>
            <h2 className='rsc-header-title'>Companion</h2>
          </div>
          <div className='rsc-content'>
            {chats.map(this.chat)}
            {quiz && <Quiz onCompleted={this.handleSubmitted} questionsList={questions} />}
            {files && <ShowImages files={files} />}
          </div>
          <div className='rsc-footer'>
            <input
              type='textarea'
              className='rsc-input'
              placeholder='Type the message ...'
              value={inputValue}
              onChange={this.onValueChange}
            />
            <UploadImage uploadCallback={this.handleCallback} />
            <button onClick={this.handleSubmit} type="submit" className='rsc-submit-button'>
              <svg
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 500 500'>
                <g>
                  <g>
                    <polygon points='0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75'></polygon>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </form>
      </div>
    )
  }

}

export default App
