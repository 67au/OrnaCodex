<script setup lang="ts">
import { useCompareState } from '@/stores/compare'
import {
  bossScalingItems,
  getBossScalingName,
  getOptionValueName,
  getStatConditionName,
  getStatName,
  getStatValueName,
  levelItems,
  qualityCodeItems,
} from '@/utils'
import { mdiChevronDoubleLeft, mdiExport, mdiPin, mdiScaleBalance, mdiTrashCan } from '@mdi/js'
import { isUndefined } from 'es-toolkit'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const compareState = useCompareState()

const defaults: DefaultsOptions = {
  VCard: {
    border: 'md',
  },
  VListItem: {
    class: 'px-2',
    density: 'compact',
    slim: true,
  },
  VBtn: {
    size: 'small',
    rounded: 'lg',
    variant: 'tonal',
  },
  VChip: {
    size: 'x-small',
    rounded: 'sm',
    variant: 'tonal',
  },
}

function getDiffTextClass(n: number) {
  if (n > 0) {
    return 'text-green'
  }
  if (n < 0) {
    return 'text-red'
  }
}

function getSignedNumber(n: number) {
  return (n > 0 ? '+' : '') + n
}
</script>

<template>
  <v-container fluid class="pa-0">
    <v-defaults-provider :defaults="defaults">
      <template v-if="compareState.count === 0">
        <v-container class="pa-2">
          <v-sheet class="mt-1 rounded-lg mx-auto" max-width="600">
            <v-empty-state
              justify="center"
              :icon="mdiScaleBalance"
              :headline="$t('helper.notFound')"
              :text="$t('compare.addMoreGear')"
            >
              <template v-slot:actions>
                <v-btn
                  size="large"
                  color="secondary"
                  :to="{ name: 'home' }"
                  :text="$t('title')"
                  :append-icon="mdiExport"
                />
              </template>
            </v-empty-state>
          </v-sheet>
        </v-container>
      </template>
      <template v-else>
        <div class="d-flex ga-1 pa-1 overflow-x-auto">
          <v-spacer />
          <template v-for="(result, index) in compareState.comparedResults" :key="index">
            <v-card class="half-card align-self-start">
              <template v-if="isUndefined(result)">
                <v-empty-state />
              </template>

              <template v-else>
                <v-list-item :to="result.entry.url" density="default">
                  <template v-slot:prepend>
                    <v-avatar size="24" :rounded="false" class="mr-1">
                      <v-img :src="result.entry.iconUrl" :class="result.entry.iconClass" />
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-small text-normal">
                    {{ result.entry.name }}
                  </v-list-item-title>
                </v-list-item>

                <v-divider />
                <v-list-item>
                  <div class="d-flex ga-1">
                    <v-chip color="amber" :text="result.entry.tierName" />
                    <v-chip
                      v-if="result.entry.bossScaling !== 0"
                      color="secondary"
                      :text="getBossScalingName(result.entry.bossScaling)"
                    />
                    <v-chip
                      v-if="result.entry.place"
                      :text="getOptionValueName('place', result.entry.place)"
                    />
                  </div>
                </v-list-item>

                <v-divider />
                <v-list-item>
                  <template v-slot:prepend>
                    <div class="d-flex ga-1">
                      <v-btn
                        color="secondary"
                        :icon="mdiChevronDoubleLeft"
                        @click="compareState.leftShift(index)"
                        v-if="index > 0"
                      />
                      <v-btn color="info" :icon="mdiPin" :ripple="false" v-else />
                    </div>
                  </template>
                  <template v-slot:append>
                    <div class="d-flex ga-1">
                      <v-btn
                        color="error"
                        :icon="mdiTrashCan"
                        @click="compareState.remove(index)"
                      />
                    </div>
                  </template>
                </v-list-item>

                <v-divider />
                <v-list-item class="pa-0">
                  <v-row class="py-2" :gap="8">
                    <v-col cols="6">
                      <v-select
                        density="compact"
                        v-model="compareState.list[index]!.bossScaling"
                        :items="bossScalingItems"
                        item-title="title"
                        item-value="value"
                        hide-details
                        inset
                        :disabled="!result.entry.isUpgradable"
                      >
                        <template v-slot:label>
                          <div>{{ $t('assess.bossScaling') }}</div>
                        </template>
                        <template v-slot:selection="{ item }">
                          <div class="text-label-medium">{{ item.title }}</div>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-if="result.entry.isAccessory"
                        density="compact"
                        v-model="compareState.list[index]!.qualityCode"
                        :items="qualityCodeItems"
                        item-title="title"
                        item-value="value"
                        hide-details
                        inset
                        :disabled="compareState.list[index]!.quality < 200"
                      >
                        <template v-slot:label>
                          <div>{{ $t('assess.setQualityCode') }}</div>
                        </template>
                        <template v-slot:selection="{ item }">
                          <div class="text-label-medium">{{ item.title }}</div>
                        </template>
                      </v-select>
                      <v-select
                        v-else
                        density="compact"
                        v-model="compareState.list[index]!.level"
                        :items="levelItems"
                        item-title="title"
                        item-value="value"
                        hide-details
                        inset
                        :disabled="!result.entry.isUpgradable"
                      >
                        <template v-slot:label>
                          <div>{{ $t('assess.level') }}</div>
                        </template>
                        <template v-slot:selection="{ item }">
                          <div class="text-label-medium">{{ item.title }}</div>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-number-input
                        density="compact"
                        v-model="compareState.list[index]!.quality"
                        controlVariant="hidden"
                        hide-details
                        inset
                      >
                        <template v-slot:label>
                          <div>{{ $t('assess.quality') }}</div>
                        </template>
                      </v-number-input>
                    </v-col>
                    <v-col cols="6">
                      <v-number-input
                        v-if="result.entry.isUpgradable"
                        density="compact"
                        v-model="compareState.list[index]!.angLevel"
                        controlVariant="hidden"
                        hide-details
                        inset
                      >
                        <template v-slot:label>
                          <div>{{ $t('assess.angLevel') }}</div>
                        </template>
                      </v-number-input>
                    </v-col>
                  </v-row>
                </v-list-item>

                <template v-if="result.quality > 0">
                  <template v-for="(stat, key) in result.stats" :key="key">
                    <v-divider />
                    <v-list-item>
                      <template v-slot:title>
                        <v-list-item-title class="text-label-medium">
                          <span>{{ getStatName(key) }}</span>
                          <span
                            class="pl-1"
                            v-if="result.entry.stats_conditions?.[key] !== undefined"
                          >
                            {{ getStatConditionName(result.entry.stats_conditions?.[key]) }}
                          </span>
                        </v-list-item-title>
                      </template>

                      <template v-slot:subtitle>
                        <v-list-item-subtitle class="text-right text-body-small text-high-emphasis">
                          <span>
                            {{ getStatValueName('stats.' + key, stat.base) }}
                          </span>
                          <template v-if="stat.diff !== 0">
                            <span :class="getDiffTextClass(stat.diff)">
                              {{ `(${getSignedNumber(stat.diff)})` }}
                            </span>
                          </template>
                        </v-list-item-subtitle>
                      </template>
                    </v-list-item>
                  </template>
                </template>
              </template>
            </v-card>
          </template>
          <v-spacer />
        </div>
      </template>
    </v-defaults-provider>
  </v-container>
</template>

<style scoped>
.half-card {
  min-width: 210px;
  max-width: 260px;
  width: calc(50vw - 4px);
}
</style>
