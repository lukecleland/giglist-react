import { GigAd } from "../types/types";

export const GigAds = ({ adId, gigAds }: { adId: number; gigAds: GigAd[] }) => {
    const ad = gigAds[adId];

    if (!ad || !ad.link || !ad.image || !ad.image[0] || !ad.image[0].url) {
        return <></>;
    }

    const link = `${
        ad.link
    }?utm_source=giglist.com.au&utm_medium=cpc&utm_campaign=${encodeURIComponent(
        ad.Name,
    )}`;

    return (
        <div className="advert">
            <a href={link} target="_blank" rel="noreferrer">
                <img src={ad.image[0].url} alt="" />
            </a>
        </div>
    );
};
