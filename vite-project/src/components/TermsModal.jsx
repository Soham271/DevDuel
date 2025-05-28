import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: black;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style: disc;
  padding-left: 20px;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  margin-top: 1.5rem;
  cursor: pointer;
`;

const TermsModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Terms and Conditions</Title>
        <List>
          <li>Do not use any unfair means or external help to solve the problems.</li>
          <li>Each submission will be monitored for plagiarism.</li>
          <li>Your score will be deducted for wrong or repeated submissions.</li>
          <li>Please read each problem carefully before solving.</li>
          <li>Respect the contest rules and behave professionally.</li>
          <li>Any attempt to exploit vulnerabilities may result in disqualification.</li>
          <li>Once started, the contest timer cannot be paused or reset.</li>
        </List>
        <Button onClick={onClose}>I Understand</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TermsModal;
