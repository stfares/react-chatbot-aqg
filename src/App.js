import React, {Component} from 'react'
import BotMessage from './components/BotMessage'
import Options from './components/Options'
import ShowImages from './components/ShowImages'
import UserMessage from './components/UserMessage'
import UploadImage from './components/UploadImage'
import Quiz from './components/Quiz'
import ChatIcon from './components/ChatIcon'
import FloatButton from './components/FloatButton'
import CloseIcon from './components/CloseIcon'
import ChatContainer from './components/ChatContainer'
import Badge from './components/Badge'
import LoadingIndicator from './components/LoadingIndicator'
import {v4 as uuidv4} from 'uuid'

import './App.css'
const API_URL = 'http://localhost:5000'

class App extends Component {
  state = {
    inputValue: '',
    src: '',
    quiz: false,
    files: null,
    questions: [],
    floating: true,
    opened: false,
    loading: false,
    chats: [
      {
        type: 'bot',
        id: uuidv4(),
        message: 'Yeah!! Your exam is scheduled next week',
      },
    ],
  }

  content = React.createRef()

  onValueChange = ({target}) => {
    this.setState({
      inputValue: target.value,
    })
  }

  getIntent = (query) => {
    const url = `${API_URL}/intent?question=${query}`
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        if (response.entity) {
          this.setState((prevState) => ({
            chats: [
              ...this.state.chats,
              {
                type: 'choose',
                id: uuidv4(),
                message: response.fulfillmentText,
                options: ['Yes', 'No'],
                clickCallback: this.handleOptionClick,
              },
            ],
          }))
        } else {
          this.setState({
            chats: [
              ...this.state.chats,
              {type: 'bot', id: uuidv4(), message: response.fulfillmentText},
            ],
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.files && this.state.files.length) {
      this.setState({loading: true})
      const formData = new FormData()
      formData.append('image', this.state.files[0])

      const url = `${API_URL}/upload`
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            files: null,
            questions: response.Data.multipleChoiceQuestions,
            quiz: true,
            loading: false
          })
        })
        .catch((error) => {
          this.setState({
            loading: false,
            files: null
          })
          console.log(error)
        })
    } else {
      if (!this.state.inputValue) return
      this.setState({
        inputValue: '',
        chats: [
          ...this.state.chats,
          {type: 'user', id: uuidv4(), message: this.state.inputValue},
        ],
      })
      this.getIntent(this.state.inputValue)
    }
  }

  handleOptionClick = (e, index) => {
    e.preventDefault()
    // selected true option
    if (index === 0) {
      this.setState({
        chats: [
          ...this.state.chats,
          {
            type: 'bot',
            id: uuidv4(),
            message:
              'Please attach image(s) of material you want to create quiz from.',
          },
        ],
      })
    } else {
      this.setState({
        chats: [
          ...this.state.chats,
          {
            type: 'bot',
            id: uuidv4(),
            message: 'What can I do for you other than creating a quiz?',
          },
        ],
      })
    }
  }

  handleCallback = (files) => {
    this.setState({
      files: [...files],
    })
  }

  chat = ({type, ...rest}) => {
    switch (type) {
      case 'bot':
        return <BotMessage {...rest} />
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
      quiz: false,
    })
  }

  handleAdd = (add) => {
    this.setState({
      chats: [...this.state.chats, add],
    })
  }

  toggleChatBot = (opened) => {
    this.setState({opened})
  }

  render() {
    const {
      inputValue,
      chats,
      files,
      quiz,
      questions,
      floating,
      opened,
      loading
    } = this.state
    const floatingStyle = {
      right: '32px',
      transformOrigin: 'bottom left',
    }
    return (
      <div className='App'>
        {floating && (
          <FloatButton
            className='rsc-float-button'
            style={floatingStyle}
            opened={opened}
            onClick={() => this.toggleChatBot(true)}>
            <Badge>1</Badge>
            <ChatIcon></ChatIcon>
          </FloatButton>
        )}
        {this.state.opened && (
          <ChatContainer
            onSubmit={this.handleSubmit}
            height='800px'
            width='600px'
            opened={opened}
            floating={floating}
            floatingStyle={floatingStyle}>
            <div className='rsc-header'>
              <h2 className='rsc-header-title'>Sarcastic Companion</h2>
              {floating && (
                <div
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    this.toggleChatBot(false)
                  }}>
                  <CloseIcon />
                </div>
              )}
            </div>
            <div className='rsc-content' ref={this.content}>
              {chats.map(this.chat)}
              {quiz && (
                <Quiz
                  onCompleted={this.handleSubmitted}
                  onAdd={this.handleAdd}
                  questionsList={questions}
                />
              )}
              {files && <ShowImages files={files} />}
              {loading && <LoadingIndicator />}
            </div>
            <div className='rsc-footer'>
              <input
                type='textarea'
                className='rsc-input'
                placeholder='Ask Something ...'
                value={inputValue}
                onChange={this.onValueChange}
              />
              <UploadImage uploadCallback={this.handleCallback} />
              <button
                onClick={this.handleSubmit}
                type='submit'
                className='rsc-submit-button'>
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
          </ChatContainer>
        )}
      </div>
    )
  }
}

export default App
