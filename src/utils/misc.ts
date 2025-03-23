export const objectToQueryString = (_params: any): string => {
  let queryString = ''

  if (_params) {
    queryString = Object.keys(_params).map(key => `${key}=${_params[key]}`).join('&')

    if (queryString)
      queryString = `?${queryString}`
  }

  return queryString
}

export const objectToFormData = (_object: object): FormData => {
  const formData = new FormData()

  for (const key in _object) {
    if (Object.prototype.hasOwnProperty.call(_object, key)) {
      const value = _object[key as keyof typeof _object]

      if (value !== undefined && value !== null)
        formData.append(key, value as string | Blob)
    }
  }

  // for (const keyValue of formData.entries())
  //   console.log(keyValue)

  return formData
}
