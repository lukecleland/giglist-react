import React, { FC } from "react";
import PageListing from "./PageListing";
import { Modal } from 'semantic-ui-react'
import { TListing } from "../types/types";

interface Props {
    gig: TListing
}

const ListingModal: FC<Props> = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={children}
    >
      {/* <Modal.Header>{ props.gig.artist } @{ props.gig.name }</Modal.Header> */}
      <Modal.Content>
        <PageListing gig={props.gig} />
      </Modal.Content>
      <Modal.Actions>
        {/* <Button color='black' onClick={() => setOpen(false)}>
          <Icon style={{position:'absolute', top:0, right: 0}} name={"window close"}></Icon>
        </Button> */}
        {/* <Button
          content="Add to my Giglist!"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        /> */}
      </Modal.Actions>
    </Modal>
  )
}

export default ListingModal