const isResultArray = (data) => {
   return data !== null && Array.isArray(data) && data.length > 0 ? data : [null]
}

const isResultObject = (data) =>
   data !== null &&
   typeof data === 'object' &&
   !Array.isArray(data) &&
   Object.keys(data).length > 0
      ? data
      : null

export { isResultArray, isResultObject }
