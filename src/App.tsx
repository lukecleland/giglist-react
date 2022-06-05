import React from 'react';

import DateList from "./components/Listing";
import Menu from "./components/Menu";
import { TGiglistApiResponse, TGiglist } from './types/types';
import { useGiglistApiGet } from './hooks/useGigilstApiHook';
import './styles/styles.css';


function App() {

  const apiResponse: TGiglistApiResponse = useGiglistApiGet('https://giglist.com.au/feed.php');  
  const gigdata:TGiglist = {...apiResponse.data};

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
        </div>
        <div className="footer">
          <div className="footer-outer">
            <a href="/classifieds" className="item">Classifieds</a>
            <a href="shop.php" className="item">Shop</a>
            <a href="/" className="item float-right"><span className="copy">&copy;</span>Giglist 2022</a>
          </div>
        </div>
      </main>
    </>
  )
}

export default App;