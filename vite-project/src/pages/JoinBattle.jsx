import React from "react";
import { useLocation } from "react-router-dom";
const JoinBattle = () => {
  const location = useLocation();
  const code = location.state?.contestCode;
  return (
    <div>
      <h1>hello welcome to join battle: </h1>
      {code ? <h2>Contest Code:-{code}</h2> : <h3>No Code is Provided</h3>}
    </div>
  );
};

export default JoinBattle;
