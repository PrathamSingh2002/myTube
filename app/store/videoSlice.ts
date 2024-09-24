// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    searchQuery:"",
    recommendedVideos:[],
    videoPage:1
  },
  reducers: {
    setVideos(state, action) {
      state.videos = action.payload;
    },
    setRecommendedVideos(state, action) {
      state.recommendedVideos = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setVideoPage(state, action) {
      state.videoPage = action.payload;
    },
    
  },
});

export const { setVideos, setRecommendedVideos, setSearchQuery, setVideoPage} = videoSlice.actions;
export default videoSlice.reducer;
