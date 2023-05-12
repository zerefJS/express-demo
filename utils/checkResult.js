export function checkResult(data) {
    const isArrayAndNotEmpty = Array.isArray(data) && data.length > 0
    return isArrayAndNotEmpty ? data[0] : false
}