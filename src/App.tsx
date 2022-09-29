import React, { ReactElement } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import DateList from "./components/Listing";
import Menu from "./components/Menu";
import PageListing from './components/PageListing';
import { TGiglistApiResponse, TGiglist, TListing } from './types/types';
import { useGiglistApiGet } from './hooks/useGigilstApiHook';
import './styles/styles.css';
// import { useListStore } from './stores/listStore';

function App() {

  const giglistFeedUrl = 'https://giglist.com.au/feed.php';
  const apiResponse: TGiglistApiResponse = useGiglistApiGet(giglistFeedUrl);  
  const gigdatastore:TGiglist = {...apiResponse.data};

  //const [listStore, listActions] = useListStore();

  //listActions.setListings(gigdatastore);

  const gigdata:TGiglist = gigdatastore;

  const routes = gigdata && gigdata.dates && gigdata.dates.map((date, i) => (
    date.gigs && date.gigs.map((gig, j)=> {
      const gigurl = `/gig/${gig.artist}/${gig.name}/${gig.date}`.replace(/\s+/g, '-').toLowerCase();
      const el:ReactElement = <PageListing gig={ gig as TListing } />
      return <Route path={ gigurl } element={ el } key={ i*j } />
    })
  )).flat()

  return (
    <>
      <main>
        <div className="ui page grid">
          <Menu />
          <div className="side-scroll ">
                  <section>
                    <DateList gigdata={gigdata as TGiglist}/>
                  </section>
                </div>
          {/* <BrowserRouter>
            <Routes>
              <Route path="/" element= {
                <div className="side-scroll ">
                  <section>
                    <DateList gigdata={gigdata as TGiglist}/>
                  </section>
                </div>
              } />
              {routes}
            </Routes>
          </BrowserRouter> */}
        </div>
        <div className="footer">
          <div className="footer-outer">
            <a href="/classifieds" className="item">Classifieds</a>
            <a href="shop.php" className="item">Shop</a>
            <a href="/" className="item float-right giglist-copy"><span className="copy">&copy;</span>Giglist 2022</a>
          </div>
        </div>
      </main>
    </>
  )
}

export default App;