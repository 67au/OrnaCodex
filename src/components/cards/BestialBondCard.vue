<script setup lang="ts">
import { getCodexEntryByKey, type CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { getStatValueName } from '@/utils'
import { isUndefined } from 'es-toolkit'
import { i18n } from '@/i18n'

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: 'small',
    rounded: 'lg',
    color: 'default',
  },
  VListItem: {
    class: 'px-3',
  },
}

const entry = inject<ComputedRef<CodexEntry>>('entry')

const bestialBond = computed(() => {
  if (isUndefined(entry?.value?.bestial_bond)) {
    return []
  } else {
    return entry.value.bestial_bond.map((value, index) => {
      return {
        key: i18n.global.t('units.level') + ' ' + (index + 1),
        value: value.map((v) => {
          if (v.type === 'ABILITY') {
            const spell = v.key ? getCodexEntryByKey(v.key) : undefined
            return {
              name: `+${i18n.global.t('meta.abilities')}:`,
              color: spell ? 'secondary' : undefined,
              value: spell ? spell.name : i18n.global.t('stats_text.' + v.name),
              to: spell?.url,
            }
          }
          if (v.type === 'BOND') {
            return {
              name: i18n.global.t('status.' + v.name),
              value: `(${v.value}%)`,
            }
          }
          if (v.type === 'BONUS') {
            return {
              name:
                typeof v.value === 'boolean' ? undefined : i18n.global.t('stats.' + v.name) + ':',
              value:
                typeof v.value === 'boolean'
                  ? i18n.global.t('stats.' + v.name)
                  : getStatValueName('bonds.' + v.name, v.value),
            }
          }
          return {
            name: undefined,
            value: undefined,
          }
        }),
      }
    })
  }
})
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <DetailCard v-if="entry?.bestial_bond" :title="$t('meta.bestial_bond')">
      <div class="pb-2">
        <template v-for="(bonds, index) in bestialBond" :key="index">
          <v-list-item>
            <v-list-item-title class="text-label-large">
              {{ bonds.key }}
            </v-list-item-title>
            <div class="pt-1 d-flex flex-wrap ga-1">
              <template v-for="(bond, index) in bonds.value" :key="index">
                <v-chip :text="bond.value" :color="bond.color" :to="bond.to">
                  <template v-slot:prepend v-if="bond.name">
                    <span class="mr-1">{{ bond.name }}</span>
                  </template>
                </v-chip>
              </template>
            </div>
          </v-list-item>
          <v-divider class="mx-3" />
        </template>
      </div>
    </DetailCard>
  </v-defaults-provider>
</template>
