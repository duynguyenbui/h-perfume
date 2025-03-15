import { ModalType } from '@/constants'
import { create } from 'zustand'

interface ModalsState {
  isOpen: boolean
  type: ModalType
  data?: any
  open: ({ modal, data }: { modal: ModalType; data?: any }) => void
  close: () => void
}

export const useModals = create<ModalsState>((set) => ({
  isOpen: false,
  type: ModalType.NONE,
  data: {},
  open: ({ modal, data }) => set({ isOpen: true, type: modal, data }),
  close: () => set({ isOpen: false, type: ModalType.NONE, data: {} }),
}))
