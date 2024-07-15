<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
import { enterCodex } from '@/plugins/utils'
import type { BestialBond } from '@/types'
</script>

<template>
  <template v-if="ce.meta.bestial_bond !== undefined">
    <var-card class="card" :title="$t('meta.bestial_bond')">
      <template #description>
        <div class="card-description">
          <var-cell
            class="text-cell"
            v-for="([level, bond], index) in bonds"
            :title="$t(`meta.levels.${level}`)"
            :key="index"
            border
          >
            <template #description>
              <var-space
                size="mini"
                class="line-height-normal py-1"
                style="color: var(--card-description-color)"
              >
                <template v-for="[type, name, value] in bond">
                  <var-chip
                    type="primary"
                    v-if="type === 'ability'"
                    size="small"
                    elevation="1"
                    @click="enterCodex((value as CodexEntry).category, (value as CodexEntry).id)"
                  >
                    <div>
                      {{ (value as CodexEntry).lang.name }}
                    </div>
                  </var-chip>
                  <var-chip v-else size="small" plain elevation="1">
                    <div v-if="type === 'bond' || type === 'buff'">
                      {{ `${$t(`meta.bonds.${name}`)} (${value})` }}
                    </div>
                    <div v-else-if="type === 'bonus'">
                      <template v-if="value !== undefined">
                        {{ `${$t(`meta.stats.${name}`)}: ${value}` }}
                      </template>
                      <template v-else>
                        {{ $t(`meta.stats.${name}`) }}
                      </template>
                    </div>
                  </var-chip>
                </template>
              </var-space>
            </template>
          </var-cell>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  methods: {
    getAbilityEntry(id: string) {
      return new CodexEntry('spells', id)
    }
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    bonds() {
      return Object.entries(this.ce.meta.bestial_bond as BestialBond).map(([level, bond]) => [
        level,
        bond.map(([type, name, value]) => {
          if (type === 'ability') {
            return [type, name, this.getAbilityEntry(name)]
          } else {
            return [type, name, value]
          }
        })
      ])
    }
  }
})
</script>
