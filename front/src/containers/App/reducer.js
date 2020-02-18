import {
  CHANGE_USER,
  CHANGE_IS_AUTHENTICATED,
  CHANGE_IS_SIDE_BAR_ACTIVED,
  CHANGE_ANSWER,
  CHANGE_QUESTION,
  CHANGE_QUESTIONS,
  CHANGE_DOCUMENT,
  CHANGE_DOCUMENTS,
  CHANGE_LOGS
} from './actions'

export default function (state = {
  user: {},
  isAuthenticated: false,
  isSideBarActived: false,
  question: '',
  questions: [],
  document: '',
  documents: [],
  logs: []
}, action) {
  switch (action.type) {
    case CHANGE_USER:
      return { ...state, user: action.payload }
    case CHANGE_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload }
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
      return { ...state, question: action.payload }
    case CHANGE_QUESTIONS:
      return { ...state, questions: action.payload }
    case CHANGE_DOCUMENT:
      return { ...state, document: action.payload }
    case CHANGE_DOCUMENTS:
      return { ...state, documents: action.payload }
    case CHANGE_LOGS:
      return { ...state, logs: action.payload }
    default:
      return state
  }
}
