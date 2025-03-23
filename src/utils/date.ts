import dayjs from 'dayjs'

export const formatDate = (date: string | number | Date | dayjs.Dayjs, formatStr: string) => dayjs(date).format(formatStr)

// export const formatDate = (date: string | number | Date | dayjs.Dayjs, formatStr: string) => dayjs(date).format(formatStr)
