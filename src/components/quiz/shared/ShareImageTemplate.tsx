import React, { forwardRef } from "react";
import { Router, useNavigate } from "react-router-dom";

interface ShareImageTemplateProps {
  imageSrc: string;
  title: string;
  mainTitle: string;
  description: string;
  websiteUrl: string;
  userName?: string;
  scale?: number;
  imageMode?: boolean;
}

const ShareImageTemplate = forwardRef<HTMLDivElement, ShareImageTemplateProps>(
  ({ imageSrc, title, mainTitle, description, websiteUrl, userName, scale = 1, imageMode = false }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "1080px",
          height: "1920px",
          overflow: "hidden",
          backgroundImage: "url('/quiz/results/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "60px 100px",
          }}>
          <div
            style={{
              width: "90%",
              height: "80px",
              backgroundImage: "url('/quiz/results/divider_top.png')",
              backgroundSize: "fill",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div style={{ textAlign: "center", color: "white" }}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 300,
                color: "#36242D",
                fontFamily: "'Kaisei Decol', serif",
              }}>
              {title}
            </h2>
            <h1
              style={{
                fontSize: "70px",
                paddingBottom: "8px",
                fontFamily: "'Kaisei Decol', serif",
                textShadow: "0px 0px 8px rgba(0,0,0,1)",
              }}>
              {mainTitle}
            </h1>
          </div>
          <div
            style={{
              width: "586px",
              height: "586px",
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "100px",
            }}
          />
          <div style={{ textAlign: "center", color: "white", padding: "0 30px" }}>
            <p
              style={{
                fontSize: "32px",
                fontFamily: "'Kaisei Decol', serif",
                textShadow: "0px 0px 8px rgba(0,0,0,1)",
                // filter property removed
              }}>
              {description}
            </p>
          </div>
          <div
            style={{
              width: "90%",
              height: "30px",
              backgroundImage: "url('/quiz/results/divider_mid.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {!imageMode && (
            <p
              style={{
                fontSize: "32px",
                color: "#36242D",
                fontFamily: "'Kaisei Decol', serif",
              }}>
              Wanna read the full story about you and him?
            </p>
          )}
          {!imageMode && (
            <a
              href="/"
              style={{
                fontFamily: "'Comme', sans-serif",
                fontSize: "34px",
                color: "#FF87A1",
                cursor: "pointer",
                backgroundColor: "white",
                width: "395px",
                height: "108px",
                borderRadius: "9999px",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 0 rgba(255, 135, 161, 0.7)",
                animation: "glow 2s infinite",
              }}>
              LET'S GO
            </a>
          )}
          <style>
            {`
              @keyframes glow {
                0% {
                  box-shadow: 0 0 0 0 rgba(255, 135, 161, 0.7);
                }
                50% {
                  box-shadow: 0 0 30px 0 rgba(255, 135, 161, 0.4);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(255, 135, 161, 0.7);
                }
              }
            `}
          </style>
          <p
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "28px",
              color: "#fff",
              fontFamily: "'Kaisei Decol', serif",
              textShadow: "0px 0px 8px rgba(0,0,0,1)",
              // filter property removed
            }}>
            Find your Book Soulmate at:
            <br />
            <a
              href="https://cherryromance.vercel.app/quiz/book-bf"
              style={{
                textDecoration: "underline",
              }}>
              cherryromance.vercel.app/quiz/book-bf
            </a>
          </p>
        </div>
      </div>
    );
  }
);

ShareImageTemplate.displayName = "ShareImageTemplate";

export default ShareImageTemplate;
