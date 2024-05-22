<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import { GuideEntry } from '@/plugins/guide';
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
  <DropsCard name="skills" />
  <DropsCard name="dropped_by" />
  <DropsCard name="drops" />
  <DropsCard name="causes" chance />
  <DropsCard name="gives" chance />
  <DropsCard name="cures" chance />
  <DropsCard name="immunities" chance />
  <DropsCard name="summons" chance />
  <DropsCard name="upgrade_materials" />
  <DropsCard name="bestial_bond" text />
  <DropsCard name="learned_by" />
  <DropsCard name="requirements" />
  <DropsCard name="celestial_classes" />
  <MaterialCard />
  <SpellCard />
  <OffhandItemsCard />
</template>

<script lang="ts">
export default defineComponent({
  mounted() {
    watch(() => this.$route.params, () => {
      this.category = this.$route.params.category as string
      this.id = this.$route.params.id as string
    })
  },
  data() {
    return {
      category: this.$route.params.category as string,
      id: this.$route.params.id as string,
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