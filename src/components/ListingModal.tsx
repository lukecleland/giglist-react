import React from "react";
import { PageListing } from "./PageListing/PageListing";
import { Icon, Modal } from "semantic-ui-react";
import { TListing } from "../types/types";
import { Listing } from "./Listing/Listing";

export const ListingModal = ({ listing }: { listing: TListing }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            size="large"
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
        </Modal>
    );
};
