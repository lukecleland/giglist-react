import { useEffect, useState } from "react";

export type GigAd = {
    image: { url: string }[];
    link: string;
    Active: boolean;
};

export const GigAds = ({ adId, gigAds }: { adId: number; gigAds: GigAd[] }) => {
    // const [imageURL, setImageURL] = useState<string>("");

    // useEffect(() => {
    //     const checkImage = (checkurl: string) => {
    //         const imageExists = localStorage.getItem(checkurl);
    //         if (imageExists) {
    //             console.log(imageExists);
    //             setImageURL(imageExists);
    //         } else {
    //             setImageURL(checkurl);
    //             localStorage.setItem(checkurl, checkurl);
    //         }
    //     };

    //     gigAds[adId] && checkImage(gigAds[adId].image[0].url);
    // }, []);

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
