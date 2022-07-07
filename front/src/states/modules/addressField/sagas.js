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

function* getAddressInfoSaga({ payload }) {
	try {
		const { data } = yield call(api.get, `/ws/${payload}/json`)

		yield put(getAddressInfoSuccess(data))
	} catch (error) {
		yield put(getAddressInfoFailure(error))
		errorMessage({
			content: `Não foi encontrado informações de endereço de acordo com o cep digitado`,
		})
	}
}
