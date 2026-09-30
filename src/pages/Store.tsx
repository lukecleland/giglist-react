import { Helmet } from "react-helmet-async";

export const Store = () => (
    <div style={{ padding: "100px 24px 40px", maxWidth: 760, margin: "0 auto", color: "white" }}>
        <Helmet>
            <title>Store | Giglist</title>
            <link rel="canonical" href="https://giglist.com.au/store" />
            <meta name="description" content="Shop Giglist merchandise in the official Giglist Store." />
            <meta property="og:title" content="Store | Giglist" />
            <meta property="og:url" content="https://giglist.com.au/store" />
        </Helmet>
        <h1>Store</h1>
        <p>Shop Giglist merchandise in our official store.</p>
        <a className="ui button" style={{ background: "#333" }} href="https://giglist.deco-apparel.com/">Visit the Giglist Store</a>
    </div>
);
