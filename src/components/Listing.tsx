import React from 'react';
import { TListing, TGiglist } from '../types/types';
import ListingModal from './ListingModal';

export const DateList:React.ElementType = ({gigdata}: {gigdata:TGiglist}) => {

  // const uniqueIds = new Set();

  // if (gigdata) {
  //   const unique = gigdata.dates.filter(element => {
  //     const isDuplicate = uniqueIds.has(element.lat);

  //     uniqueIds.add(element.id);

  //     if (!isDuplicate) {
  //       return true;
  //     }

  //     return false;
  //   });
  // }

  return (
    <>
      { gigdata.dates && gigdata.dates.map((date, index) => (
        <ul className="day" key={index}>
          <div className="date"><span>{ date.datestring }</span></div> 
          <Listing gigs = { date.gigs } />
        </ul>
      ))}

    </>
  )
}

export const Listing:React.ElementType = ({gigs}: {gigs:TListing[]}) => {
  return (
    <>
      { gigs && gigs.length>0 && gigs.map((gig:TListing, index:number) => (
        <ListingModal key={index} children={
          <li className="event-wrapper listing">
            <div className="event-title">{ gig.artist.replace(/&amp;/g, '&') }</div>
            <div className="event-venue">
              <div className="name">{ gig.name.replace(/&amp;/g, '&') }, { gig.suburb }</div>
              <div className="address">{ gig.address }</div>
            </div>
            {/* <div className="event-time">{ gig.date_formatted.toUpperCase() }</div> */}
          </li>
          }
          gig = { gig }
          />
        
      ))}
    </>
  )
}

export default DateList;


