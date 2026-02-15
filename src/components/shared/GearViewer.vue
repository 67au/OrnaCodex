<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import SettingDialog from '@/components/shared/SettingDialog.vue'
import type { AssessQuery } from '@/types/assess'
import { getFullResult, setQueryInput } from '@/utils/assess'
import {
  bossScalingItems,
  getBossScalingName,
  getOptionName,
  getOptionValueName,
  getStatConditionName,
  getStatName,
  getStatValueName,
  levelItems,
  qualityCodeItems,
} from '@/utils'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { mdiPencil, mdiRestore } from '@mdi/js'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

function setInput() {
  const query = setQueryInput(props.entry)
  query.quality = 200
  query.level = props.entry.isUpgradable ? 13 : 1
  return query
}

const query: Ref<AssessQuery['input']> = ref(setInput())

function reset() {
  query.value = setInput()
}

const result = computed(() => {
  return getFullResult(query.value)
})

const defaults: DefaultsOptions = {
  VCard: {
    variant: 'tonal',
  },
  VListItem: {
    class: 'px-2',
  },
  VChip: {
    size: 'x-small',
  },
}

const qualityList = {
  broken: 72,
  poor: 90,
  regular: 100,
  superior: 120,
  famed: 140,
  legendary: 170,
  ornate: 200,
}

function setQuality(n: number) {
  query.value.quality = n
}
</script>

<template>
  <SettingDialog :title="$t('assess.viewGear')">
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :props="activator"></slot>
    </template>

    <template v-slot:actions>
      <v-btn :icon="mdiRestore" @click="reset" />
    </template>

    <v-defaults-provider :defaults="defaults">
      <v-container class="pa-2 mx-auto overflow-y-auto" max-width="900">
        <div class="d-flex flex-column ga-2">
          <v-card variant="flat" class="border-md">
            <v-list-item density="compact" slim>
              <v-list-item-title>
                <span>
                  {{ props.entry.name }}
                </span>
              </v-list-item-title>
              <template v-slot:prepend>
                <v-avatar size="36" :rounded="false" class="mr-1">
                  <v-img :src="props.entry.iconUrl" :class="props.entry.iconClass" />
                </v-avatar>
              </template>

              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip color="amber-darken-2" :text="props.entry.tierName" />
                <v-chip v-if="props.entry.exotic === 1" color="blue-grey">
                  <span class="exotic">
                    {{ getOptionName('exotic') }}
                  </span>
                </v-chip>
                <v-chip
                  v-if="props.entry.item_type"
                  color="secondary"
                  :text="getOptionValueName('item_type', props.entry.item_type)"
                />
                <v-chip
                  v-if="props.entry.bossScaling !== 0"
                  :color="props.entry.bossScaling > 0 ? 'red-darken-2' : 'blue-darken-2'"
                  :text="getBossScalingName(props.entry.bossScaling)"
                />
              </div>

              <template v-slot:append>
                <v-menu>
                  <template v-slot:activator="{ props: activator }">
                    <v-btn
                      v-bind="activator"
                      rounded="lg"
                      variant="tonal"
                      :icon="mdiPencil"
                      color="secondary"
                    />
                  </template>

                  <v-list density="compact">
                    <v-list-item v-for="(q, n) in qualityList" :key="q" @click="setQuality(q)" slim>
                      <template v-slot:title>
                        <v-list-item-title>
                          <span :class="`${n}-text`">
                            {{ $t('quality.' + n) }}
                          </span>
                        </v-list-item-title>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>

            <v-row class="pa-2" :gap="8">
              <v-col cols="6" sm="3">
                <v-select
                  density="compact"
                  v-model="query.bossScaling"
                  :items="bossScalingItems"
                  item-title="title"
                  item-value="value"
                  hide-details
                  inset
                  :disabled="!props.entry.isUpgradable"
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.bossScaling') }}</div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-if="props.entry.isAccessory"
                  density="compact"
                  v-model="query.qualityCode"
                  :items="qualityCodeItems"
                  item-title="title"
                  item-value="value"
                  hide-details
                  inset
                  :disabled="query.quality < 200"
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.setQualityCode') }}</div>
                  </template>
                </v-select>
                <v-select
                  v-else
                  density="compact"
                  v-model="query.level"
                  :items="levelItems"
                  item-title="title"
                  item-value="value"
                  hide-details
                  inset
                  :disabled="!props.entry.isUpgradable"
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.level') }}</div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="6" sm="3">
                <v-number-input
                  density="compact"
                  v-model="query.quality"
                  controlVariant="hidden"
                  hide-details
                  inset
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.quality') }}</div>
                  </template>
                </v-number-input>
              </v-col>
              <v-col cols="6" sm="3">
                <v-number-input
                  v-if="props.entry.isUpgradable"
                  density="compact"
                  v-model="query.angLevel"
                  :label="$t('assess.angLevel')"
                  controlVariant="hidden"
                  hide-details
                  inset
                />
              </v-col>
            </v-row>
          </v-card>

          <template v-if="result.quality > 0">
            <v-card variant="flat" class="border-md" :title="$t('meta.stats')">
              <v-row class="pa-2" :gap="4">
                <template v-for="(stat, key) in result.stats" :key="key">
                  <v-col cols="6">
                    <v-card>
                      <v-list-item class="px-2">
                        <template v-slot:title>
                          <v-list-item-title class="text-label-medium text-normal">
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
                          <v-list-item-subtitle
                            class="text-right text-body-medium text-high-emphasis"
                          >
                            <span>
                              {{ getStatValueName(key, stat) }}
                            </span>
                          </v-list-item-subtitle>
                        </template>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </template>
              </v-row>
            </v-card>
          </template>
        </div>
      </v-container>
    </v-defaults-provider>
  </SettingDialog>
</template>
