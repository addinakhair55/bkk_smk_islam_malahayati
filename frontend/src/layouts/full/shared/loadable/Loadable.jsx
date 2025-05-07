import { Suspense } from "react";

const LoadingPlaceholder = () => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      fontFamily: "'Inter', sans-serif",
      color: "#64748b",
    }}
  >
    <div
      style={{
        width: "3rem",
        height: "3rem",
        border: "4px solid #64748b",
        borderTop: "4px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <span style={{ fontSize: "1.125rem", fontWeight: 500 }}>Loading...</span>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const Loadable = (Component) => {
  const WrappedComponent = (props) => (
    <Suspense fallback={<LoadingPlaceholder />}>
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `Loadable(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

export default Loadable;