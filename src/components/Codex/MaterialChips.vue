<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})
</script>

<template>
  <div class="d-flex flex-wrap ga-1">
    <v-chip
      v-for="ent in props.entry.upgradeMaterialsList"
      :key="ent.url"
      :text="ent.name"
      color="default"
      variant="text"
      rounded="lg"
      border="sm"
      size="small"
      class="bg-surface-light"
    >
      <template v-slot:prepend>
        <v-avatar :rounded="false" class="mr-1">
          <v-img :src="ent.iconUrl" class="image-render-pixel"></v-img>
        </v-avatar>
      </template>
    </v-chip>
  </div>
</template>
