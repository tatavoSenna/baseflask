import { extend } from 'lodash'
import moment from 'moment'

export const selectAnswer = (data, payload) => {
	const answers = {}

	const visible = payload.visible
	const fields = payload.pageFieldsData.fields

	Object.entries(payload.data).forEach((answer) => {
		var index
		if (
			answer[0].slice(0, 15) === 'structured_list' ||
			answer[0].slice(0, 19) === 'structured_checkbox'
		) {
			index = Number(answer[0].split('_').slice(-1))
		} else if (answer[0].slice(0, 6) === 'image_') {
			index = fields.findIndex((f) => 'image_' + f.variable.name === answer[0])
		} else {
			index = fields.findIndex((f) => f?.variable?.name === answer[0])
		}

		if (visible[index]) {
			//This rearranges the Structured Checkbox variables, where all detail variables from a selected option are grouped on an object
			if (answer[0].slice(0, 19) === 'structured_checkbox') {
				const items = []
				Object.entries(answer[1]).forEach((variable) => {
					if (Array.isArray(variable[1])) {
						variable[1].forEach((option) => {
							const optionObj = { OPTION: option }
							Object.entries(answer[1]).forEach((optionDetail) => {
								if (optionDetail[0].split('_').slice(-1)[0] === option) {
									const newName = optionDetail[0].split('_')
									newName.pop()
									optionObj[newName.join('_')] = optionDetail[1]
								}
							})
							items.push(optionObj)
						})
					}
				})
				answers[answer[0]] = items
			} else if (fields[index]?.variable?.type === 'date') {
				answers[answer[0]] = moment.isMoment(answer[1])
					? answer[1].format('YYYY-MM-DD')
					: ''
			} else if (fields[index]?.variable?.type === 'time') {
				answers[answer[0]] = moment.isMoment(answer[1])
					? answer[1].format('HH:mm')
					: ''
			} else {
				answers[answer[0]] = answer[1]
			}
		}
	})
	return filterEmptyValues(extend(data, answers))
}

// Creates a new data object, filtering empty values recursively
const filterEmptyValues = (data) => {
	let filteredData = {}

	const isEmptyValue = (v) =>
		v === '' || v === undefined || v === null || v?.length === 0

	const isObject = (v) =>
		typeof v === 'object' && Object.getPrototypeOf(v).isPrototypeOf(Object)

	for (const key in data) {
		if (!isEmptyValue(data[key])) {
			let value = data[key]

			if (isObject(value)) {
				value = filterEmptyValues(value)
				if (Object.keys(value).length === 0) continue
			}

			filteredData[key] = value
		}
	}

	return filteredData
}
