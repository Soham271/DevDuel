import React from "react";
import CustomButton from "@/components/CustomButton";
import JoinBattle from "./JoinBattle";

const EditorPanel = () => {
  return (
    <EditorPanel>
      <MonacoEditor
        height="400px"
        language={language}
        value={code}
        onChange={(val) => setCode(val || "")}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
      <div style={{ marginTop: "10px" }}>
        <CustomButton onClick={runCode} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </CustomButton>
        <OutputBox>{output}</OutputBox>
      </div>
    </EditorPanel>
  );
};

export default EditorPanel;
