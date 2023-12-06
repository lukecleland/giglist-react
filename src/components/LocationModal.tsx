import React, { useEffect } from "react";
import { Icon, Modal } from "semantic-ui-react";
import { Location } from "./Location/Location";

type Props = {
    userDriven?: Boolean;
};

export const LocationModal = ({ userDriven }: Props) => {
    const [open, setOpen] = React.useState(false);

    console.log("userDriven", userDriven);

    useEffect(() => {
        if (userDriven) {
            return;
        }
        const location = window.localStorage.getItem("location");
        if (location) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, []);

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
