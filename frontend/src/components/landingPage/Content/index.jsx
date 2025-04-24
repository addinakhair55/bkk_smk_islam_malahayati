import PropTypes from "prop-types";

export default function Content({ title, content }) {
    return (
        <div className="p-3 p-sm-4 p-md-5" style={{ backgroundColor: "#ECF0F8" }}>
            <div className="container text-center pb-4 pb-md-5">
                <h1 className="position-relative pb-3 pb-md-4 fw-bold">
                    {title}
                    <div
                        className="position-absolute bottom-0 start-50 translate-middle-x"
                        style={{
                            width: "50px",
                            height: "4px",
                            backgroundColor: "#4065B6",
                            marginTop: "10px",
                        }}
                    ></div>
                </h1>
                <p
                    className="fs-6 fs-sm-5 fs-md-4 text-justify mb-4 mt-3"
                    style={{
                        maxWidth: '850px',
                        lineHeight: '1.8',
                        margin: '0 auto',
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
}

// Menambahkan validasi propTypes
Content.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};
