"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

export function GoogleTranslate() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'es', autoDisplay: false },
          'google_translate_element'
        )
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
        strategy="lazyOnload"
      />
    </>
  )
}
