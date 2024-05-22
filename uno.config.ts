import { defineConfig, presetUno } from 'unocss'
import { presetVarlet } from '@varlet/preset-unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetUno(), presetVarlet(), presetIcons()]
})
