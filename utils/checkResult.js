const isResultArray = (data) => (Array.isArray(data) && data.length > 0) ? data : false

const isResultObject = (data) => (typeof data === 'object' && Object.keys(data).length > 0) ? data : false

export {
    isResultArray,
    isResultObject
}