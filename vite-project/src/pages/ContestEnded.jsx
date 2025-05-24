import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ContestEnded = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎉 Contest Submitted!</h1>
      <p>Your submission has been recorded. Thank you!</p>
    </div>
  );
}

export default ContestEnded;
