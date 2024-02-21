<script setup>
import { global } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" border v-for="item in codex">
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${item['icon']}`" />
    </template>
    <template v-if="item['tier'] !== undefined">
    {{ item['name'] }}
    <var-chip type="warning" :size="chipSize" :round="false" plain>
      {{ global.star + item['tier'] }}
    </var-chip>
    <br>
  </template>
    <span v-if="item['chance'] !== undefined">
      {{ `${item['name']} (${item['chance']})` }}
    </span>
    <span v-else>
      {{ `${item['name']}` }}
    </span>
  </var-cell>
</template>

<script>
export default {
  props: {
    codex: {
      type: Object,
    },
  },
  data() {
    return {
      chipSize: "small",
    }
  }
}
</script>