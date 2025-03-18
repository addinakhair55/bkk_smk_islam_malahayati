import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';
import "./HeroTitle.css"

export default function HeroTitle({ title, subtitle}) {
    return (
        <div className="d-flex w-100 p-5 flex-column justify-content-center align-items-center">
            <div className="text-center">
                <h2 className="fw-bold font-title-hero">{title}</h2>
                {subtitle && <h2 className="fw-bold font-subtitle-hero mt-4">{subtitle}</h2>}
            </div>
            <div className="w-100 d-flex justify-content-center mt-3">
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Beranda</Breadcrumb.Item>
                    <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    );
}

HeroTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string.isRequired,
    isButtonVisible: PropTypes.bool
};

HeroTitle.defaultProps = {
    subtitle: "",
    isButtonVisible: false
};
