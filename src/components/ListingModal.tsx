import React, { FC } from "react";

import { Button, Header, Image, Modal } from 'semantic-ui-react'
import { TListing } from "../types/types";

interface Props {
    gig: TListing
}

const ListingModal: FC<Props> = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)
  const apiKey = "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM";
  const googlemapsurl = "https://maps.googleapis.com/maps/api/staticmap";
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={children}
    >
      <Modal.Header>{ props.gig.artist } @{ props.gig.name }</Modal.Header>
      <Modal.Content image>

        <Image size='medium' src={ props.gig.location_image_url } wrapped />
        <Image size='medium' src={`${googlemapsurl}?size=300x250&key=${apiKey}&maptype=roadmap&center=${props.gig.lat},${props.gig.lng}&zoom=16&markers=color:blue`} wrapped />
        
        <Modal.Description>
          <Header>{ props.gig.artist }</Header>
          <p>{ props.gig.name }</p>
          <p>{ props.gig.date }</p>
          <p>{ props.gig.date_formatted }</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Maybe next time
        </Button>
        <Button
          content="Add to my Giglist!"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ListingModal