export const IFrame = ({
    src,
    title,
    className,
}: {
    src: string;
    title: string;
    className: string;
}) => {
    return (
        <div className={className}>
            <iframe
                style={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    border: "none !important",
                    outline: "none",
                    margin: 0,
                    padding: 0,
                    overflow: "hidden",
                    zIndex: 1,
                    scrollbarWidth: "none",
                }}
                frameBorder="0"
                height={"100%"}
                width={"100%"}
                title={title}
                src={src}
            ></iframe>
        </div>
    );
};
