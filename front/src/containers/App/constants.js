export const findChildren = (data, idx) => {
  let children = [];

  data.forEach(x => {
    if (x.parentIndex === idx) {
      children = [...children, x]
    }
  })

  return children
}

export const formatDate = (date, includeTime=true) => {
  if(!date){
    return null
  }
  date = new Date(date)

  let day = date.getDate()
  let month = date.getMonth() + 1;
  let year = date.getFullYear()
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if(day.toString().length === 1)
    day = '0' + day

  if(month.toString().length === 1)
    month = '0' + month

  if(hours.toString().length === 1)
    hours = '0' + hours

  if(minutes.toString().length === 1)
    minutes = '0' + minutes

  return `${day}/${month}/${year}` + (includeTime ? ` ${hours}:${minutes}` : '')
}
