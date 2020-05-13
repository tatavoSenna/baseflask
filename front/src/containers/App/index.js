// Libs
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import { File, FileText } from "react-feather";
import axios from "axios";


// Styles
import "./index.less";

// Containers or components
import Login from "../Login";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Question from "../../components/Question";
import Dialog from "../../components/Dialog"
import React, { Component } from "react";

// Actions
import {
  changeIsAuthenticated,
  changeIsSideBarActived,
  changeAnswer,
  changeQuestion,
  newDocumentFromModel,
  fetchDocumentModels,
  fetchDocuments,
  createDocument,
  cancelNewDocument,
  downloadDocument,
  signDocument
} from "./actions";

// Constants
import { formatDate } from "./constants";

class App extends Component {
  constructor(props) {
    super(props);
    axios.defaults.headers.common["X-Auth-Token"] = this.props.token;
  }
  componentDidMount(nextProps) {
    const { fetchDocumentModels, fetchDocuments, logs } = this.props;
    console.log('logs')
    if (!logs.dataUpToDate) {
      fetchDocumentModels();
      fetchDocuments(1);
    }
  }

  createDocumentButtonPressed(createDocument, document, questions, filename) {
    createDocument(document, questions, filename);
  }

  cancelNewDocumentButtonPressed(cancelNewDocument) {
    cancelNewDocument();
  }

  render() {
    const {
      user,
      isAuthenticated,
      isSideBarActived,
      question,
      questions,
      document,
      models,
      logs,
      changeIsAuthenticated,
      changeIsSideBarActived,
      changeAnswer,
      changeQuestion,
      newDocumentFromModel,
      createDocument,
      loading,
      isCreating,
      cancelNewDocument,
      downloadDocument,
      signDocument,
      fetchDocuments
    } = this.props;

    // TODO: temporary solution for filename not being send from server
    let filename = "documento";

    var pages = [];
    for (let index = 1; index < logs.total / logs.per_page; index++) {
      pages.push(index)
    }
    return (
      <div>
        <LoadingOverlay
          active={loading}
          spinner
          text={
            <p style={{ color: "#fff" }}>
              Aguarde enquanto geramos o contrato...
            </p>
          }
        >
          {isAuthenticated ? (
            <div className="app">
              <Dialog/>
              <div className="app__wrapper">
                <Header
                  user={user}
                  isSideBarActived={isSideBarActived}
                  handleSideBar={() =>
                    changeIsSideBarActived(!isSideBarActived)
                  }
                  handleLogout={() => changeIsAuthenticated(false)}
                />
                {isCreating && (
                  <Question
                    number={question + 1}
                    question={questions[question]}
                    handleNext={(index) => changeQuestion(index)}
                    handlePrevious={(index) => changeQuestion(index)}
                    handleChange={(answer) => changeAnswer(question, answer)}
                    handleCreate={() =>
                      this.createDocumentButtonPressed(
                        createDocument,
                        document,
                        questions,
                        filename
                      )
                    }
                    handleCancel={() =>
                      this.cancelNewDocumentButtonPressed(cancelNewDocument)
                    }
                  />
                )}
                {!isCreating && (
                  <div className="app__logs">
                    <h3>Documentos</h3>
                    <div className="app__log">
                      <div/>
                      <div>
                        <p>Título</p>
                      </div>
                      <div>
                        <p>Criado por</p>
                      </div>
                      <div>
                        <p>Data de Criação</p>
                      </div>
                      <div>
                        <p>Ações</p>
                      </div>
                    </div>
                    {logs.items.map(({ id, title, user, created_at, envelope }) => (
                      <div key={id} className="app__log">
                        <div>
                          <FileText/>
                        </div>
                        <div>
                          <p>{title}</p>
                        </div>
                        <div>
                          <p>{user.name + user.surname}</p>
                        </div>
                        <div>
                          <p>{formatDate(created_at, false)}</p>
                        </div>
                        <div>
                          <Button
                            children={"Download"}
                            onClick={() => { downloadDocument(id) }}
                          ></Button>
                          <Button
                            disabled={envelope !== null && envelope.status === 'sent'}
                            children={"Assinar"}
                            onClick={() => { signDocument(id) }}
                          ></Button>
                        </div>
                      </div>
                    ))}
                    <div className="app__logs__pagination__wrapper">
                      <div className="app_logs_pages_buttons">
                        {pages.map((pageNumber) => (
                          <a key={pageNumber} onClick={() => {
                            fetchDocuments(pageNumber)
                          }}> {pageNumber == 1 ? pageNumber : '| ' + pageNumber + ' '} </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={
                  isSideBarActived
                    ? "app__side-bar app__side-bar--active"
                    : "app__side-bar"
                }
              >
                <div className="app__documents">
                  <h3>Selecione um modelo</h3>
                  {models.map(({ id, name }, idx) => (
                    <div
                      key={id}
                      className={
                        id === document
                          ? "app__document app__document--active"
                          : "app__document"
                      }
                      onClick={() => newDocumentFromModel(id)}
                    >
                      <File size={20} />
                      <p key={id}>{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Login>Login</Login>
          )}
        </LoadingOverlay>
      </div>
    );
  }
}

App = connect(
  (state) => {
    return {
      user: state.app.user,
      isAuthenticated: state.app.isAuthenticated,
      isSideBarActived: state.app.isSideBarActived,
      question: state.app.question,
      questions: state.app.questions,
      document: state.app.document,
      models: state.app.models,
      logs: state.app.logs,
      loading: state.app.loading,
      isCreating: state.app.isCreating,
      token: state.app.token
    };
  },
  {
    changeIsAuthenticated,
    changeIsSideBarActived,
    changeAnswer,
    changeQuestion,
    newDocumentFromModel,
    fetchDocumentModels,
    fetchDocuments,
    createDocument,
    cancelNewDocument,
    downloadDocument,
    signDocument
  }
)(App);

export default App;
