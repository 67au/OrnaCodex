<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
import { PROOF_IDS, getMaterials, getProofRate, getProofs } from '@/plugins/proof'
import { getStaticUrl, rarityAura } from '@/plugins/utils'
</script>

<template>
  <PopupPaper :show="show" @update:show="$emit('update:show', $event)" max-width="md">
    <template #title>
      <var-button text disabled></var-button>
      <var-space justify="center" align="baseline" class="text-lg" size="small">
        {{ ce.lang.name }}
        <var-chip type="warning" size="mini" plain>
          {{ ce.tier }}
        </var-chip>
      </var-space>
    </template>
    <var-input
      class="w-full pt-3"
      variant="outlined"
      size="small"
      :placeholder="$t('proof.count')"
      v-model="materialsWarp"
      clearable
    >
      <template #prepend-icon>
        <var-icon
          class="image-render-pixel mr-2"
          :class="rarityAura(ce.category, ce.id)"
          :size="24"
          :name="getStaticUrl(ce.meta.icon)"
        />
      </template>
    </var-input>
    <var-divider :description="$t('proof.title')" />
    <var-row :gutter="[8, 4]" class="pt-1">
      <var-col :span="12" v-for="(entry, index) in proofEntries">
        <var-input
          class="w-full"
          variant="outlined"
          size="small"
          :placeholder="entry.lang.name"
          v-model="proofs[index]"
          @change="updateMaterials(index)"
        >
          <template #append-icon>
            <var-icon class="image-render-pixel" :size="24" :name="getStaticUrl(entry.meta.icon)" />
          </template>
        </var-input>
      </var-col>
    </var-row>
    <var-divider />
  </PopupPaper>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      materials: 0
    }
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    materialsWarp: {
      set(newValue: string) {
        this.materials = Number(newValue)
      },
      get() {
        return String(this.materials)
      }
    },
    proofEntries(): Array<CodexEntry> {
      return PROOF_IDS.map((id) => new CodexEntry('items', id))
    },
    proofRate() {
      return this.proofEntries.map((entry) =>
        getProofRate(entry.id, this.ce.meta.tier, this.ce.meta.rarity)
      )
    },
    proofs() {
      return this.proofRate.map((rate) => getProofs(this.materials, rate as number))
    }
  },
  methods: {
    updateMaterials(index: number) {
      this.materials = getMaterials(this.proofs[index], this.proofRate[index])
    }
  }
})
</script>
