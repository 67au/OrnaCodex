<template>
  <var-link :href="link" target="_blank" underline="none">
    <var-button text-color="#fff" text round>
      <div class="i-mdi-github text-xl" />
    </var-button>
  </var-link>
  <var-popup>
  </var-popup>
</template>

<script lang="ts">
export default {
  props: {
    link: {
      type: String,
    }
  }
}
</script>