import { configureStore } from '@reduxjs/toolkit'
import promptReducer from './slices/prompt'

export default configureStore({
  reducer: {
    prompt: promptReducer,
  },
})