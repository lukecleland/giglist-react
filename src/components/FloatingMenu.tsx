import { Icon } from "semantic-ui-react";

<div
    style={{
        height: "42px",
        width: "200px",
        position: "absolute",
        top: "10",
        right: "10",
        background: "black",
        zIndex: 100,
        paddingTop: "10px",
        borderRadius: "20px 20px 20px 20px",
        boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.05)",
    }}
>
    <Icon
        name="search"
        size="large"
        style={{
            marginLeft: "20px",
            color: "white",
            cursor: "pointer",
        }}
    />
    <Icon
        name="calendar alternate outline"
        size="large"
        style={{
            marginLeft: "20px",
            color: "white",
            cursor: "pointer",
        }}
    />
    <Icon
        name="map"
        size="large"
        style={{
            marginLeft: "20px",
            color: "white",
            cursor: "pointer",
        }}
    />
    <Icon
        name="bars"
        size="large"
        style={{
            marginLeft: "20px",
            color: "white",
            cursor: "pointer",
        }}
    />
</div>;
