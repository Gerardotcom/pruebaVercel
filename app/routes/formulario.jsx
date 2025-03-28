import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function ConfirmationScreen() {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      dx: Math.random() * 0.2 - 0.1,
      dy: Math.random() * 0.2 - 0.1,
    }));
    setParticles([...particlesRef.current]);

    const animateParticles = () => {
      particlesRef.current.forEach((p) => {
        p.x = (p.x + p.dx + 100) % 100;
        p.y = (p.y + p.dy + 100) % 100;
      });
      setParticles([...particlesRef.current]);
      requestAnimationFrame(animateParticles);
    };

    const animationId = requestAnimationFrame(animateParticles);

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleContinue = () => {
    navigate("/landingPage");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F8F9FC",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Partículas*/}
      {particles.map((p, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `rgba(37, 99, 235, ${p.opacity})`,
            borderRadius: "50%",
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}

      
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          zIndex: 1,
          position: "relative",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1947BA",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#ffffff"
            style={{ width: "40px", height: "40px" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
          Número de teléfono verificado
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            marginBottom: "30px",
            lineHeight: "1.5",
          }}
        >
          Felicitaciones, su número de teléfono ha sido verificado. Puedes empezar a usar la aplicación.
        </p>

        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: "#1947BA",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "14px",
            borderRadius: "24px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
