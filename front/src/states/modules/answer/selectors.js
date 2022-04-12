import { extend } from 'lodash'

export const selectAnswer = (data, payload) => {
	const answers = {}

	// Remove the non variable items from the visible array, to keep it in sync with the variables
	const variableItems = payload.pageFieldsData.fields.map(
		(item) => item['type'] !== 'separator' // separators have no variables.
	)

	const itemsWithVariables = (_, index) => variableItems[index]
	const visible = payload.visible.filter(itemsWithVariables)
	const fields = payload.pageFieldsData.fields.filter(itemsWithVariables)

	Object.entries(payload.data).forEach((answer, index) => {
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
			}
			// Convert date variables from moment objects to text to keep local timezone offsets
			else if (fields[index]?.variable?.type === 'date') {
				answers[answer[0]] = answer[1].format()
			} else {
				answers[answer[0]] = answer[1]
			}
		}
	})
	return extend(data, answers)
}

export const selectImages = (dataImg, payload) => {
	let index = 0
	for (var [key] of Object.entries(payload.data)) {
		if (payload.visible[index]) {
			if (key.includes('image_')) {
				const image = document
					.getElementById(key)
					.getElementsByTagName('input')[0].value

				extend(dataImg, { [key]: image })
			}
		}
		index++
	}
	return dataImg
}
