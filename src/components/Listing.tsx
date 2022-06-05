import React from 'react';
import { TListing, TGiglist } from '../types/types';
import ListingModal from './ListingModal';

export const DateList:React.ElementType = ({gigdata}: {gigdata:TGiglist}) => {
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
            <div className="event-title">{ gig.artist }</div>
            <div className="event-venue">
              <div className="name">{ gig.name }, { gig.suburb }</div>
              <div className="address">{ gig.address }</div>
            </div>
            <div className="event-time">{ gig.date_formatted }</div>
          </li>
          }
          gig = { gig }
          />
        
      ))}
    </>
  )
}

export default DateList;


