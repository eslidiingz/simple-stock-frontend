import { defineStore } from 'pinia'

export enum ToastStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    status: ToastStatus.SUCCESS,
    message: '',
  }),
  actions: {
    setMessage(message: string) {
      this.message = message

      return this
    },
    setStatus(status: ToastStatus) {
      this.status = status

      return this
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
  },
})
