import React from "react";
import ReactWordcloud from "react-wordcloud";
import { useEffect, useState } from "react";
import { TDate } from "../types/types";
import moment from "moment";

type Word = {
    text: string;
    value: number;
};

export const WordCloud = ({ giglist }: { giglist: TDate[] }) => {
    const [words, setWords] = useState<{ text: string; value: number }[]>([]);

    useEffect(() => {
        let wordArray: Word[] = [];
        giglist.forEach((date) => {
            return date.listings.forEach((listing) => {
                const startdate = moment();
                const enddate = moment().add(1, "day");

                console.log(startdate, enddate);

                if (moment().isBetween(startdate, enddate)) {
                    const sourceObject = {
                        text: listing.artist,
                        value: getRandomInt(10, 16),
                        rotationAngles: [0, 0],
                        rotations: 0,
                        fontWeight: 700,
                    };
                    wordArray.push(sourceObject);
                }
            });
        });

        console.log(wordArray);

        setWords(wordArray);
    }, [giglist]);

    // useEffect(() => {
    //     setWords(wordArray);
    //     console.log(setting);
    // }, [photos]);

    return (
        <div style={{ position: "relative", textAlign: "center" }}>
            <h1
                style={{
                    position: "absolute",
                    backgroundColor: "white",
                    padding: 10,
                    marginTop: 45,
                    color: "black",
                    fontFamily: "carbontyperegular",
                    fontSize: "20px",
                    left: 10,
                }}
            >
                {`${moment().format("dddd D MMMM")}`}
            </h1>
            <div
                style={{
                    position: "relative",
                    margin: 0,
                    backgroundColor: "white",
                    padding: 10,
                    color: "black",
                    fontFamily: "carbontyperegular",
                    fontSize: "30px",
                }}
            >{`${"Live Music Tonight"}`}</div>
            <ReactWordcloud options={options} words={words} />
        </div>
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
    //scale: "sqrt",
    //spiral: "archimedean",
    transitionDuration: 0,
    svgAttributes: { height: "1000px" },
};
