import React from "react";
import { Modal } from "semantic-ui-react";
import { Location } from "./Location/Location";

type Props = {
    userDriven?: Boolean;
};

export const LocationModal = ({ userDriven }: Props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Content>
                <Location />
            </Modal.Content>
        </Modal>
    );
};
