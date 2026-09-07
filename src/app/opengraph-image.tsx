import { ImageResponse } from "next/og";

export const alt =
  "4HOME — меблі на замовлення у Києві";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#171615",
          color: "#F6F3EF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-110px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "1px solid rgba(154, 104, 69, 0.30)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-90px",
            right: "-20px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            border: "1px solid rgba(154, 104, 69, 0.22)",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              4HOME
            </div>

            <div
              style={{
                fontSize: "18px",
                color: "#B8B0A8",
                letterSpacing: "0.12em",
              }}
            >
              KYIV
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "900px",
            }}
          >
            <div
              style={{
                marginBottom: "22px",
                fontSize: "18px",
                letterSpacing: "0.16em",
                color: "#B88968",
              }}
            >
              МЕБЛІ ЗА ІНДИВІДУАЛЬНИМИ РОЗМІРАМИ
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "66px",
                lineHeight: 1.03,
                fontWeight: 650,
                letterSpacing: "-0.045em",
              }}
            >
              <span>Меблі для вашого</span>
              <span>простору.</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "21px",
                color: "#C9C2BB",
              }}
            >
              Кухні · шафи · корпусні меблі
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "18px",
                color: "#B8B0A8",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "1px",
                  background: "#9A6845",
                }}
              />

              4home.kyiv.ua
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}