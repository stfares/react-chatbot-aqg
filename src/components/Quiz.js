import React, { Component } from 'react';
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
      answers: [...this.state.answers, Answer],
      mcqs,
      bools
    })
    this.props.onAdd({
      type: 'choose',
      id: uuidv4(),
      message: Question,
      options: Options,
      clickCallback: this.handleOptionClick
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
        answers: [...this.state.answers, Answer],
        mcqCount: this.state.mcqCount + 1
      })
      this.props.onAdd({
        type: 'choose',
        id: uuidv4(),
        message: Question,
        options: Options,
        clickCallback: this.handleOptionClick
      })
    } else if (this.state.boolCount <= 2) { // Show only 3 true/false questions
      const {question, answer} = this.state.bools[this.state.boolCount]
      this.setState({
        answers: [...this.state.answers, answer],
        boolCount: this.state.boolCount + 1
      })
      this.props.onAdd({
        type: 'choose',
        id: uuidv4(),
        message: question,
        options: ['True', 'False'],
        clickCallback: this.handleOptionClick
      })
    } else {
      const total = this.state.answers.length
      let score = 0
      this.state.answers.forEach((ans, index) => {
        if (userAnswers[index] === ans) {
          score = score + 1
        }
      })
      this.props.onAdd({
        type: 'bot',
        id: uuidv4(),
        message: `Your final score is ${score}/${total}`,
      })
      // this.props.onCompleted()
    }

  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default Quiz;