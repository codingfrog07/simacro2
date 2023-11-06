import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  // Viewer 페이지로 이동
  const toViewer = () => {
    navigate("/viewer");
  };

  // 랜딩 페이지 UI 렌더링
  return (
    <div className="landing">
      <div className="landingWrap">
        <div className="landingTitleWrap">
          <h1 className="landingTitle">Interactive 3D Model Viewer</h1>
        </div>
        <div className="landingContentWrap">
          <p className="landingContent1">Welcome to our 3D Model Viewer!</p>
          <p className="landingContent2">
            Our viewer allows you to upload GLB files and toggle different
            lighting settings such as ambient, directional lights.
            <br />
            Easily adjust background colors, model scales, and experience the
            dynamic rotation of models.
          </p>
          <p className="landingContent3">Click the button to start!</p>
        </div>
        <div className="startBtnWrap">
          <button className="startBtn" onClick={toViewer}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
