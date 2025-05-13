import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const aspect = window.innerWidth / window.innerHeight;
    const bgGeometry = new THREE.PlaneGeometry(20 * aspect, 20);
    const bgMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: createGradientTexture(128), // Updated with light gradient colors
    });
    const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
    bgPlane.position.z = -5;
    scene.add(bgPlane);

    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount); // For varying sizes

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArray[i3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i3 + 2] = r * Math.cos(phi);
      scaleArray[i] = Math.random() * 0.1 + 0.05;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    particlesGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    const particleTexture = createCircleTexture(16);
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      blending: THREE.NormalBlending,
      opacity: 0.7,
      color: 0xffffff,
      sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    let lastTime = 0;
    const animate = (time) => {
      requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      if (delta > 0.016) {
        particlesMesh.rotation.y += 0.002 * delta * 60; // Faster rotation
        lastTime = time;
      }

      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      bgPlane.scale.set(width / height, 1, 1);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
    };
  }, []);

  function createCircleTexture(size = 16) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // White center
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Fade to transparent

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createGradientTexture(size = 128) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, size, size, 0);
    gradient.addColorStop(0, "rgba(102, 153, 204, 0.9)"); // Slightly darker light blue
    gradient.addColorStop(0.3, "rgba(102, 204, 102, 0.8)"); // Slightly darker light green
    gradient.addColorStop(0.7, "rgba(153, 102, 153, 0.7)"); // Slightly darker light purple
    gradient.addColorStop(1, "rgba(192, 192, 192, 0)"); // Fade to darker light gray

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default AnimatedBackground;
