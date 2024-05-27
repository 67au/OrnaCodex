<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import { PROOF_IDS, getMaterials, getProofRate, getProofs } from '@/plugins/proof';
import { getStaticUrl, getTierName } from '@/plugins/utils';
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-paper class="popup-content">
      <var-cell class="text-cell">
        <var-space justify="center" align="baseline" class="text-lg" size="small">
          {{ ce.lang.name }}
          <var-chip type="warning" size="small" plain>
            {{ getTierName(ce.meta.tier) }}
          </var-chip>
        </var-space>
      </var-cell>
      <var-input class="w-full pt-1" variant="outlined" size="small" :placeholder="$t('proof.count')"
        v-model="materialsWarp" clearable />
      <var-divider :description="$t('proof.title')" />
      <var-row :gutter="[8, 4]" class="pt-1">
        <var-col :span="12" v-for="entry, index in proofEntries">
          <var-input class="w-full" variant="outlined" size="small" :placeholder="entry.lang.name"
            v-model="proofs[index]" @change="updateMaterials(index)">
            <template #append-icon>
              <var-icon class="image-render-pixel" :size="24" :name="getStaticUrl(entry.meta.icon)" />
            </template>
          </var-input>
        </var-col>
      </var-row>
      <var-divider />
      <var-space justify="space-around" class="pt-1">
        <var-button type="primary" size="small" icon-container @click="$emit('update:show', false)">
          {{ $t('close') }}
        </var-button>
      </var-space>
    </var-paper>
  </var-popup>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      materials: 0,
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
      return this.proofEntries.map((entry) => getProofRate(entry.id, this.ce.meta.tier, this.ce.meta.rarity)
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

<style lang="less" scoped>
@media screen and (min-width: 425px) {
  .popup-content {
    padding: 24px 12px;
    max-width: 425px;
  }
}
</style>