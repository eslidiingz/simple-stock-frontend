export const formatNumber = (num: number, digits: number = 2): string => {
  console.log('second', num, digits)
  return Number(num).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// export const stringToNumber = (str: string): number => {
//   const num = Number(str.replace(/[^\d.-]/g, ''))
//   if (isNaN(num))
//     return 0

//   return num
// }
