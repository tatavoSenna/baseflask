import {
  CHANGE_USER,
  CHANGE_IS_AUTHENTICATED,
  CHANGE_IS_SIDE_BAR_ACTIVED,
  CHANGE_ANSWER,
  CHANGE_QUESTION,
  GET_DECISION_TREE_CALL_SUCCEEDED,
  LOADING_STARTED,
  LOADING_FINISHED,
  NEW_DOCUMENT_CALL_SUCCEEDED,
  GET_DOCUMENT_MODELS_CALL_SUCCEEDED,
  GET_DOCUMENTS_LIST_CALL_SUCCEEDED,
  CANCEL_NEW_DOCUMENT,
} from './actions'

import { findChildren } from './constants'

export default function (state = {
  user: {},
  isAuthenticated: false,
  isSideBarActived: false,
  question: '',
  questions: [],
  document: '',
  models: [],
  logs: {
    items: [],
    dataUpToDate: false,
    lastUpdate: null
  },
  loading: false,
  isCreating: false
}, action) {
  switch (action.type) {
    case CHANGE_USER:
      return { ...state, user: action.payload }
    case CHANGE_IS_AUTHENTICATED:
      const { isAuthenticated, token } = action.payload
      return {
        ...state,
        isAuthenticated,
        token,
        logs: {
          items: [],
          dataUpToDate: false,
          lastUpdate: null
        }
       }
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
    case GET_DOCUMENT_MODELS_CALL_SUCCEEDED:
      return { ...state, models: action.payload }
    case GET_DOCUMENTS_LIST_CALL_SUCCEEDED:
      const newLogs = action.payload
      return { ...state, logs: { ...newLogs, dataUpToDate: true, lastUpdate: Date.now() } }
    case LOADING_STARTED:
      return {...state, loading: true}
    case LOADING_FINISHED:
      return { ...state, loading: false}
    case NEW_DOCUMENT_CALL_SUCCEEDED:
      return {...state, isCreating:false}
    case CANCEL_NEW_DOCUMENT:
      return {...state, isCreating: false}
    default:
      return state
  }
}
