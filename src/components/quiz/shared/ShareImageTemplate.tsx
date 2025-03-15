import React, { forwardRef } from "react";

interface ShareImageTemplateProps {
  imageSrc: string;
  title: string;
  mainTitle: string;
  description: string;
  websiteUrl: string;
  userName?: string;
  scale?: number;
}

const ShareImageTemplate = forwardRef<HTMLDivElement, ShareImageTemplateProps>(
  ({ imageSrc, title, mainTitle, description, websiteUrl, userName, scale = 1 }, ref) => {
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
                fontWeight: 700,
                fontFamily: "'Kaisei Decol', serif",
                textShadow: "0px 0px 8px rgba(0,0,0,1)",
                // filter property removed
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
          <p
            style={{
              fontSize: "32px",
              color: "#36242D",
              fontFamily: "'Kaisei Decol', serif",
            }}>
            Wanna read the full story about you and him?
          </p>
          <button
            type="submit"
            style={{
              fontFamily: "'Comme', sans-serif",
              fontSize: "34px",
              color: "#FF87A1",
              cursor: "pointer",
              backgroundColor: "white",
              width: "395px",
              height: "108px",
              borderRadius: "9999px",
              transition: "box-shadow 1.5s, transform 0.3s",
              animation: "pulse-glow 2s ease-in-out infinite",
              whiteSpace: "nowrap",
            }}>
            LET'S GO
          </button>
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
            <a href="https://cherryromance.vercel.app/quiz/book-bf">cherryromance.vercel.app/quiz/book-bf</a>
          </p>
        </div>
      </div>
    );
  }
);

export default ShareImageTemplate;
