import Axios from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import { errorMessage } from 'services/messager'
import { getAddressInfo, getAddressInfoFailure, getAddressInfoSuccess } from '.'

const api = Axios.create({
	baseURL: `https://viacep.com.br`,
})

export default function* rootSaga() {
	yield takeEvery(getAddressInfo, getAddressInfoSaga)
}

function* getAddressInfoSaga({ payload: keyCep }) {
	try {
		const { data } = yield call(api.get, `/ws/${keyCep}/json`)

		if (data.erro) {
			throw data.erro
		}

		yield put(getAddressInfoSuccess({ data, keyCep }))
	} catch (error) {
		yield put(getAddressInfoFailure({ error, keyCep }))
		errorMessage({
			content: `Não foi encontrado informações de endereço de acordo com o cep digitado`,
		})
	}
}
