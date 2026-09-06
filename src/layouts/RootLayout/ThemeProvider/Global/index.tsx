import { Global as _Global, css } from "@emotion/react"

import { pretendard } from "src/assets"

export const Global = () => {
  return (
    <_Global
      styles={css`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          /* 색 값은 tailwind.css의 토큰 한 곳에서만 나온다. */
          color: rgb(var(--fg));
          background-color: rgb(var(--bg));
          font-family: ${pretendard.style.fontFamily};
          font-weight: ${pretendard.style.fontWeight};
          font-style: ${pretendard.style.fontStyle};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "ss01", "cv01";
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        * {
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          font-weight: inherit;
          font-style: inherit;
          /* 한국어 줄바꿈: 어절 단위로 끊는다. */
          word-break: keep-all;
        }

        a {
          all: unset;
          cursor: pointer;
        }

        ul {
          padding: 0;
        }

        button {
          all: unset;
          cursor: pointer;
        }

        input {
          all: unset;
          box-sizing: border-box;
        }

        textarea {
          border: none;
          background-color: transparent;
          font-family: inherit;
          padding: 0;
          outline: none;
          resize: none;
          color: inherit;
        }

        hr {
          width: 100%;
          border: none;
          margin: 0;
          border-top: 1px solid rgb(var(--line));
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgb(var(--line-strong));
          border: 3px solid transparent;
          background-clip: content-box;
          border-radius: 999px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}
    />
  )
}
