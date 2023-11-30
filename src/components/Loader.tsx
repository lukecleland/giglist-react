import { useEffect, useState } from "react";

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 200);
        setTimeout(() => setPercent(false), 80);
    }, []);

    return (
        <div
            className={"loader"}
            style={{
                display: "flex",
                visibility: loading ? "visible" : "hidden",
                opacity: loading ? 1 : 0,
            }}
        >
            <img
                style={{
                    marginTop: "-130px",
                    marginLeft: "0px",
                    width: "200px",
                    clear: "right",
                }}
                className="main-logo"
                src={require("../styles/assets/newLogoGiglist.png")}
                alt="Giglist"
            />
            <div
                style={{
                    position: "absolute",
                    width: percent ? "0%" : "160px",
                    marginTop: "-70px",
                    height: "2px",
                    backgroundColor: "white",
                }}
            ></div>
        </div>
    );
};

export { Loader };
