import { useState , useContext} from "react";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import './CoolAI.css'
import { userLoginContext } from "../../contexts/UserLoginContext";

export default function CoolAI() {
  const {loginStatus, currentUser, setCurrentUser} = useContext(userLoginContext)
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const navigate = useNavigate(); 

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = () => {

    if (!loginStatus) {
      navigate('/access-denied')
      return;
    }


    if (input.toLowerCase() === "hi") {
      setOpen(false); 
      navigate("/ai-ingredients"); 
    }
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Tooltip content
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
            onClick={() => setOpen(!open)}
          >
            <HiSparkles size={30}/>
          </button>
        </OverlayTrigger>
      ) : (
        <div className="card p-4 shadow-lg" style={{ width: "22rem" }}>
          <button
            className="btn-close position-absolute top-0 end-0 m-2"
            onClick={() => setOpen(false)}
          ></button>
          
          {/* Title & Tagline */}
          <h4 className="text-center fw-bold">✨ disHcovery</h4>
          <p className="text-center text-muted">Turn your ingredients into a delicious surprise!</p>

          {/* Input Field */}
          <div className="d-flex align-items-center mt-3">
            <input
              type="text"
              placeholder="Text 'hi' to get started"
              value={input}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              className="form-control"
              style={{ width: "85%", textAlign: "center" }}
            />
            <button className="btn w-25 ms-2" style={{backgroundColor : "#698F3F"}} onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
