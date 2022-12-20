import axios from "axios";
import { useEffect, useState } from "react";

export type GigAd = {
    image: string;
    link: string;
    Active: boolean;
};

export const GigAds = ({ adId }: { adId: number }) => {
    const [gigAds, setGigAds] = useState<GigAd>({} as GigAd);

    useEffect(() => {
        axios
            .get(
                "https://api.baserow.io/api/database/rows/table/108866/?user_field_names=true",
                {
                    headers: {
                        Authorization: "Token oBtxXLOu03SJmaB8O8TNh3c8M6dbMobB",
                    },
                }
            )
            .then((response) => {
                const validAds = response.data.results.filter(
                    (ad: GigAd) => ad.Active
                );

                setGigAds({
                    image: validAds[adId].Image_Updload[0].url,
                    link: validAds[adId].url_forward,
                    Active: validAds[adId].Active,
                });
            });
    }, [adId]);

    return (
        <div className="advert">
            <a href={gigAds.link} target="_blank" rel="noreferrer">
                {gigAds && <img src={gigAds.image} alt="" />}
            </a>
        </div>
    );
};
