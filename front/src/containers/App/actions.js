// Libs
import axios from 'axios'
import _ from 'lodash'
import fileDownload from 'js-file-download'

// Constants
import { findChildren } from './constants'

// Actions Types
export const CHANGE_USER = 'change_user'
export const CHANGE_IS_AUTHENTICATED = 'change_is_authenticated'
export const CHANGE_IS_SIDE_BAR_ACTIVED = 'change_is_side_bar_actived'
export const CHANGE_ANSWER = 'change_answer'
export const CHANGE_QUESTION = 'change_question'
export const SHOW_NEW_DOCUMENT_FORM = 'show_new_document_form'
export const CHANGE_DOCUMENTS = 'change_documents'
export const CHANGE_LOGS = 'change_logs'
export const NEW_DOCUMENT_API_CALL = "new_document_api_call"  
export const NEW_DOCUMENT_CALL_FAILED = "new_document_call_failed"
export const NEW_DOCUMENT_CALL_SUCCEEDED = "new_document_call_succeeded"
export const LOADING_FINISHED = "loading_finished"
export const LOADING_STARTED = "loading_started"
export const GET_DECISION_TREE_CALL_SUCCEEDED = "get_decision_tree_call_succeeded"
export const GET_DECISION_TREE_CALL_FAILED = "get_decision_tree_call_failed"
export const NEW_DOCUMENT_FINISH_WITHOUT_DOWNLOAD = "new_document_finish_without_download"

export const changeUser = (user) => {
  return {
    type: CHANGE_USER,
    payload: user
  }
}

export const changeIsAuthenticated = (isAuthenticated, token) => {
  return {
    type: CHANGE_IS_AUTHENTICATED,
    payload: { isAuthenticated, token }
  }
}

export const changeIsSideBarActived = (isSideBarActived) => {
  return {
    type: CHANGE_IS_SIDE_BAR_ACTIVED,
    payload: isSideBarActived
  }
}

export const changeAnswer = (question, answer) => {
  return {
    type: CHANGE_ANSWER,
    payload: {question, answer}
  }
}


export const changeQuestion = (question) => {
  return {
    type: CHANGE_QUESTION,
    payload: question
  }
}

export const changeDocuments = (documents) => {
  return {
    type: CHANGE_DOCUMENTS,
    payload: documents
  }
}

export const changeLogs = (logs) => {
  return {
    type: CHANGE_LOGS,
    payload: logs
  }
}

export const selectDocument = (document, filename) => {
  return {
    type: SHOW_NEW_DOCUMENT_FORM,
    payload: {document, filename}
  }
}

export const fetchDocuments = () => {
  return dispatch => {
    axios.get('/documents')
      .then(response => {
        const { data } = response

        if(!_.isEmpty(data)) {
          dispatch(changeDocuments(data))
        }
      })
      .catch(e => {
        console.log(e)
      })
  }
}

export const fetchLogs = () => {
  return dispatch => {
    axios.get('/logs')
      .then(response => {
        const { data } = response

        if(!_.isEmpty(data)) {
          dispatch(changeLogs(data))
        }
      })
      .catch(e => {
        console.log(e)
      })
  }
}

export const createDocument = (document, questions, filename) => {
  return {
    type: NEW_DOCUMENT_API_CALL,
    payload: { document, questions } 
  }
}

export const finishWithoutDownload = () => {
  console.log ( 'uai' )
  return {
    type: NEW_DOCUMENT_FINISH_WITHOUT_DOWNLOAD,
    payload: false
  }
}
