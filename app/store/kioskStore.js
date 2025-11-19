import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useKioskStore = create(
  persist(
    (set, get) => ({
      // User Information
      userName: '',
      mobile: '',
      uploadedImage: null,
      uploadedVoice: null,
      
      // Video/Media Data
      videoBlob: null,
      processingStatus: 'idle', // idle, processing, completed, error
      errorMessage: '',

      // Actions - User Information
      setUserName: (name) => set({ userName: name }),
      setMobile: (phone) => set({ mobile: phone }),
      
      // Actions - Media Upload
      setUploadedImage: (imageData) => set({ uploadedImage: imageData }),
      setUploadedVoice: (voiceData) => set({ uploadedVoice: voiceData }),
      setVideoBlob: (blob) => set({ videoBlob: blob }),
      
      // Actions - Processing Status
      setProcessingStatus: (status) => set({ processingStatus: status }),
      setErrorMessage: (message) => set({ errorMessage: message }),
      
      // Actions - Get all form data
      getFormData: () => {
        const state = get();
        return {
          userName: state.userName,
          mobile: state.mobile,
          uploadedImage: state.uploadedImage,
          uploadedVoice: state.uploadedVoice,
          videoBlob: state.videoBlob,
        };
      },
      
      // Actions - Reset store (for starting over)
      resetStore: () => set({
        userName: '',
        mobile: '',
        uploadedImage: null,
        uploadedVoice: null,
        videoBlob: null,
        processingStatus: 'idle',
        errorMessage: '',
      }),
      
      // Actions - Clear specific media
      clearImage: () => set({ uploadedImage: null }),
      clearVoice: () => set({ uploadedVoice: null }),
      clearVideo: () => set({ videoBlob: null }),
      
      // Actions - Set user details (batch update)
      setUserDetails: (details) => set({
        userName: details.fullName || '',
        mobile: details.whatsappNumber || '',
      }),
    }),
    {
      name: 'kiosk-storage', // name of the item in the storage
      partialize: (state) => ({
        userName: state.userName,
        mobile: state.mobile,
        uploadedImage: state.uploadedImage,
        uploadedVoice: state.uploadedVoice,
        videoBlob: state.videoBlob,
      }), // persist only these fields
    }
  )
);