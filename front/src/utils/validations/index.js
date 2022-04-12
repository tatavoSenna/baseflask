import moment from 'moment'

export const validateCPF = (cpf) => {
	cpf = cpf.replace(/[^\d]+/g, '')
	if (
		!cpf ||
		cpf.length !== 11 ||
		cpf === '00000000000' ||
		cpf === '11111111111' ||
		cpf === '22222222222' ||
		cpf === '33333333333' ||
		cpf === '44444444444' ||
		cpf === '55555555555' ||
		cpf === '66666666666' ||
		cpf === '77777777777' ||
		cpf === '88888888888' ||
		cpf === '99999999999'
	)
		return false
	var sum = 0
	var rest
	for (let i = 1; i <= 9; i++) {
		sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i)
	}
	rest = (sum * 10) % 11
	if (rest === 10 || rest === 11) rest = 0
	if (rest !== parseInt(cpf.substring(9, 10))) return false
	sum = 0
	for (let i = 1; i <= 10; i++) {
		sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i)
	}
	rest = (sum * 10) % 11
	if (rest === 10 || rest === 11) rest = 0
	if (rest !== parseInt(cpf.substring(10, 11))) return false
	return true
}

export const validateCNPJ = (cnpj) => {
	cnpj = cnpj.replace(/[^\d]+/g, '')

	if (cnpj === '') return false
	if (cnpj.length !== 14) return false
	if (
		cnpj === '00000000000000' ||
		cnpj === '11111111111111' ||
		cnpj === '22222222222222' ||
		cnpj === '33333333333333' ||
		cnpj === '44444444444444' ||
		cnpj === '55555555555555' ||
		cnpj === '66666666666666' ||
		cnpj === '77777777777777' ||
		cnpj === '88888888888888' ||
		cnpj === '99999999999999'
	)
		return false
	var length = cnpj.length - 2
	var numbers = cnpj.substring(0, length)
	var digits = cnpj.substring(length)
	var sum = 0
	var pos = length - 7
	for (let i = length; i >= 1; i--) {
		sum += numbers.charAt(length - i) * pos--
		if (pos < 2) pos = 9
	}
	var result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
	if (result !== parseInt(digits.charAt(0))) return false
	length = length + 1
	numbers = cnpj.substring(0, length)
	sum = 0
	pos = length - 7
	for (let i = length; i >= 1; i--) {
		sum += numbers.charAt(length - i) * pos--
		if (pos < 2) {
			pos = 9
		}
	}
	result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
	if (result !== parseInt(digits.charAt(1))) return false
	return true
}

export const validateTime = (time) => {
	if (time.includes('_')) return false
	if (time.substring(0, 2) > '24') return false
	if (time.substring(3, 5) > '59') return false
	return true
}

export const validateDate = (date, format = 'DD-MM-YYYY') => {
	const _date =
		date !== ''
			? moment(date).isValid()
				? moment(moment(date).format(format), format)
				: moment(date, format)
			: ''
	return _date
}

export const validateNumber = (x, invalidValue) => {
	if (typeof x === 'number') return x
	if (typeof x === 'string') {
		const n = parseFloat(x)
		return isNaN(n) ? invalidValue : n
	}

	return invalidValue
}
