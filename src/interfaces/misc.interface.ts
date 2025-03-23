export interface TableOptions {
  page?: number
  itemsPerPage?: number
  sortBy?: any
  groupBy: string[]
  search?: number
}

export enum ModeType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}
