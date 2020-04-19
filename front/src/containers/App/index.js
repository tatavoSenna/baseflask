// Libs
import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'react-loading-overlay'
import { File } from 'react-feather'
import axios from 'axios';
import 'react-dialog/css/index.css'

// Styles
import './index.less'

// Containers or components
import Login from '../Login'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Question from '../../components/Question'

// Actions
import { changeIsAuthenticated, changeIsSideBarActived, changeAnswer, changeQuestion, selectDocument, fetchDocuments, fetchLogs, createDocument, finishWithoutDownload } from './actions'

// Constants
import { formatDate } from './constants'

class App extends Component {

  constructor(props) {
    super(props)
    this.createDocumentButtonPressed = this.createDocumentButtonPressed.bind(this)
    this.finishWithoutDownloadButtonPressed = this.finishWithoutDownloadButtonPressed.bind(this)
    axios.defaults.headers.common['X-Auth-Token'] = this.props.token
  }
  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, fetchDocuments, fetchLogs } = this.props
    const { isAuthenticated: nextIsAuthenticated } = nextProps

    if (!isAuthenticated && nextIsAuthenticated) {
      fetchDocuments()
      fetchLogs() 
    }
  }

  createDocumentButtonPressed(createDocument, document, questions, filename) {
    createDocument(document, questions, filename)
  }

  finishWithoutDownloadButtonPressed(finishWithoutDownload) {
    finishWithoutDownload()
  }

  render() {
    const {
      user,
      isAuthenticated,
      isSideBarActived,
      question,
      questions,
      document,
      documents,
      logs,
      changeIsAuthenticated,
      changeIsSideBarActived,
      changeAnswer,
      changeQuestion,
      selectDocument,
      createDocument,
      finishWithoutDownload,
      loading,
      isCreating,
      isViewing,
      fileURL,
      new_document_download_dialog_open
    } = this.props

    // TODO: temporary solution for filename not being send from server
    let filename = 'documento'

    if (document) {
      filename = documents.filter(item => document === item.id)[0]['filename']
    }

    return (
      <div>
        <LoadingOverlay
          active={loading}
          spinner
          text={<p style={{color: '#fff'}}>Aguarde enquanto geramos o contrato...</p>}
        >
          {isAuthenticated ?
            <div className="app">
              {new_document_download_dialog_open && 
              <div className="dialog__wrapper">
                <div className="dialog__overlay" />
                <div className="dialog__content">
                  Contrato Gerado com Sucesso!
                  <Button
                    children={'continuar'}
                    onClick={() => { console.log('cliqeui')
                    this.finishWithoutDownloadButtonPressed(finishWithoutDownload)
                    } }>
                  </Button>
                </div>
              </div>
              }
              <div className="app__wrapper">
                <Header
                  user={user}
                  isSideBarActived={isSideBarActived}
                  handleSideBar={() => changeIsSideBarActived(!isSideBarActived)}
                  handleLogout={() => changeIsAuthenticated(false)} />
                {isCreating &&
                  <Question
                    number={question + 1}
                    question={questions[question]}
                    handleNext={index => changeQuestion(index)}
                    handlePrevious={index => changeQuestion(index)}
                    handleChange={answer => changeAnswer(question, answer)}
                    handleCreate={() => this.createDocumentButtonPressed(createDocument, document, questions, filename)} />
                }
                {!isCreating &&
                  <div className="app__logs">
                    <h3>Documentos</h3>
                    {logs.map(({ id, name, filename, created_at }) => (
                      <div
                        key={id}
                        className="app__log">
                        <div>
                          <p>{name}</p>
                          <p>{formatDate(created_at, true)}</p>
                        </div>
                        <Button
                          children={'Recriar'}
                          onClick={() => { this.createDocumentButtonPressed(createDocument, document, questions, filename) }}>  
                        </Button>
                      </div>
                    ))}
                  </div>
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
      logs: state.app.logs,
      loading: state.app.loading,
      isCreating: state.app.isCreating,
      token: state.app.token,
      fileURL: state.app.fileURL,
      isViewing: state.app.isViewing,
      new_document_download_dialog_open: state.app.new_document_download_dialog_open 
    }
  },
  { changeIsAuthenticated, changeIsSideBarActived, changeAnswer, changeQuestion, selectDocument, fetchDocuments, fetchLogs, createDocument, finishWithoutDownload }
)(App)

export default App
