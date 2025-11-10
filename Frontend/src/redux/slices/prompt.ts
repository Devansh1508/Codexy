import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type PromptState } from '../../types/index'


const initialState: PromptState = {
  value: '',
}

export const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPrompt(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPrompt } = promptSlice.actions

export default promptSlice.reducer