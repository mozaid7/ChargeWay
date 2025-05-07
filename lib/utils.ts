import type React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This is a polyfill for createRoot in the browser environment
// In a real app, you would use ReactDOM.createRoot directly
export function document_createRoot(container: HTMLElement) {
  return {
    render(element: React.ReactNode) {
      // This is a simplified version for the demo
      // In a real app, you would use ReactDOM.createRoot
      container.innerHTML = ""
      const div = document.createElement("div")
      container.appendChild(div)

      // In a real implementation, this would render the React element
      // For demo purposes, we're just setting some content
      if (element) {
        div.innerHTML = "Marker/Popup Content"
      }
    },
  }
}
