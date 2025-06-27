import type { User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const userfromlocal = localStorage.getItem("user");
// !! means does this exists -> yes= true and no = false
const initialState: AuthState = {
  user: userfromlocal ? JSON.parse(userfromlocal) : null,
  isLoggedIn: !!userfromlocal,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action)=>{
        const { user } = action.payload;
        state.user = user;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
