<script setup lang="ts">
</script>

<template>
	<header class="app-header" safe-area-top>
		<var-app-bar elevation>
			<var-link to="/" text-color="#fff" underline="none" text-size="16">
				{{ title }}
			</var-link>
			<template #right>
				<var-space justify="flex-end" size="mini">
					<slot name="right" />
				</var-space>
			</template>
		</var-app-bar>
	</header>
</template>

<script lang="ts">
export default {
	props: {
    title: {
      type: String,
    },
  }
}
</script>

<style scoped>
.app-header {
	width: 100%;
	top: 0;
	left: 0;
	position: fixed;
	z-index: 300;
}
</style>