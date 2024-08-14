import { defineConfig, presetUno } from 'unocss'
import { presetVarlet } from '@varlet/preset-unocss'
import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'

export default defineConfig({
  presets: [
    presetUno(),
    presetVarlet(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: ['Open Sans:500,700']
      }
    })
  ]
})
