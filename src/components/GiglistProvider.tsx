import React, {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

import { GigAd, TGiglist } from "../types/types";

interface ProviderProps<T> {
    children?: ReactNode;
}

// Define your custom context that includes the attributes you need
export interface CustomContextType {
    giglist: TGiglist;
    setGiglist: Dispatch<SetStateAction<TGiglist>>;
    gigAds: GigAd[];
    setGigAds: Dispatch<SetStateAction<GigAd[]>>;
    giglistFull: TGiglist;
    setGiglistFull: Dispatch<SetStateAction<TGiglist>>;
}

const CustomContext = createContext<CustomContextType>({
    giglist: [],
    setGiglist: () => {},
    gigAds: [],
    setGigAds: () => {},
    giglistFull: [],
    setGiglistFull: () => {},
});

function GiglistProvider({ children }: ProviderProps<ReactNode>) {
    const [giglist, setGiglist] = useState<TGiglist>([]);
    const [giglistFull, setGiglistFull] = useState<TGiglist>([]);
    const [gigAds, setGigAds] = useState<GigAd[]>([]);

    // Create a context value object that includes your attributes
    const contextValue: CustomContextType = {
        giglist,
        gigAds,
        setGiglist,
        setGigAds,
        giglistFull,
        setGiglistFull,
    };

    return (
        <CustomContext.Provider value={contextValue}>
            {children}
        </CustomContext.Provider>
    );
}

export { GiglistProvider, CustomContext };