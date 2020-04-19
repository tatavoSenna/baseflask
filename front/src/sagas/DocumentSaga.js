import axios from 'axios'
import fileDownload from 'js-file-download'
import { put, takeLatest } from 'redux-saga/effects'

import {
    LOADING_STARTED,
    LOADING_FINISHED,
    NEW_DOCUMENT_API_CALL,
    NEW_DOCUMENT_CALL_SUCCEEDED,
    NEW_DOCUMENT_CALL_FAILED,
    SHOW_NEW_DOCUMENT_FORM,
    GET_DECISION_TREE_CALL_SUCCEEDED,
    GET_DECISION_TREE_CALL_FAILED,
    CHANGE_QUESTION
} from '../containers/App/actions'

function* sendNewDocumentToServer(action) {

    yield put({type: LOADING_STARTED})
    try {
        const { payload } = action
        const new_document =  yield axios.post('/create', payload)
        const fileURL = new_document.data
        yield put({type: NEW_DOCUMENT_CALL_SUCCEEDED, payload: { fileURL}});
        const filename = 'test.docx'
        const response = yield axios.get(fileURL, { responseType: 'arraybuffer' })
        const { data } = response
        fileDownload(data, `${filename}.docx`)
    } catch (e) {
        yield put({type: NEW_DOCUMENT_CALL_FAILED, message: e.message});
   }
   
   yield put({type: LOADING_FINISHED})
}

function* loadNewDocumentTemplateFromServer(action){
    const { document } = action.payload
    yield put({type: LOADING_STARTED})

    try {
        const decision_tree = yield axios.get(`/questions?document=${document}`)
        yield put({type: GET_DECISION_TREE_CALL_SUCCEEDED, payload: { data: decision_tree.data, document }});
    } catch (e) {
        yield put({type: GET_DECISION_TREE_CALL_FAILED, message: e.message});
    }
    yield put({type: LOADING_FINISHED})
}

function* documentSaga() {
  yield takeLatest(NEW_DOCUMENT_API_CALL, sendNewDocumentToServer);
  yield takeLatest(SHOW_NEW_DOCUMENT_FORM, loadNewDocumentTemplateFromServer);
}

export default documentSaga;