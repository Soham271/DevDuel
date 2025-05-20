import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Heading,
  StyledForm,
  Label,
  Input,
  Select,
  SubmitButton,
  ModalOverlay,
  ModalContent,
  ModalMessage,
  ModalCode,
  CopyNote,
  CopiedToast,
} from "@/components/styled";
import TermsModal from "@/components/TermsModal";

function CreateContest() {
  const user = useSelector((state) => state.user.user);
  const [CreateContestData, setCreateContestData] = useState({
    Title: "",
    Level: "",
    Duration: "",
    Language: "",
  });
  

  const [contestCode, setContestCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateContext = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions to create a contest.");
      return;
    }
    const code = Math.floor(10000000 + Math.random() * 90000000);
    setContestCode(code);

    try {
      await axios.post(
        "http://localhost:3004/api/v1/contest/create-contest",
        { ...CreateContestData, Code: code },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setShowModal(true);
    } catch (err) {
      console.error("Error creating contest:", err);
    }
  };

  const handleCodeClick = () => {
    navigator.clipboard.writeText(contestCode.toString());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowModal(false);
      navigate("/Join-Battle", { state: { contestCode } });
    }, 1500);
  };

  return (
    <Container
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Heading>Create Contest</Heading>
      <StyledForm onSubmit={handleCreateContext}>
        <Label>Contest Title</Label>
        <Input
          type="text"
          value={CreateContestData.Title}
          onChange={(e) =>
            setCreateContestData({ ...CreateContestData, Title: e.target.value })
          }
          required
        />

        <Label>Difficulty Level</Label>
        <Select
          value={CreateContestData.Level}
          onChange={(e) =>
            setCreateContestData({ ...CreateContestData, Level: e.target.value })
          }
          required
        >
          <option value="">--Select--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>

        <Label>Time Duration</Label>
        <Select
          value={CreateContestData.Duration}
          onChange={(e) =>
            setCreateContestData({ ...CreateContestData, Duration: e.target.value })
          }
          required
        >
          <option value="">--Select--</option>
          <option value="5min">5 Minutes</option>
          <option value="10min">10 Minutes</option>
          <option value="20min">20 Minutes</option>
          <option value="30min">30 Minutes</option>
          <option value="40min">40 Minutes</option>
          <option value="50min">50 Minutes</option>
          <option value="1hr">1 Hour</option>
        </Select>

        <Label>Programming Language</Label>
        <Select
          value={CreateContestData.Language}
          onChange={(e) =>
            setCreateContestData({ ...CreateContestData, Language: e.target.value })
          }
          required
        >
          <option value="">--Select--</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </Select>

        <Label style={{ marginTop: "1.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            style={{ marginRight: "0.5rem" }}
          />
          I accept the{" "}
          <span
            style={{ textDecoration: "underline", color: "#007bff", cursor: "pointer" }}
            onClick={() => setShowTermsModal(true)}
          >
            Terms and Conditions
          </span>
        </Label>

        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!termsAccepted}
          style={{
            opacity: termsAccepted ? 1 : 0.6,
            cursor: termsAccepted ? "pointer" : "not-allowed",
            marginTop: "1rem",
          }}
        >
          Create Contest
        </SubmitButton>
      </StyledForm>

      {/* Contest Created Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalMessage>Contest Created Successfully!</ModalMessage>
            <ModalCode onClick={handleCodeClick} style={{ cursor: "pointer" }}>
              {contestCode}
            </ModalCode>
            <CopyNote>Click on code to copy</CopyNote>
            {copied && <CopiedToast>Code copied successfully!</CopiedToast>}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Terms and Conditions Modal */}
      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </Container>
  );
}

export default CreateContest;
