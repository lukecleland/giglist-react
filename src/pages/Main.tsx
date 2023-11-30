import { Helmet } from "react-helmet";
import { DateList } from "../components/DateList";

export const Main = () => {
    return (
        <>
            <Helmet>
                <link rel="canonical" href="https://giglist.com.au/" />
            </Helmet>
            <div className="side-scroll">
                <section>
                    <DateList />
                </section>
            </div>
        </>
    );
};
