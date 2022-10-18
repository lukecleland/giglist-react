import { useEffect, useState } from "react";
import { ReactPhotoCollage } from "react-photo-collage";
import { TDate } from "../types/types";

const settingTemplate = {
    width: "600px",
    height: ["250px", "170px"],
    layout: [1, 4],
    photos: [
        {
            source: "https://images.unsplash.com/photo-1517088455889-bfa75135412c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e5548929376f93d8b1b7a21097df03bd&auto=format&fit=crop&w=749&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1526656892012-7b336603ed46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=31c8e58b58c25dfcc18452ed29b52951&auto=format&fit=crop&w=334&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1521024221340-efe7d7fa239b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9ad8a99d809d3fa3a9e8dff3ecc81878&auto=format&fit=crop&w=750&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1523038793606-2fd28f837a85?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=919b76f4229e41416653aeb10e84e94a&auto=format&fit=crop&w=334&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=93d7ac9abad6167aecb49ebd67fd5b6d&auto=format&fit=crop&w=751&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1526938972776-11558ad4de30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=973795a277e861265b0fabbf4a96afe2&auto=format&fit=crop&w=750&q=80",
        },
        {
            source: "https://images.unsplash.com/photo-1464550838636-1a3496df938b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f22dbf6c13ea7c21e803aa721437b691&auto=format&fit=crop&w=888&q=80",
        },
    ],
    showNumOfRemainingPhotos: true,
};

type Photo = {
    source: string;
};

export const LocationGraphic = ({ giglist }: { giglist: TDate[] }) => {
    const [setting, setSetting] = useState(settingTemplate);
    const [photos, setPhotos] = useState<{ source: string }[]>([]);

    useEffect(() => {
        let photoArray: Photo[] = [];
        giglist.forEach((date) => {
            return date.listings.forEach((listing) => {
                const sourceObject = { source: listing.location_image_url };
                photoArray.push(sourceObject);
            });
        });

        setPhotos(photoArray);
    }, [giglist]);

    useEffect(() => {
        setSetting({ ...settingTemplate, photos });
        console.log(setting);
    }, [photos]);

    return (
        <div>
            <ReactPhotoCollage {...data} />
        </div>
    );
};

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const layout = [
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
    getRandomInt(4, 12),
];

