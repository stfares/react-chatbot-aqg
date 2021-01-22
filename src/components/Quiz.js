import React, { Component } from 'react';
import BotMessage from './BotMessage';
import Options from './Options';
import UserMessage from './UserMessage';
import { v4 as uuidv4 } from 'uuid';

class Quiz extends Component {
  state = {
    questions: [],
    answers: [],
    userAnswers: [],
    mcqs: [],
    bools: [],
    mcqCount: 1,
    boolCount: 0
  }

  componentDidMount () {
    const mcqs = this.props.questionsList.mcq
    const bools = this.props.questionsList.trueFalse[0].questionList
    
    const {Question, Options, Answer} = mcqs[0]
    this.setState({
      questions: [...this.state.questions, {
        type: 'choose',
        id: uuidv4(),
        message: Question,
        options: Options,
        clickCallback: this.handleOptionClick
      }],
      answers: [...this.state.answers, Answer],
      mcqs,
      bools
    })
  }

  handleOptionClick = (e, index, option) => {
    e.preventDefault()
    const userAnswers = [...this.state.userAnswers, option];
    this.setState({
      userAnswers
    });
    // show only 3 mcqs
    if(this.state.mcqCount <= 2) {
      const {Question, Options, Answer} = this.state.mcqs[this.state.mcqCount]
      this.setState({
        questions: [...this.state.questions, {
          type: 'choose',
          id: uuidv4(),
          message: Question,
          options: Options,
          clickCallback: this.handleOptionClick
        }],
        answers: [...this.state.answers, Answer],
        mcqCount: this.state.mcqCount + 1
      })
    } else if (this.state.boolCount <= 2) { // Show only 3 true/false questions
      const {question, answer} = this.state.bools[this.state.boolCount]
      this.setState({
        questions: [...this.state.questions, {
          type: 'choose',
          id: uuidv4(),
          message: question,
          options: ['True', 'False'],
          clickCallback: this.handleOptionClick
        }],
        answers: [...this.state.answers, answer],
        boolCount: this.state.boolCount + 1
      })
    } else {
      const total = this.state.answers.length
      let score = 0
      this.state.answers.forEach((ans, index) => {
        if (userAnswers[index] === ans) {
          score = score + 1
        }
      })
      this.setState({
        questions: [...this.state.questions, {
          type: 'bot',
          id: uuidv4(),
          message: `Your final score is ${score}/${total}`,
        }],
      })
      // this.props.onCompleted()
    }

  }

  question = ({type, ...rest}) => {
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

  render() {
    const {questions} = this.state
    return (
      <>
        {questions.length && questions.map(this.question)}
      </>
    );
  }
}

export default Quiz;