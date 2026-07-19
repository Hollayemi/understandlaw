"use client";
import { useGetMeQuery } from "@/redux/authService/authSlice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { isAuthenticated } from "@/redux/shared/axiosBaseQuery";
import { CitizenFull } from "@/redux/types";
import { useState, createContext } from "react";


const defaultProvider: any = {
    userInfo: {},
    theme: "light",
    notifications: [] as any[],
    loading: false,
    setLoading: (_: boolean) => { },
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

    const {
        data: specialisms,
        error: specialismsErr,
        isLoading: specialismsIsLoading,
    } = useListSpecialismsQuery();


    return (
        <DataContext.Provider
            value={{
                ...defaultProvider,
                userInfo:
                    (!userErr && !userIsLoading && (userInfo as any)?.data) || {} as CitizenFull,
                specialisms: (!specialismsErr && !specialismsIsLoading && (specialisms as any)?.data) || [],
                loading,
                setLoading,

            } as any}
        >
            {children}
        </DataContext.Provider>
    );
};

export { UserDataProvider, DataContext };
