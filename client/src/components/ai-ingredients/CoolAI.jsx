import { useState, useContext } from "react";
import { HiSparkles } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "./CoolAI.css";
import { userLoginContext } from "../../contexts/UserLoginContext";
import AccessDenied from "../protected/AccessDenied";

export default function CoolAI() {
  const { loginStatus } = useContext(userLoginContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const handleInput = (e) => setInput(e.target.value);

  const handleSend = () => {
    if (!loginStatus) {
      // Store return path and redirect to login
      sessionStorage.setItem("returnAfterLogin", location.pathname);
      navigate("/login");
      return;
    }

    if (input.trim().toLowerCase() === "hi") {
      setOpen(false);
      navigate("/ai-ingredients");
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props} className="custom-tooltip">
      Get AI-powered recipe ideas based on your ingredients!
    </Tooltip>
  );

  return (
    <div className="position-fixed bottom-0 end-0 m-4">
      {!open ? (
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <button
            className="ai-but rounded-circle p-3"
            onClick={() => setOpen(true)}
          >
            <HiSparkles size={30} color="#0A122A" /> {/* Dark icon */}
          </button>
        </OverlayTrigger>
      ) : (
        <div
          className="card p-4 shadow-lg"
          style={{
            width: "22rem",
            backgroundColor: "#FBFAF8", /* Light background */
            color: "#0A122A", /* Dark text */
          }}
        >
          <button
            className="btn-close position-absolute top-0 end-0 m-2"
            onClick={() => setOpen(false)}
            style={{ color: "#0A122A" }}
          ></button>
          {/* Title & Tagline */}
          <h4 className="text-center fw-bold" style={{ color: "#0A122A" }}>
            ✨ disHcovery
          </h4>
          <p className="text-center text-muted" style={{ color: "#698F3F" }}>
            Turn your ingredients into a delicious surprise!
          </p>
          {/* Show login warning if user is not logged in */}
          {!loginStatus && (
            <div className="alert alert-warning text-center" role="alert" style={{ backgroundColor: "#E7DECD", color: "#0A122A"}}>
              <AccessDenied compact />
              {/* Please <a href="/login" className="fw-bold">log in</a> to use AI recipes! */}
            </div>
          )}
          {/* Input Field */}
          <div className="d-flex align-items-center mt-3">
            <input
              type="text"
              placeholder="Text 'hi' to get started"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              className="form-control text-center"
              style={{
                width: "85%",
                backgroundColor: "#F8F6F1",
                color: "#0A122A",
                borderColor: "#E7DECD"
              }}
              disabled={!loginStatus}
            />
            <button
              className="btn w-25 ms-2"
              style={{ backgroundColor: "#698F3F", color: "#FBFAF8" }}
              onClick={handleSend}
              disabled={!loginStatus}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}