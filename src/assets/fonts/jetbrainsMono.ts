import { JetBrains_Mono } from "next/font/google"

// 코드·날짜·태그 같은 메타 정보용. 한글 글리프는 없어서 본문은 Pretendard가 맡는다.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})
