import React from "react";
import { CustomButtonWrapper } from "./StyledComponents.js";
const CustomButton = ({ children, ...props }) => (
  <CustomButtonWrapper>
    <button className="button" {...props}>
      <div className="button-outer">
        <div className="button-inner">
          <span>{children}</span>
        </div>
      </div>
    </button>
  </CustomButtonWrapper>
);

export default CustomButton;