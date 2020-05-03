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
    GET_DOCUMENT_DOWNLOAD_URL,
    REQUEST_DOCUMENT_SIGN
} from '../containers/App/actions'
import {
        OPEN_DIALOG,
        CLOSE_DIALOG,
        CLOSE_DIALOG_WITH_ACTION
    } from '../components/Dialog/actions'

function* sendNewDocumentToServer(action) {

    yield put({type: LOADING_STARTED})
    try {
        const { payload } = action;
        const new_document =  yield axios.post('/create', payload);
        const document_id = new_document.data.id;
        yield put({type: NEW_DOCUMENT_CALL_SUCCEEDED});
        yield put ({type: OPEN_DIALOG, payload:{
            message: "Arquivo Gerado com Sucesso",
            cancelLabel: "Continuar",
            actionData: {type: GET_DOCUMENT_DOWNLOAD_URL, payload: document_id },
            actionLabel: "Download"
        }})
    } catch (e) {
        yield put({type: NEW_DOCUMENT_CALL_FAILED, message: e.message});
   }
   
   yield put({type: LOADING_FINISHED})
}

function* loadNewDocumentTemplateFromServer(action){
    const document = action.payload
    yield put({type: LOADING_STARTED})

    try {
        const decision_tree = yield axios.get(`/questions?document=${document}`)
        yield put({type: GET_DECISION_TREE_CALL_SUCCEEDED, payload: { data: decision_tree.data, document }});
    } catch (e) {
        yield put({type: GET_DECISION_TREE_CALL_FAILED, message: e.message});
    }
    yield put({type: LOADING_FINISHED})
}

function* downloadDocument(action){
    yield put({type: LOADING_STARTED})
    const document_id = action.payload
            try {
        const url_response = yield axios.get(`/documents/${document_id}/download`)
        const document_url = url_response.data
        const file_data_response = yield axios.get(document_url, { responseType: 'arraybuffer' })
        const {data} = file_data_response   
        fileDownload(data, `${document_id}.docx`)
    }
    catch (e) {
        yield put({
            type: OPEN_DIALOG,
            payload: {
                message: "Houve um problema na comunicação com o Servidor. Por Favor tente mais tarde",
                cancelLabel: "Continuar",
                actionData: false,
            }
        })
        console.log(e)
    }
    yield put({type: LOADING_FINISHED})
}

function* signDocument(action){
    yield put({type: LOADING_STARTED})
    const document_id = action.payload
    try {
        yield axios.get(`/documents/${document_id}/sign`)
        yield put({
            type: OPEN_DIALOG,
            payload: {
                message: "Processo de assintura iniciado via docusign",
                cancelLabel: "Continuar",
                actionData: false,
            }
        })
    }
    catch (e) {
        yield put({
            type: OPEN_DIALOG,
            payload: {
                message: "Houve um problema na comunicação com o Docusign.\n Por Favor tente mais tarde",
                cancelLabel: "Continuar",
                actionData: false,
            }
        })
        console.log(e)
    }
    yield put({type: LOADING_FINISHED})
}

function* dialogAction(action) {
    console.log(action.payload)
    const actionData = action.payload
    yield put({type: CLOSE_DIALOG})
    yield put(actionData)
}

function* documentSaga() {
    yield takeLatest(NEW_DOCUMENT_API_CALL, sendNewDocumentToServer);
    yield takeLatest(SHOW_NEW_DOCUMENT_FORM, loadNewDocumentTemplateFromServer);
    yield takeLatest(GET_DOCUMENT_DOWNLOAD_URL, downloadDocument);
    yield takeLatest(REQUEST_DOCUMENT_SIGN, signDocument);
    yield takeLatest(CLOSE_DIALOG_WITH_ACTION, dialogAction);
}

export default documentSaga;