const data = {
    width: "1500px",
    height: ["250px", "370px"],
    layout: layout,
    photos: [
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Hiddlestone-Lane.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Tattersalls-Bowling-Recreation-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/Beaufort.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sovereign-Arms.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/Roberts-on-Oxford.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Subiaco-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Koorliny-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/3-Sheets-on-the-Lake.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Froth.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Firkin-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/U-N-ME-Coogee.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/43-Below.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Bridge-Garden-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sewing-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Westfield-Carousel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Frisk-Small-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/08/mandurah-offshore-fishing-club-e1565805121852.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Dudley-Park-Bowling-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/KIng-Road-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pink-Duck.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Lake-Monger-Recreation-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Ball-and-Chain-@-Esplanade-Hotel-Fremantle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Downstairs-at-the-Maj.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Jarrahdale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Lums-Wine-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Lynotts-Lounge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Italian-Club-Welshpool.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Hay-Park-Community-Hall.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Woodvale-Reception-Centre-@-Woodvale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Six-Degrees.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Cornerstone-Ale-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/Roberts-on-Oxford.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Victoria-Park-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Burlington-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Johnny-Foxs.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ellington-Jazz-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Mount-Claremont-Primary-School.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Mundaring-Garden-and-Farmers-Market.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/La-Chiquita-Cafe.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Boundary-Island-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Lenton-Brae.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Funk-2.0.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Gidgestock-Music-Festival.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Wembley-Golf-Course.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Art-of-Seafood.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/El-Peruvian-Food-Co.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Valley-Social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Red-Hill-Auditorium.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Alexander-Bar-and-Bistro-1.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hawaiians-Forrestfield.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Convenients.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/02/Fremantle-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Globe-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Froth.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Finlays.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Champion-Lakes-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Little-Things-Gin.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Beaconsfield-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sewing-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hanks-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Downstairs-at-the-Maj.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Northshore-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Riverton-Bar-and-Grill.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Lynotts-Lounge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Clancys-Fremantle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Jack-Rabbit-Slims.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/09/rechabites.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Grand-Central-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Brighton-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Landing-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Paddo.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Durty-Nellys.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Duke-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Fire-Station.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Alabama-Song.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Vic-Park-Farmers-Market.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Two-Dogs-Laughing.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Core-Cider.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/3-Sheets-on-the-Lake.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Breakwater.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Port-Kennedy-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Little-Cs-Hillarys.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Market-Square-Subiaco.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Port-Kennedy-RSL.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Alexander-Bar-and-Bistro-1.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ocean-View-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Guildford-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Funk-2.0.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Morley-Noranda-Rec-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brewvino.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Ric-OSheas.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sovereign-Arms.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Finlays.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Paddy-Malones.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Breakwater.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Pirate-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/The-Cut-Golf-Course.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Bills-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Woodvale-Tavern.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Velour-Lounge-@-Brighton-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Al-Pastor-Taqueria-and-Tequila-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Hotel-Northbridge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sovereign-Arms.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Australia-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/Roberts-on-Oxford.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/3-Sheets-on-the-Lake.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Port-Kennedy-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Alexander-Bar-and-Bistro-1.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Frisk-Small-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Brook-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Froth-Craft-Bunbrewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sonar-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Chequers-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Durty-Nellys.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Alabama-Song.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/David-Grays-Arena.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Mash-Brewing.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Wembley-Golf-Course.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Government-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Valley-Social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Bruce-Rock-Amphitheatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/21st-Amendment.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hawaiians-Forrestfield.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Bridge-Garden-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Government-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Leopold-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Froth.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Ric-OSheas.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Belvideres-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Lynotts-Lounge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Cunderdin-Sports-and-Recreation-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Cunderdin-Sports-and-Recreation-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Leopold-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Grand-Central-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sonar-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Capricorn-Oval.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Convenients.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Goodwill-Club-@-Rechabite.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Vat-116.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Cottesloe-Beach-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/10/galway.jpeg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Burlington-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/South-Perth-Streats.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Brugan-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Core-Cider.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/08/mandurah-offshore-fishing-club-e1565805121852.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/3Sheets-on-the-Harbour.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Karridale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Guildford-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ocean-View-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/KIng-Road-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Morley-Noranda-Rec-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Perth-Concert-Hall.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Finlays.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Pirate-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/Roberts-on-Oxford.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Caves-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Johnny-Foxs.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Gypsy-Tapas-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/21st-Amendment.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Hotel-Northbridge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Shipwreck-Park-@-Sienna-Wood-Estate.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Woodvale-Tavern.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/11/Roberts-on-Oxford.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Leopold-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Froth-Craft-Bunbrewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/3-Sheets-on-the-Lake.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Guildford-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Fremantle-Sailing-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/43-Below.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Wongan-Hills-Bowling-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Hallys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Warnbro-Tavern.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Port-Beach-Brewery-Band-Room-Railway-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sewing-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Mundaring-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Durty-Nellys.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Johnny-Foxs.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Mundaring-Garden-and-Farmers-Market.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Lenton-Brae.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Funk-2.0.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mandoon-Estate.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Wembley-Golf-Course.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hawaiians-Forrestfield.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Caves-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Lobby-Lounge-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/TWR-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Aardvark.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sewing-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/RAC-Arena.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Brook-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Paddo.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Bar-Orient.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/10/galway.jpeg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Woodvale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Woodbridge-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Alabama-Song.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mustang-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Local-Farmers-Market-@-Honeywood-Primary-School.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Black-Brewing-Co.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/E-Shed-Markets.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ocean-View-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brisbane-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Funk-2.0.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Morley-Noranda-Rec-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Ric-OSheas.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Last-Local-Canning-Vale.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Finlays.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Clancys-Dunsborough.jpeg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Riverside-Room-Crown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Pirate-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Rodneys-Bait-and-Tackle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Atrium-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Warnbro-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Caves-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Hotel-Northbridge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Hallys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Brewvino.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/Beaufort.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Bruce-Rock-Amphitheatre.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/21st-Amendment.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Perth-Concert-Hall.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ellington-Jazz-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/La-Chiquita-Cafe.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/U-N-ME-Coogee.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Bruce-Rock-District-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Port-Kennedy-RSL.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Byford-Districts-CC.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Perth-Concert-Hall.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Ball-and-Chain-@-Esplanade-Hotel-Fremantle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sonar-Room.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Four5Nine.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/KIng-Road-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/10/beerpourium-e1570703075391.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Convenients.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Pot-Shot-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Woodvale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Durty-Nellys.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Alabama-Song.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Mundaring-Garden-and-Farmers-Market.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Drakesbrook-Weir.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Wembley-Golf-Course.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Beerfarm.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/HBF-Park.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Old-Courthouse.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Clancys-Fremantle.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hawaiians-Forrestfield.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Convenients.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/RAC-Arena.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/De-Bernales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Froth.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Brook-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Perth-Concert-Hall.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Stirling-Arms-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Lynotts-Lounge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Riverton-Bar-and-Grill.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Mandurah-Performing-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2019/10/beerpourium-e1570703075391.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Froth-Craft-Bunbrewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Paddo.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Core-Cider.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Whitfords-Nodes-Park.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/3-Sheets-on-the-Lake.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Treendale-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ocean-View-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Morley-Noranda-Rec-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Point-Bar-and-Grill.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Finlays.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Russell-Inn.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Clancys-Fremantle.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Pirate-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Johnny-Foxs.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Mandurah-Performing-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Charles-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Hotel-Northbridge.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/RAC-Arena.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Wilsons-Brewing-Company.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/04/Beaufort.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Froth.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Koorliny-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/03/Cidery-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Alexander-Bar-and-Bistro-1.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Rose-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Firkin-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/43-Below.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Wood-and-Stone-Cafe.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/10/Red-Hill-Auditorium.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/02/Fremantle-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Lake-Monger-Recreation-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Lynotts-Lounge.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Navy-Club.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Victoria-Park-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/National-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Johnny-Foxs.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Mundaring-Garden-and-Farmers-Market.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Repertory-Theatre-Bridgetown.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Boundary-Island-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/05/Wembley-Golf-Course.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Ravenswood-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Globe-The.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Badlands-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/02/Fremantle-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Hanks-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/The-River.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/09/Nelsons-of-Bridgetown.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Prince-of-Wales.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Port-Kennedy-RSL.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Astor-Theatre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Woodvale-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Carlisle-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Indian-Ocean-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Mojos.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Chase-Bar-and-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Milk-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/01/Endeavour-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/09/Vat-116.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Settlers-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Bennys-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Amplifier-Bar.jpg",
        },
        {
            source: "",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/Hotel-Rottnest.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/06/3Sheets-on-the-Harbour.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/12/Wild-Bull-Brewery.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Caves-House.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Murphys-Irish-Pub.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Ocean-View-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Gate-Bar-Bistro.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Morley-Noranda-Rec-Club.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/08/Ric-OSheas.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Craigie-Tavern.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Sovereign-Arms.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Mundaring-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Margaret-River-Brewhouse.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Lyrics-Underground.jpg",
        },
        {
            source: "",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/02/Fremantle-Arts-Centre.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Duke-of-George.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Rosemount-Hotel.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/10/Freo.social.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2021/08/Universal-Bar.jpg",
        },
        {
            source: "https://giglist.com.au/wp-content/uploads/2022/07/Fire-in-Your-Belly.jpg",
        },
    ],
    showNumOfRemainingPhotos: true,
};
