import { message } from 'antd'

export function successMessage(payload) {
	message.success(formatParams(payload))
}

export function errorMessage(payload) {
	message.error(formatParams(payload))
}

export function loadingMessage(payload) {
	message.loading(formatParams({ ...payload, duration: 0 }))
}

export function infoMessage(payload) {
	message.info(formatParams(payload))
}

export function warningMessage(payload) {
	message.warning(formatParams(payload))
}

export function customMessage(payload) {
	message.open({
		type: payload.type,
		content: payload.content,
		duration: payload.duration,
		icon: payload.icon,
		key: payload.key,
		className: payload.className,
		style: payload.style,
		onClose: payload.onClose,
	})
}

function formatParams(payload) {
	if (typeof payload === 'string') {
		return payload
	} else {
		const { content, onClose, updateKey, duration } = payload
		return { content, onClose, key: updateKey, duration }
	}
}
