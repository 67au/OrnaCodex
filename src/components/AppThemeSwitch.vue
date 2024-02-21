<script setup>
import { ref } from 'vue'
import { StyleProvider, Themes } from '@varlet/ui'

import { store } from '@/store'

const show = ref(false);

const suppoertedThemes = {
	'md2-light': {},
	'md2-dark': Themes.dark,
	'md3-light': Themes.md3Light,
	'md3-dark': Themes.md3Dark,
};

store.state.theme = store.state.theme || 'md2-dark';

function addCustomTheme() {
  if (store.state.theme.endsWith('dark')) {
    suppoertedThemes[store.state.theme]['--highlight-color'] = 'var(--highlight-color-dark)'
  } else {
    suppoertedThemes[store.state.theme]['--highlight-color'] = 'var(--highlight-color-light)'
  }
}

addCustomTheme()
StyleProvider(suppoertedThemes[store.state.theme]);

function getActiveStyles(theme) {
	return {
		color: store.state.theme === theme ? 'var(--color-primary)' : undefined,
		backgroundColor: store.state.theme === theme ? 'var(--app-cell-active-background)' : undefined
	}
}

function handleCellClick(theme) {
	store.state.theme = theme;
  addCustomTheme()
	StyleProvider(suppoertedThemes[theme]);
	show.value = false;
}
</script>

<template>
	<var-menu close-on-click-reference placement="bottom" offset-y="2vmin" v-model:show="show">
		<var-button class="app-switch" text-color="#fff" text round>
			<var-icon class="app-switch-icon" name="palette" />
		</var-button>
		<template #menu>
			<var-cell ripple :style="getActiveStyles('md2-light')" @click="() => handleCellClick('md2-light')">
				MD2 Light
			</var-cell>
			<var-cell ripple :style="getActiveStyles('md2-dark')" @click="() => handleCellClick('md2-dark')">
				MD2 Dark
			</var-cell>
			<var-cell ripple :style="getActiveStyles('md3-light')" @click="() => handleCellClick('md3-light')">
				MD3 Light
			</var-cell>
			<var-cell ripple :style="getActiveStyles('md3-dark')" @click="() => handleCellClick('md3-dark')">
				MD3 Dark
			</var-cell>
		</template>
	</var-menu>
</template>

<style scoped>
.app-switch {
	:is(-icon) {
		font-size: var(--font-size-lg);
	}
}

.app-switch {
	:is(-icon) {
		font-size: var(--font-size-lg);
	}
}
</style>