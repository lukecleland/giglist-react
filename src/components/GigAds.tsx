import { useEffect, useState } from "react";

export type GigAd = {
    Name: string;
    image: { url: string }[];
    link: string;
    Active: boolean;
};

export const GigAds = ({ adId, gigAds }: { adId: number; gigAds: GigAd[] }) => {
    const link =
        gigAds[adId].link +
        `?utm_source=giglist.com.au&utm_medium=cpc&utm_campaign=${gigAds[adId].Name}]}`;
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
