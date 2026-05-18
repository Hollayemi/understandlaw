"use client";
import { useGetMeQuery } from "@/redux/authService/authSlice";
import { isAuthenticated } from "@/redux/shared/axiosBaseQuery";
import { ApiResponse, CitizenProfile, LawyerProfile, CitizenFull } from "@/redux/types";
import { useRef, useEffect, useState, createContext, useCallback } from "react";


const defaultProvider = {
    userInfo: {},
    theme: "light",
    notifications: [] as any[],
    loading: false,
    setLoading: (_: boolean) => {},
};

const DataContext = createContext(defaultProvider);


const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotification] = useState<any[]>([]);

    const {
        data: userInfo,
        error: userErr,
        isLoading: userIsLoading,
    } = useGetMeQuery(undefined, {
        skip: !isAuthenticated("user")
    });


    return (
        <DataContext.Provider
            value={{
                ...defaultProvider,
                userInfo:
                    (!userErr && !userIsLoading && (userInfo as any)?.data) || {} as CitizenFull,
                loading,
                setLoading,
              
            } as any}
        >
            {children}
        </DataContext.Provider>
    );
};

export { UserDataProvider, DataContext };
