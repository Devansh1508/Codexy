import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type PromptState } from '../../types/index'

// createAsyncThunk lets you write functions that can await things
export const setPromptAsync = createAsyncThunk(
  // "<sliceName>/<actionName>" naming practice 
  'prompt/setPromptAsync',
  async (newPrompt: string, { dispatch }) => {
    // simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // then dispatch the normal reducer
    dispatch(setPrompt(newPrompt));
  }
);

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