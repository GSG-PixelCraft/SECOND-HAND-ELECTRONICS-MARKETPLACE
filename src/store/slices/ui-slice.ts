// UI state (modals, toasts, sidebar)
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: true,
    theme: 'light',
    modals: {},
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
  },
})

export const { toggleSidebar, setTheme, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer