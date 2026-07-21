"use client";
import { useGetMeQuery } from "@/redux/authService/authSlice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { isAuthenticated } from "@/redux/shared/axiosBaseQuery";
import { onAuthLogin, onAuthExpired } from "@/redux/shared/authEvents";
import { CitizenFull } from "@/redux/types";
import { useState, useEffect, createContext } from "react";


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

    // Tracked in state (not just read once) so that logging in / registering /
    // completing lawyer setup during this session immediately unlocks the
    // getMe query below, instead of only working after a hard refresh.
    const [authed, setAuthed] = useState(() => isAuthenticated("user"));

    useEffect(() => {
        const unsubLogin = onAuthLogin((actor) => {
            if (actor === "user") setAuthed(isAuthenticated("user"));
        });
        const unsubExpired = onAuthExpired(() => setAuthed(isAuthenticated("user")));

        return () => {
            unsubLogin();
            unsubExpired();
        };
    }, []);

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
