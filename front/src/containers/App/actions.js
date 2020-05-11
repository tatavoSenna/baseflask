// Libs
import axios from 'axios'
import _ from 'lodash'
import { OPEN_DIALOG } from '../../components/Dialog/actions'


// Actions Types
export const CHANGE_USER = 'change_user'
export const CHANGE_IS_AUTHENTICATED = 'change_is_authenticated'
export const CHANGE_IS_SIDE_BAR_ACTIVED = 'change_is_side_bar_actived'
export const CHANGE_ANSWER = 'change_answer'
export const CHANGE_QUESTION = 'change_question'
export const SHOW_NEW_DOCUMENT_FORM = 'show_new_document_form'

// document models list
export const GET_DOCUMENT_MODELS_CALL_SUCCEEDED = 'get_document_models_call_succeeded'
export const GET_DOCUMENT_MODELS_CALL_FAILED = 'get_document_models_call_failed'
export const GET_DOCUMENT_DOWNLOAD_URL = 'get_document_download_url'
export const REQUEST_DOCUMENT_SIGN = "request_document_sign"

//document list
export const LOAD_DOCUMENTS_LIST = 'load_documents_list'
export const GET_DOCUMENTS_LIST_CALL_SUCCEEDED = 'get_documents_list_call_succeeded'
export const GET_DOCUMENTS_LIST_CALL_FAILED = 'get_documents_list_call_failed'

// global loading indicator control
export const LOADING_FINISHED = "loading_finished"
export const LOADING_STARTED = "loading_started"

// new document actions
export const GET_DECISION_TREE_CALL_SUCCEEDED = "get_decision_tree_call_succeeded"
export const GET_DECISION_TREE_CALL_FAILED = "get_decision_tree_call_failed"
export const NEW_DOCUMENT_API_CALL = "new_document_api_call"  
export const NEW_DOCUMENT_CALL_FAILED = "new_document_call_failed"
export const NEW_DOCUMENT_CALL_SUCCEEDED = "new_document_call_succeeded"
export const CANCEL_NEW_DOCUMENT = "cancel_new_document"

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

export const newDocumentFromModel = (document_model) => {
  return {
    type: SHOW_NEW_DOCUMENT_FORM,
    payload: document_model
  }
}

export const fetchDocumentModels = () => {
  return dispatch => {
    axios.get('/models')
      .then(response => {
        const { data } = response
        if(!_.isEmpty(data)) {
          dispatch({
            type: GET_DOCUMENT_MODELS_CALL_SUCCEEDED,
            payload: data
          })
        }
      })
      .catch(e => {
        dispatch({
          type: GET_DOCUMENT_MODELS_CALL_FAILED,
          payload: e
        })
      })
  }
}

export const fetchDocuments = (page) => {
  return {
    type: LOAD_DOCUMENTS_LIST,
    payload: {page}
  }
}

export const createDocument = (document, questions, filename) => {
  return {
    type: NEW_DOCUMENT_API_CALL,
    payload: { document, questions } 
  }
}

export const cancelNewDocument = () => {
  return {
    type: CANCEL_NEW_DOCUMENT
  }
}

export const downloadDocument = (document_id) => {
  return {
    type: GET_DOCUMENT_DOWNLOAD_URL,
    payload: document_id
  }
}

export const signDocument = (document_id) => {
  return {
    type: OPEN_DIALOG,
    payload: {
      message: "Requerer assinatura do Documento ?",
      cancelLabel: "Cancelar",
      actionLabel: "Confirmar",
      actionData: {
        type: REQUEST_DOCUMENT_SIGN,
        payload: document_id
      }
    }
  }
}