export const excludeFields = (old, ...fields) => {
   if (
      old === null ||
      typeof old !== 'object' ||
      Array.isArray(old) ||
      fields.length === 0
   ) {
      return
   }

   fields = [...new Set(fields)]
   const oldLen = Object.keys(old).length
   const fieldLen = fields.length

   return Object.keys(old).reduce((acc, cur) => {
      if (oldLen === fieldLen) return acc
      if (fields.includes(cur)) {
         acc[cur] = old[cur]
      }
      return acc
   }, {})
}