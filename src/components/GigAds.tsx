import { useEffect, useState } from "react";

export type GigAd = {
    image: { url: string }[];
    link: string;
    Active: boolean;
};

export const GigAds = ({ adId, gigAds }: { adId: number; gigAds: GigAd[] }) => {
    return gigAds[adId] ? (
        <div className="advert">
            <a href={gigAds[adId].link} target="_blank" rel="noreferrer">
                <img src={gigAds[adId].image[0].url} alt="" />
            </a>
        </div>
    ) : (
        <></>
    );
};
