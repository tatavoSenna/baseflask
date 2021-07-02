import { extend } from 'lodash'

export const selectAnswer = (data, payload) => {
	const answers = {}
	Object.entries(payload).forEach((answer) => {
		//This rearranges the Structured Checkbox variables, where all detail variables from a selected option are grouped on an object
		if (answer[0].slice(0, 16) === 'structured_checkbox') {
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
		} else {
			answers[answer[0]] = answer[1]
		}
	})
	return extend(data, answers)
}

export const selectImages = (dataImg, payload) => {
	for (var [key] of Object.entries(payload)) {
		if (key.includes('image_')) {
			const image = document
				.getElementById(key)
				.getElementsByTagName('input')[0].value

			extend(dataImg, { [key]: image })
		}
	}
	return dataImg
}
