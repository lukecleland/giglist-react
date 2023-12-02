import React, { useContext } from "react";
import ReactWordcloud from "react-wordcloud";
import { useEffect, useState } from "react";
import { TDate, TListing } from "../types/types";
import moment from "moment";
import { Icon, Modal } from "semantic-ui-react";
import { PageListing } from "./PageListing/PageListing";
import { CustomContext, CustomContextType } from "./GiglistProvider";

type Word = {
    text: string;
    value: number;
};

export const WordCloud = () => {
    const { giglist } = useContext(CustomContext) as CustomContextType;
    const [words, setWords] = useState<{ text: string; value: number }[]>([]);

    useEffect(() => {
        if (giglist.length) {
            let wordArray: Word[] = [];

            giglist[0].listings.forEach((listing) => {
                const sourceObject = {
                    text: listing.artist + ". " + listing.name,
                    value: getRandomInt(15, 26),
                    id: listing.id,
                    rotationAngles: [0, 0],
                    rotations: 0,
                    fontWeight: 100,
                };
                wordArray.push(sourceObject);
            });

            setWords(wordArray);
        }
    }, [giglist]);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    margin: 0,
                    backgroundColor: "white",
                    padding: "0px",
                    color: "black",
                    fontFamily: "carbontyperegular",
                    fontSize: "25px",
                    width: "100%",
                    textAlign: "center",
                }}
            >{`Gigs ${moment().format("dddd MMM D")}`}</div>
            <div
                style={{
                    display: "flex",
                    textAlign: "center",
                    //alignItems: "center",
                    margin: 0,
                    backgroundColor: "black",
                    padding: "0px",

                    paddingLeft: "300px",
                    paddingRight: "0px",
                    marginTop: "-190px",
                    marginBottom: "132px",
                    color: "black",
                    fontFamily: "carbontyperegular",
                    fontSize: "25px",
                    width: "80%",
                }}
            >
                <ReactWordcloud
                    // callbacks={{
                    //     onWordClick: (event) => {
                    //         event.preventDefault();
                    //         // console.log(event);
                    //         // <WordCloudModal
                    //         //     listing={giglist[0].listings[0]}
                    //         // />;
                    //     },
                    // }}
                    options={options}
                    words={words}
                />
            </div>
        </>
    );
};

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const options = {
    colors: ["#ffffff", "#AEAEAE", "#f2f2f2", "#979797", "#808080"],
    enableTooltip: true,
    deterministic: true,
    fontFamily: "carbontyperegular",
    fontSizes: [20, 40] as [number, number],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 3,
    rotations: 3,
    rotationAngles: [0, 0] as [number, number],
    transitionDuration: 0,
    svgAttributes: { height: "1000px" },
};

const WordCloudModal = ({ listing }: { listing: TListing }) => {
    const [open, setOpen] = React.useState(false);

    console.log("word cloud modal");

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            // trigger={
            //     <div>
            //         <Listing listing={listing} />
            //     </div>
            // }
        >
            <Modal.Content>
                <PageListing listing={listing} />
            </Modal.Content>
            <Modal.Actions>
                <Icon
                    onClick={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        backgroundColor: "white",
                        cursor: "pointer",
                    }}
                    name={"window close"}
                    size={"big"}
                ></Icon>
            </Modal.Actions>
        </Modal>
    );
};
