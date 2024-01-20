import { Helmet } from "react-helmet-async";

type Props = {
    title: string;
    description: string;
    url: string;
    image: string;
};

export const Head = ({ title, description, url, image }: Props) => {
    return (
        <>
            <base href="/" />
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="#000000" />
            <meta itemProp="name" content="{title}" />
            <meta itemProp="description" content="{description}" />
            <meta name="description" content="{description}" />

            <link
                rel="shortcut icon"
                type="image/x-icon"
                href="https://giglist.com.au/wp-content/uploads/2018/08/favicon-1.ico"
            />

            <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
                integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                crossOrigin="anonymous"
            />

            <meta property="og:title" content={title} />
            <meta property="og:site_name" content="Giglist" />
            <meta property="og:url" content={url} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image} />

            <link rel="stylesheet" href="./semantic.min.css" />
            <link rel="manifest" href="./manifest.json" />

            <link
                rel="shortcut icon"
                type="image/x-icon"
                href="https://giglist.com.au/wp-content/uploads/2018/08/favicon-1.ico"
            />
            <link
                rel="stylesheet"
                href="./fontawesome.css"
                integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                crossOrigin="anonymous"
            />

            <title>Giglist. Gigs, in a list.</title>
        </>
    );
};
