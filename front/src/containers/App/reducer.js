import {
  CHANGE_USER,
  CHANGE_IS_AUTHENTICATED,
  CHANGE_IS_SIDE_BAR_ACTIVED,
  CHANGE_ANSWER,
  CHANGE_QUESTION,
  GET_DECISION_TREE_CALL_SUCCEEDED,
  CHANGE_DOCUMENTS,
  CHANGE_LOGS,
  LOADING_STARTED,
  LOADING_FINISHED,
  NEW_DOCUMENT_CALL_SUCCEEDED,
  NEW_DOCUMENT_FINISH_WITHOUT_DOWNLOAD
} from './actions'

import { findChildren } from './constants'

export default function (state = {
  user: {},
  isAuthenticated: false,
  isSideBarActived: false,
  question: '',
  questions: [],
  document: '',
  documents: [],
  logs: [],
  loading: false,
  isCreating: false,
  isViewing: false,
  fileURL: null,
  new_document_download_dialog_open: false
}, action) {
  switch (action.type) {
    case CHANGE_USER:
      return { ...state, user: action.payload }
    case CHANGE_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload.isAuthenticated, token: action.payload.token }
    case CHANGE_IS_SIDE_BAR_ACTIVED:
      return { ...state, isSideBarActived: action.payload }
    case CHANGE_ANSWER:
      const { question, answer } = action.payload
      return { ...state,
        questions: state.questions.map((item, idx) => (
          idx === question ? {...item, answer: answer} : item
        ))
      }
    case CHANGE_QUESTION:
      return { ...state, question: action.payload}
    case GET_DECISION_TREE_CALL_SUCCEEDED:
      const { data, document } = action.payload
      let questions = []
      data.map((item, idx) => {
        questions = [...questions, {...item, children: findChildren(data, idx)}]
        return item
      })
      return { ...state, questions, question: 0, document, isCreating: true, }
    case CHANGE_DOCUMENTS:
      return { ...state, documents: action.payload }
    case CHANGE_LOGS:
      return { ...state, logs: action.payload }
    case LOADING_STARTED:
      return {...state, loading: true}
    case LOADING_FINISHED:
      return { ...state, loading: false}
    case NEW_DOCUMENT_CALL_SUCCEEDED:
      const { fileURL } = action.payload
      return {...state, fileURL, isCreating:false, new_document_download_dialog_open: true }
    case NEW_DOCUMENT_FINISH_WITHOUT_DOWNLOAD:
      console.log('reduce')
      return {...state, new_document_download_dialog_open:action.payload}
    default:
      return state
  }
}
