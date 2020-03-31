// Libs
import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'react-loading-overlay';
import { File } from 'react-feather'
import _ from 'lodash'

// Styles
import './index.less'

// Containers or components
import Login from '../Login'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Question from '../../components/Question'

// Actions
import { changeIsAuthenticated, changeIsSideBarActived, changeAnswer, changeQuestion, selectDocument, fetchDocuments, fetchLogs, createDocument } from './actions'

// Constants
import { formatDate } from './constants'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.downloadFile = this.downloadFile.bind(this)

  }
  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, fetchDocuments, fetchLogs } = this.props
    const { isAuthenticated: nextIsAuthenticated } = nextProps

    if (!isAuthenticated && nextIsAuthenticated) {
      fetchDocuments()
      fetchLogs()
    }
  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }

  downloadFile(createDocument, document, questions, filename) {
    this.setState({
      loading: true
    })
    new Promise(async (resolve, reject) => {
      createDocument(document, questions, filename)
      setTimeout(() => resolve(), 2000);
    })
      .then(() => {
        this.setState({
          loading: false
        })
      });
  }

  render() {
    const { user, isAuthenticated, isSideBarActived, question, questions, document, documents, logs, changeIsAuthenticated, changeIsSideBarActived, changeAnswer, changeQuestion, selectDocument, createDocument } = this.props

    // TODO: temporary solution for filename not being send from server
    let filename = 'documento'

    let { loading } = this.state
    if (document) {
      filename = documents.filter(item => document === item.id)[0]['filename']
    }

    return (
      <div>
        <LoadingOverlay
          active={loading}
          spinner
          text='Aguarde enquanto geramos seu contrato...'
        >
          {isAuthenticated ?
            <div className="app">
              <div className="app__wrapper">
                <Header
                  user={user}
                  isSideBarActived={isSideBarActived}
                  handleSideBar={() => changeIsSideBarActived(!isSideBarActived)}
                  handleLogout={() => changeIsAuthenticated(false)} />
                {!_.isEmpty(questions) &&
                  <Question
                    number={question + 1}
                    question={questions[question]}
                    handleNext={index => changeQuestion(index)}
                    handlePrevious={index => changeQuestion(index)}
                    handleChange={answer => changeAnswer(question, answer)}
                    handleCreate={() => this.downloadFile(createDocument, document, questions, filename)} />
                }
              </div>
              <div className={
                isSideBarActived ?
                  "app__side-bar app__side-bar--active" :
                  "app__side-bar"
              }>
                <div className="app__documents">
                  <h3>Documentos</h3>
                  {documents.map(({ id, name }, idx) => (
                    <div
                      key={id}
                      className={id === document ? "app__document app__document--active" : "app__document"}
                      onClick={() => selectDocument(id)}>
                      <File size={20} />
                      <p key={id}>{name}</p>
                    </div>
                  ))}
                </div>
                <div className="app__logs">
                  <h3>Últimos Documentos</h3>
                  {logs.map(({ id, name, filename, created_at }) => (
                    <div
                      key={id}
                      className="app__log">
                      <div>
                        <p>{name}</p>
                        <p>{formatDate(created_at, true)}</p>
                      </div>
                      <Button
                        disabled={loading}
                        children={'Recriar'}
                        onClick={() => { this.downloadFile(createDocument, document, questions, filename) }}>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            :
            <Login>Login</Login>
          }
        </LoadingOverlay>
      </div>
    )
  }
}

App = connect(
  state => {
    return {
      user: state.app.user,
      isAuthenticated: state.app.isAuthenticated,
      isSideBarActived: state.app.isSideBarActived,
      question: state.app.question,
      questions: state.app.questions,
      document: state.app.document,
      documents: state.app.documents,
      logs: state.app.logs
    }
  },
  { changeIsAuthenticated, changeIsSideBarActived, changeAnswer, changeQuestion, selectDocument, fetchDocuments, fetchLogs, createDocument }
)(App)

export default App
