<script setup>
import { ref } from 'vue'
import { store } from '@/store'
import { setTheme } from '@/theme'

const show = ref(false);


function getActiveStyles(theme) {
	return {
		color: store.state.theme === theme ? 'var(--color-primary)' : undefined,
		backgroundColor: store.state.theme === theme ? 'var(--app-cell-active-background)' : undefined
	}
}

function handleCellClick(theme) {
	setTheme(theme);
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
</style>
