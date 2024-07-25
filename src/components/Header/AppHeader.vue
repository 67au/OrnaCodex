<template>
  <header>
    <var-app-bar safe-area-top elevation fixed z-index="500">
      <var-link to="/" underline="none" text-color="#fff" text-size="16">
        {{ title }}
      </var-link>
      <template #right>
        <var-space size="2px">
          <slot name="right"></slot>
        </var-space>
      </template>
    </var-app-bar>
  </header>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    title: {
      type: String
    }
  }
})
</script>
