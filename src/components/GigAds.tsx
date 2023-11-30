import { GigAd } from "../types/types";

export const GigAds = ({ adId, gigAds }: { adId: number; gigAds: GigAd[] }) => {
    const link =
        gigAds[adId] &&
        `${
            gigAds[adId].link
        }?utm_source=giglist.com.au&utm_medium=cpc&utm_campaign=${encodeURIComponent(
            gigAds[adId].Name
        )}`;
    return gigAds[adId] ? (
        <div className="advert">
            <a href={link} target="_blank" rel="noreferrer">
                <img src={gigAds[adId].image[0].url} alt="" />
            </a>
        </div>
    ) : (
        <></>
    );
};
