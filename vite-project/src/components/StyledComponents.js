// src/components/StyledComponents.js
import styled from "styled-components";
//for join battle page
export const PageWrapper = styled.div`
  display: flex;
  padding: 30px;
  gap: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f6f8;
  min-height: 100vh;
`;

export const ProblemPanel = styled.div`
  width: 40%;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const EditorPanel = styled.div`
  width: 60%;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const Title = styled.h2`
  font-size: 22px;
  color: #333;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
`;

export const FormatText = styled.pre`
  font-size: 14px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
`;

export const StyledButton = styled.button`
  padding: 1em 2em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  margin: 5px;

  &:hover {
    background-color: #23c483;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-5px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const OutputBox = styled.pre`
  margin-top: 10px;
  padding: 10px;
  background: #f6f6f6;
  border-radius: 5px;
  font-size: 14px;
`;

export const CustomButtonWrapper = styled.div`
  .button {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;
    border-radius: 100em;
    background-color: rgba(0, 0, 0, 0.75);
    box-shadow:
      -0.15em -0.15em 0.15em -0.075em rgba(5, 5, 5, 0.25),
      0.0375em 0.0375em 0.0675em 0 rgba(5, 5, 5, 0.1);
  }

  .button::after {
    content: "";
    position: absolute;
    z-index: 0;
    width: calc(100% + 0.3em);
    height: calc(100% + 0.3em);
    top: -0.15em;
    left: -0.15em;
    border-radius: inherit;
    background: linear-gradient(
      -135deg,
      rgba(5, 5, 5, 0.5),
      transparent 20%,
      transparent 100%
    );
    filter: blur(0.0125em);
    opacity: 0.25;
    mix-blend-mode: multiply;
  }

  .button .button-outer {
    position: relative;
    z-index: 1;
    border-radius: inherit;
    transition: box-shadow 300ms ease;
    will-change: box-shadow;
    box-shadow:
      0 0.05em 0.05em -0.01em rgba(5, 5, 5, 1),
      0 0.01em 0.01em -0.01em rgba(5, 5, 5, 0.5),
      0.15em 0.3em 0.1em -0.01em rgba(5, 5, 5, 0.25);
  }

  .button:hover .button-outer {
    box-shadow:
      0 0 0 0 rgba(5, 5, 5, 1),
      0 0 0 0 rgba(5, 5, 5, 0.5),
      0 0 0 0 rgba(5, 5, 5, 0.25);
  }

  .button-inner {
    --inset: 0.035em;
    position: relative;
    z-index: 1;
    border-radius: inherit;
    padding: 1em 1.5em;
    background-image: linear-gradient(
      135deg,
      rgba(230, 230, 230, 1),
      rgba(180, 180, 180, 1)
    );
    transition:
      box-shadow 300ms ease,
      clip-path 250ms ease,
      background-image 250ms ease,
      transform 250ms ease;
    will-change: box-shadow, clip-path, background-image, transform;
    overflow: clip;
    clip-path: inset(0 0 0 0 round 100em);
    box-shadow:
      0 0 0 0 inset rgba(5, 5, 5, 0.1),
      -0.05em -0.05em 0.05em 0 inset rgba(5, 5, 5, 0.25),
      0 0 0 0 inset rgba(5, 5, 5, 0.1),
      0 0 0.05em 0.2em inset rgba(255, 255, 255, 0.25),
      0.025em 0.05em 0.1em 0 inset rgba(255, 255, 255, 1),
      0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
      -0.075em -0.25em 0.25em 0.1em inset rgba(5, 5, 5, 0.25);
  }

  .button:hover .button-inner {
    clip-path: inset(
      clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px)
        clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) round 100em
    );
    box-shadow:
      0.1em 0.15em 0.05em 0 inset rgba(5, 5, 5, 0.75),
      -0.025em -0.03em 0.05em 0.025em inset rgba(5, 5, 5, 0.5),
      0.25em 0.25em 0.2em 0 inset rgba(5, 5, 5, 0.5),
      0 0 0.05em 0.5em inset rgba(255, 255, 255, 0.15),
      0 0 0 0 inset rgba(255, 255, 255, 1),
      0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
      -0.075em -0.12em 0.2em 0.1em inset rgba(5, 5, 5, 0.25);
  }

  .button .button-inner span {
    position: relative;
    z-index: 4;
    font-family: "Inter", sans-serif;
    letter-spacing: -0.05em;
    font-weight: 500;
    color: rgba(0, 0, 0, 0);
    background-image: linear-gradient(
      135deg,
      rgba(25, 25, 25, 1),
      rgba(75, 75, 75, 1)
    );
    -webkit-background-clip: text;
    background-clip: text;
    transition: transform 250ms ease;
    display: block;
    will-change: transform;
    text-shadow: rgba(0, 0, 0, 0.1) 0 0 0.1em;
    user-select: none;
  }

  .button:hover .button-inner span {
    transform: scale(0.975);
  }

  .button:active .button-inner {
    transform: scale(0.975);
  }
`;
