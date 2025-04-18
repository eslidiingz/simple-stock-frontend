import { defineStore } from 'pinia'

export interface Dialog {
  title?: string
  message: string
  onConfirm?: () => void
}

export interface DialogConfirm extends Dialog {
  onCancel?: () => void
}

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    normal: {
      isVisible: false,
      title: '',
      message: '',
      onConfirm: null as (() => void) | null,
    },
    confirm: {
      isVisible: false,
      title: '',
      message: '',
      onConfirm: null as (() => void) | null,
      onCancel: null as (() => void) | null,
    },
  }),
  actions: {
    show({ title, message, onConfirm }: Dialog) {
      this.normal.title = title as string
      this.normal.message = message
      this.normal.onConfirm = onConfirm || null
      this.normal.isVisible = true
    },
    hide() {
      this.normal.isVisible = false
    },
    dialogConfirm() {
      this.normal.isVisible = false
    },

    showConfirm({ title, message, onConfirm, onCancel }: DialogConfirm) {
      this.confirm.title = title as string
      this.confirm.message = message
      this.confirm.onConfirm = onConfirm || null
      this.confirm.onCancel = onCancel || null
      this.confirm.isVisible = true
    },
    confirmYes() {
      this.confirm.onConfirm?.()
      this.confirm.isVisible = false
    },
    confirmNo() {
      this.confirm.onCancel?.()
      this.confirm.isVisible = false
    },
  },
})
