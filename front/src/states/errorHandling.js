import { errorMessage } from '~/services/messager'

export default function onlineChecking(updateKey) {
	const online = window.navigator.onLine

	if (!online) {
		errorMessage({
			content:
				'Não conseguimos contato com nossos servidores. O dispositivo está conectado?',
			updateKey: updateKey,
		})
	} else {
		errorMessage({
			content:
				'Ooops, ccorreu um erro. Já avisamos nossos engenheiros, por favor tente mais tarde.',
			updateKey: updateKey,
		})
	}
}
