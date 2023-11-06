import React, { useState } from "react";
import ModelViewer from "../ModelViewer";

const Viewer = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  // 모델 파일 선택 이벤트 함수
  const handleModelSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedModel(URL.createObjectURL(file)); //선택된 파일의 URL 저장
    }
  };

  return (
    <div className="viewer">
      <header className="viewer-header">
        <h1>Interactive 3D Model Viewer</h1>
        {/* 파일 선택 업로드 input */}
        <input
          className="fileInput"
          type="file"
          accept=".glb"
          onChange={handleModelSelect}
        />
        {/* 모델 파일 선택한 경우에만 ModelViewer 렌더링 */}
        {selectedModel && <ModelViewer model={selectedModel} />}
      </header>
    </div>
  );
};

export default Viewer;
