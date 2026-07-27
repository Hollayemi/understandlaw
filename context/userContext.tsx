"use client";
import { useGetMeQuery } from "@/redux/authService/authSlice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { useSession } from "next-auth/react";
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

    const { status, data: session } = useSession();
    const authed = status === "authenticated" && session?.actor === "user";

    const {
        data: userInfo,
        error: userErr,
        isLoading: userIsLoading,
    } = useGetMeQuery(undefined, {
        skip: !authed
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
