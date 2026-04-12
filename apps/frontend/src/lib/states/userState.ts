import { create } from "zustand";

export interface userState{
    userName:string|null,
    setUserName:(userName:string|null) => void,
}

// Store the state of the user for any component to get
export const useUserState = create<userState>((set) => ({
    userName:null,
    setUserName:(userName:string|null) => set({userName:userName}),
}))
