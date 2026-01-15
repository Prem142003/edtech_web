import { createSlice } from "@reduxjs/toolkit";

const parseLocalStorageJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === "undefined") return null;
    // try parse; if it fails, return the raw string
    try {
      return JSON.parse(raw);
    } catch (e) {
      return raw;
    }
  } catch (e) {
    return null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: parseLocalStorageJSON("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
