import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ModelViewer = ({ model }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const lightRef = useRef();

  const [modelScale, setModelScale] = useState(1);
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0 });
  const [loadedModel, setLoadedModel] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [lightType, setLightType] = useState("ambient"); // 기본값: ambient light

  // 배경색 변경 함수
  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  // 조명 유형 변경 함수
  const handleLightTypeChange = (type) => {
    setLightType(type);
  };

  // 모델 회전 방향 변경 함수
  const handleRotate = (axis, angle) => {
    if (loadedModel) {
      switch (axis) {
        case "up":
          loadedModel.rotation.x += angle;
          break;
        case "down":
          loadedModel.rotation.x -= angle;
          break;
        case "left":
          loadedModel.rotation.y += angle;
          break;
        case "right":
          loadedModel.rotation.y -= angle;
          break;
        default:
          break;
      }
      setModelRotation({
        x: loadedModel.rotation.x,
        y: loadedModel.rotation.y,
      });
    }
  };

  // 모델 확대 함수
  const handleZoomIn = () => {
    setModelScale((prevScale) => prevScale * 1.2);
  };

  // 모델 축소 함수
  const handleZoomOut = () => {
    setModelScale((prevScale) => prevScale * 0.9);
  };

  // 모델 상태 변화 업데이트
  useEffect(() => {
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Three.js 사용해서 3D 모델 렌더링 scene 생성
    const scene = new THREE.Scene();

    // 선택 조명 유형 정보
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.target.position.set(-5, 0, 0);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);

    let selectedLight;
    switch (lightType) {
      case "ambient":
        selectedLight = ambientLight;
        break;
      case "directional":
        selectedLight = directionalLight;
        break;
      case "point":
        selectedLight = pointLight;
        break;
      default:
        selectedLight = ambientLight;
    }

    scene.add(selectedLight);
    lightRef.current = selectedLight;

    // Three.js  카메라 설정
    const aspectRatio = 1200 / 600;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 0, 800);

    // WebGLRenderer 생성 및 캔버스 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    const canvasWidth = 1200;
    const canvasHeight = 600;
    renderer.setSize(canvasWidth, canvasHeight);
    containerRef.current.appendChild(renderer.domElement);

    rendererRef.current = renderer;

    // 3D 모델 로딩
    const loader = new GLTFLoader();
    loader.load(model, (gltf) => {
      const loadedModel = gltf.scene;
      const bbox = new THREE.Box3().setFromObject(loadedModel); //바운딩 박스 계산
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());

      const maxSize = Math.max(size.x, size.y, size.z);
      const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * 75) / 360));
      const fitWidthDistance = fitHeightDistance / aspectRatio;

      const distance = Math.max(fitHeightDistance, fitWidthDistance);

      camera.position.copy(center);
      camera.position.z += distance; // 적절한 거리로 카메라 위치 설정
      camera.lookAt(center); // 카메라가 모델을 보도록 설정

      loadedModel.scale.set(modelScale, modelScale, modelScale);
      loadedModel.rotation.x = modelRotation.x;
      loadedModel.rotation.y = modelRotation.y;
      scene.add(loadedModel);
      setLoadedModel(loadedModel);
    });

    // 모델의 크기, 배경색, 카메라 구도 변경값 적용 함수
    const animate = () => {
      requestAnimationFrame(animate);

      if (loadedModel) {
        loadedModel.scale.set(modelScale, modelScale, modelScale);
      }

      const currentRenderer = rendererRef.current;
      currentRenderer.setClearColor(new THREE.Color(backgroundColor));
      currentRenderer.render(scene, camera);
    };

    animate();
  }, [model, modelScale, backgroundColor, lightType]);

  return (
    <div className="modelViewer">
      <div className="modelViewerMenuWrap">
        {/* 배경색 변경 input */}
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
        <div class="division-line"></div>
        <div className="rotateMenuWrap">
          <button
            className="rotateBtnUp"
            onClick={() => handleRotate("up", 0.1)}
          >
            Up
          </button>
          <button
            className="rotateBtnDown"
            onClick={() => handleRotate("down", 0.1)}
          >
            Down
          </button>
          <button
            className="rotateBtnLeft"
            onClick={() => handleRotate("left", 0.1)}
          >
            Left
          </button>
          <button
            className="rotateBtnRight"
            onClick={() => handleRotate("right", 0.1)}
          >
            Right
          </button>
        </div>
        <div class="division-line"></div>
        <div className="zoomMenuWrap">
          <button className="zoomInBtn" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="zoomOutBtn" onClick={handleZoomOut}>
            Zoom Out
          </button>
        </div>
        <div class="division-line"></div>
        <div className="lightMenuWrap">
          <button
            className="ambientBtn"
            onClick={() => handleLightTypeChange("ambient")}
          >
            Ambient Light
          </button>
          <button
            className="directionalBtn"
            onClick={() => handleLightTypeChange("directional")}
          >
            Directional Light
          </button>
          <button
            className="pointBtn"
            onClick={() => handleLightTypeChange("point")}
          >
            Point Light
          </button>
        </div>
      </div>
      {/* 3D 모델 캔버스 렌더링 */}
      <div className="canvasModelViewer" ref={containerRef}></div>
    </div>
  );
};

export default ModelViewer;
