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
      const elements = Array.from(
        document.querySelectorAll("code.language-mermaid, pre.language-mermaid, .notion-code.language-mermaid, pre:has(code.language-mermaid)")
      ) as HTMLElement[]

      if (mermaid.render !== undefined && elements.length > 0) {
        resolve(elements)
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
          const targetContainer =
            element.tagName === "CODE" && element.parentElement?.tagName === "PRE"
              ? (element.parentElement as HTMLElement)
              : element

          const codeContent = memoMermaid.get(i) || element.textContent || ""
          if (!codeContent.trim()) return

          if (!memoMermaid.has(i)) {
            setMemoMermaid((prev) => new Map(prev).set(i, codeContent))
          }

          try {
            const id = `mermaid-${i}-${Math.random().toString(36).substring(2, 9)}`
            const { svg } = await mermaid.render(id, codeContent)
            targetContainer.innerHTML = svg
            targetContainer.style.backgroundColor = "transparent"
            targetContainer.style.display = "flex"
            targetContainer.style.justifyContent = "center"
            targetContainer.style.overflow = "auto"
          } catch (err) {
            console.warn("Mermaid render error:", err)
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
