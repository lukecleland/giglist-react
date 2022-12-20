import axios from "axios";
import { useEffect, useState } from "react";

type GigAd = {
    image: string;
    link: string;
    active: boolean;
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
                response.data.results[adId].Active &&
                    setGigAds({
                        image: response.data.results[adId].Image_Updload[0].url,
                        link: response.data.results[adId].url_forward,
                        active: response.data.results[adId].Active,
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
