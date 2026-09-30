import React, {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

import { GigAd, TGiglist, TAllTimeCount } from "../types/types";

interface ProviderProps<T> {
    children?: ReactNode;
}

// Define your custom context that includes the attributes you need
export interface CustomContextType {
    isSearching: boolean;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
    giglist: TGiglist;
    setGiglist: Dispatch<SetStateAction<TGiglist>>;
    gigAds: GigAd[];
    setGigAds: Dispatch<SetStateAction<GigAd[]>>;
    giglistFull: TGiglist;
    setGiglistFull: Dispatch<SetStateAction<TGiglist>>;
    setAllTimeCount?: Dispatch<SetStateAction<TAllTimeCount>>;
    allTimeCount?: TAllTimeCount;
    auth: {
        createUserWithEmailAndPassword: (
            email: string,
            password: string
        ) => void;
    };
}

const CustomContext = createContext<CustomContextType>({
    isSearching: false,
    setIsSearching: () => {},
    giglist: [],
    setGiglist: () => {},
    gigAds: [],
    setGigAds: () => {},
    giglistFull: [],
    setGiglistFull: () => {},
    setAllTimeCount: () => {},
    allTimeCount: { count: 0 },
    auth: {
        createUserWithEmailAndPassword: (email: string, password: string) => {
            console.log("createUserWithEmailAndPassword", email, password);
        },
    },
});

function GiglistProvider({ children }: ProviderProps<ReactNode>) {
    const [isSearching, setIsSearching] = useState(false);
    const [giglist, setGiglist] = useState<TGiglist>([]);
    const [giglistFull, setGiglistFull] = useState<TGiglist>([]);
    const [gigAds, setGigAds] = useState<GigAd[]>([]);
    const [allTimeCount, setAllTimeCount] = useState<TAllTimeCount>({
        count: 0,
    });
    const [auth, setAuth] = useState({
        createUserWithEmailAndPassword: (email: string, password: string) => {
            console.log("createUserWithEmailAndPassword", email, password);
        },
    });

    // Create a context value object that includes your attributes
    const contextValue: CustomContextType = {
        isSearching,
        setIsSearching,
        giglist,
        gigAds,
        setGiglist,
        setGigAds,
        giglistFull,
        setGiglistFull,
        setAllTimeCount,
        allTimeCount,
        auth,
    };

    return (
        <CustomContext.Provider value={contextValue}>
            {children}
        </CustomContext.Provider>
    );
}

export { GiglistProvider, CustomContext };
