export function filterText(input, option) {
    if(option.props.value) {
        return searchStr(option.props.children).includes(searchStr(input));
    } else {
        return false;
    }
}

const searchStr = str => {
	return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : str;
}