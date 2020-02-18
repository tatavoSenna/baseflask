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
export const CHANGE_QUESTIONS = 'change_questions'
export const CHANGE_DOCUMENT = 'change_document'
export const CHANGE_DOCUMENTS = 'change_documents'
export const CHANGE_LOGS = 'change_logs'

export const changeUser = (user) => {
  return {
    type: CHANGE_USER,
    payload: user
  }
}

export const changeIsAuthenticated = (isAuthenticated) => {
  return {
    type: CHANGE_IS_AUTHENTICATED,
    payload: isAuthenticated
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

export const changeQuestions = (questions) => {
  return {
    type: CHANGE_QUESTIONS,
    payload: questions
  }
}

export const changeDocument = (document) => {
  return {
    type: CHANGE_DOCUMENT,
    payload: document
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
  return dispatch => {
    dispatch(changeQuestion(0))
    dispatch(changeDocument(document))
    dispatch(fetchQuestions(document))
  }
}

export const fetchDocuments = () => {
  return dispatch => {
    axios.get('/documents')
      .then(response => {
        const { data } = response

        if(!_.isEmpty(data)) {
          dispatch(changeDocuments(data))
          dispatch(selectDocument(data[0].id))
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

export const fetchQuestions = (document) => {
  return dispatch => {
    axios.get(`/questions?document=${document}`)
    .then(response => {
      const { data } = response
      let questions = []

      data.map((item, idx) => {
        questions = [...questions, {...item, children: findChildren(data, idx)}]

        return item
      })

      dispatch(changeQuestions(questions))
    })
    .catch(e => {
      console.log(e)
    })
  }
}

export const createDocument = (document, questions, filename) => {
  return dispatch => {
    axios.post('/create', { document, questions }, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const { data } = response

      fileDownload(data, `${filename}.docx`)

      dispatch(fetchLogs())
    })
    .catch(e => {
      console.log(e)
    })
  }
}
