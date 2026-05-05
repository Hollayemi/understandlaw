"use client";
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
    } = useGetUserAccountQuery();


    return (
        <DataContext.Provider
            value={{
                ...defaultProvider,
                userInfo:
                    (!userErr && !userIsLoading && (userInfo as any)?.data) || {},
                loading,
                setLoading,
              
            } as any}
        >
            {children}
        </DataContext.Provider>
    );
};

export { UserDataProvider, DataContext };
