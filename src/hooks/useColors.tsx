import { createContext, useContext, useState, useEffect } from 'react'

const RainbowContext = createContext({} as PropsColorsProvider)

interface PropsColorsProvider {
  color: string
}

export const ColorsProvider = ({ children }): JSX.Element => {
  const [color, setColor] = useState('#ffffff')

  function rgbToHex(r: number, g: number, b: number) {
    return ((r << 16) | (g << 8) | b).toString(16)
  }
  let r = 50
  let g = 150
  let b = 200

  useEffect(() => {
    const interval = setInterval(() => {
      if (r > 0 && b === 0) {
        r--
        g++
      }
      if (g > 0 && r === 0) {
        g--
        b++
      }
      if (b > 0 && g === 0) {
        r++
        b--
      }
      setColor('#' + rgbToHex(r, g, b))
    }, 10)
    return () => clearInterval(interval)
  }, [])

  return <RainbowContext.Provider value={{ color }}>{children}</RainbowContext.Provider>
}

export function useColors(): PropsColorsProvider {
  return useContext(RainbowContext)
}
