<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
import { GuideEntry } from '@/plugins/guide'
import type { CodexCategory } from '@/types'
</script>

<template>
  <MainCard />
  <DescriptionCard />

  <!-- Extra Website -->
  <ToolCards />
  <GuideCard v-if="ge.exist" />

  <StatsCard />
  <AbilityCard />
  <DropsCard name="abilities" text />
  <DropsCard name="causes" chip />
  <DropsCard name="gives" chip />
  <DropsCard name="cures" chip />
  <DropsCard name="immunities" chip />
  <DropsCard name="skills" />
  <DropsCard name="dropped_by" />
  <DropsCard name="drops" />
  <DropsCard name="summons" chip />
  <DropsCard name="upgrade_materials" />
  <DropsCard name="learned_by" />
  <DropsCard name="requirements" />
  <DropsCard name="celestial_classes" />
  <BestialBondCard />
  <MaterialCard />
  <SpellCard />
  <OffhandItemsCard />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    category: {
      type: String as PropType<CodexCategory>,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: {
        guide: false
      }
    }
  },
  computed: {
    ce() {
      return new CodexEntry(this.category, this.id)
    },
    ge() {
      return new GuideEntry(this.ce)
    }
  },
  provide() {
    return {
      view: computed(() => {
        return this.ce
      }),
      guide: computed(() => {
        return this.ge
      })
    }
  }
})
</script>
