import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";

const Overlay = styled(Dialog.Overlay)`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 10;
`;

const Content = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 11;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
`;

const CodeText = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a73e8;
  background-color: #f1f3f4;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  margin: 1rem auto 0.5rem;
  display: inline-block;

  &:hover {
    background-color: #e2e5e9;
  }
`;

const CopyHint = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
`;

const CopiedAlert = styled.div`
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 1rem;
  animation: fadeInOut 2s ease-in-out;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-10px); }
  }
`;

function ContestCodeModal({ open, onOpenChange, contestCode }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contestCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide after 2s
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Contest Created Successfully!</h2>
          <CodeText onClick={copyToClipboard}>{contestCode}</CodeText>
          <CopyHint>Click the code to copy</CopyHint>
          {copied && <CopiedAlert>Code copied to clipboard!</CopiedAlert>}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ContestCodeModal;
