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
  const navigate = useNavigate();

  const handleCreateContext = async (e) => {
    e.preventDefault();
    const code = Math.floor(10000000 + Math.random() * 90000000);
    setContestCode(code);

    try {
      await axios.post(
        "http://localhost:3004/api/v1/contenst/create-contest",
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
        />

        <Label>Difficulty Level</Label>
        <Select
          value={CreateContestData.Level}
          onChange={(e) =>
            setCreateContestData({ ...CreateContestData, Level: e.target.value })
          }
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
        >
          <option value="">--Select--</option>
          <option value="1min">1 Minute</option>
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
        >
          <option value="">--Select--</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </Select>

        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Contest
        </SubmitButton>
      </StyledForm>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalMessage>Contest Created Successfully!</ModalMessage>
            <ModalCode onClick={handleCodeClick}>{contestCode}</ModalCode>
            <CopyNote>Click on code to copy</CopyNote>
            {copied && <CopiedToast>Code copied successfully!</CopiedToast>}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default CreateContest;
