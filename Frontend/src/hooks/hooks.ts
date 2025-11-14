import { useDispatch,useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch } from "../redux/store";
import type { RootState } from "../redux/store";

// i am creating my own dispatch function 
// which is typed with AppDispatch type
export const useAppDispatch= () => useDispatch<AppDispatch>();

// When I call useAppDispatch(), I’ll get something of type AppDispatch.
// export const useAppDispatch: () => AppDispatch = useDispatch;
// = useDispatch 
// assigns the actual implementation from React Redux’s built-in hook.


// Hey, whenever I use useSelector, my state is of type RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;