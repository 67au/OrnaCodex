<template>
	<var-link :href="link" target="_blank" underline="none">
		<var-button class="app-switch" text-color="#fff" text round>
			<var-icon class="app-switch-icon" name="github" />
		</var-button>
	</var-link>
</template>

<script>
export default {
	props: ['link']
}
</script>

<style scoped>
.app-switch {
	:is(-icon) {
		font-size: var(--font-size-lg);
	}
}
</style>