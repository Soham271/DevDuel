import styled from "styled-components";
import { motion } from "framer-motion";
//for create context modal
// Base container
export const Container = styled(motion.div)`
  max-width: 420px;
  margin: 4rem auto;
  padding: 2.5rem;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
`;

export const Heading = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 1rem;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

export const SubmitButton = styled(motion.button)`
  padding: 12px;
  background-color: black;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const ModalMessage = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const ModalCode = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: #0070f3;
  cursor: pointer;
  user-select: none;
`;

export const CopyNote = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

export const CopiedToast = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: green;
  font-weight: 500;
`;
