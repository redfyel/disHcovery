import Lottie from "lottie-react";
import LoadingAnimation from "../../assets/animations/loading.json";

function Loading() {
  return (
    <div className="loading-container">
      <Lottie animationData={LoadingAnimation} loop autoplay className="loading-animation" />
      <img className="logo" src="/path-to-your-logo.png" alt="Dishcovery Logo" />

      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .loading-animation {
          width: 180px;
          height: auto;
        }

        .logo {
          margin-top: 20px;
          width: 120px; /* Adjust size */
          height: auto;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default Loading;
