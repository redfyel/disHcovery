import Lottie from "lottie-react";
import LoadingAnimation from "../../assets/animations/loading.json";
import logo from "../../assets/images/logo_og.png";

function Loading() {
  return (
    <div className="loading-container">
      <Lottie
        animationData={LoadingAnimation}
        loop
        autoplay
        className="loading-animation"
      />
      <img className="logo" src={logo} alt="Dishcovery Logo" />

      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap:0px;
          height: 100vh;
        }

        .loading-animation {
          width: 280px;
          height: auto;
          margin-bottom:0px;
        }

        .logo {
          width: auto;
          height: 100px;
          opacity: 0.8;
           display: block;
  margin-top: 0px;
        }
      `}</style>
    </div>
  );
}

export default Loading;
