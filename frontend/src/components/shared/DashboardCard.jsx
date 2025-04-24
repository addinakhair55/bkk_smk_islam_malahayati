import PropTypes from 'prop-types';

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}) => {
  return (
    <div className="card shadow-sm border-0">
      {cardheading ? (
        <div className="card-body">
          <h5 className="card-title">{headtitle}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{headsubtitle}</h6>
        </div>
      ) : (
        <div className="card-body p-4">
          {title && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {title && <h5 className="card-title mb-0">{title}</h5>}
                {subtitle && (
                  <h6 className="card-subtitle text-muted">{subtitle}</h6>
                )}
              </div>
              {action}
            </div>
          )}

          {children}
        </div>
      )}

      {middlecontent && (
        <div className="card-body">{middlecontent}</div>
      )}

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  footer: PropTypes.node,
  cardheading: PropTypes.bool,
  headtitle: PropTypes.string,
  headsubtitle: PropTypes.string,
  middlecontent: PropTypes.node,
};

export default DashboardCard;
