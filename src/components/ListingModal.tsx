import React from "react";
import { PageListing } from "./PageListing";
import { Icon, Modal } from "semantic-ui-react";
import { TListing } from "../types/types";
import { Listing } from "./Listing";

export const ListingModal = ({ listing }: { listing: TListing }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
                <div>
                    <Listing listing={listing} />
                </div>
            }
        >
            <Modal.Content>
                <PageListing listing={listing} />
            </Modal.Content>
            <Modal.Actions>
                <Icon
                    onClick={() => setOpen(false)}
                    name={"window close"}
                    size={"big"}
                ></Icon>
            </Modal.Actions>
        </Modal>
    );
};
