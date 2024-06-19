<template>
  <div class="text-xl" :class="iconClass" />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    iconClass: {
      type: String,
      default: ''
    }
  }
})
</script>
