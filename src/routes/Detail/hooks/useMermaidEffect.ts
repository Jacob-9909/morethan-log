import mermaid from "mermaid"
import { useEffect, useState } from "react"
import useScheme from "src/hooks/useScheme"

/**
 * Wait for mermaid elements to be defined in the DOM
 */
const waitForMermaid = (interval = 100, timeout = 5000) => {
  return new Promise<HTMLElement[]>((resolve, reject) => {
    const startTime = Date.now()

    const checkMermaidCode = () => {
      const pres = Array.from(document.querySelectorAll("pre")).filter((pre) => {
        return (
          pre.classList.contains("language-mermaid") ||
          pre.querySelector("code.language-mermaid") !== null
        )
      }) as HTMLElement[]

      if (mermaid.render !== undefined && pres.length > 0) {
        resolve(pres)
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error(`mermaid is not defined within the timeout period.`))
      } else {
        setTimeout(checkMermaidCode, interval)
      }
    }
    checkMermaidCode()
  })
}

const useMermaidEffect = () => {
  const [scheme] = useScheme()
  const [memoMermaid, setMemoMermaid] = useState<Map<number, string>>(new Map())

  useEffect(() => {
    if (typeof window === "undefined") return

    mermaid.initialize({
      startOnLoad: false,
      theme: scheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    })

    waitForMermaid()
      .then(async (elements) => {
        const promises = elements.map(async (element, i) => {
          const rawText = memoMermaid.get(i) || element.textContent || ""
          const codeContent = rawText
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/\u00A0/g, " ")
            .trim()

          if (!codeContent) return

          if (!memoMermaid.has(i)) {
            setMemoMermaid((prev) => new Map(prev).set(i, rawText))
          }

          try {
            const id = `mermaid-${i}-${Math.random().toString(36).substring(2, 9)}`
            const { svg } = await mermaid.render(id, codeContent)
            element.innerHTML = svg
            element.style.backgroundColor = "transparent"
            element.style.display = "flex"
            element.style.justifyContent = "center"
            element.style.overflow = "auto"
          } catch (err) {
            console.warn("Mermaid render error:", err)
            // Remove error elements appended by mermaid to document body
            document.querySelectorAll(`[id^="dmermaid"]`).forEach((el) => el.remove())
          }
        })
        await Promise.all(promises)
      })
      .catch(() => {
        // No mermaid elements on page or timeout
      })
  }, [scheme])

  return
}

export default useMermaidEffect
