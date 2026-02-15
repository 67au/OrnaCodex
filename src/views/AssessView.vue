<script setup lang="ts">
import DropsItem from '@/components/cards/DropsItem.vue'
import { useCodexState } from '@/stores/codex'
import type { AssessQuery, AssessResult } from '@/types/assess'
import { bossScalingItems, getBossScalingName, getOptionValueName, levelItems } from '@/utils'
import { getAssessResult, getQualityColor, getQualityName, setQueryInput } from '@/utils/assess'
import { getCodexEntryByKey } from '@/utils/codex'
import {
  mdiAlertCircle,
  mdiCheckCircle,
  mdiCheckDecagramOutline,
  mdiChevronDoubleDown,
  mdiClipboardCheckOutline,
  mdiClipboardOutline,
  mdiCloseCircle,
  mdiDatabaseSearch,
  mdiEmoticonDevil,
  mdiMagnify,
  mdiRestore,
  mdiStarCircle,
} from '@mdi/js'
import { isNull, isUndefined, range } from 'es-toolkit'
import colors from '@/styles/colors.module.scss'
import { useGoTo } from 'vuetify'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const route = useRoute()
const router = useRouter()

const id = computed({
  get() {
    return route.query.id?.toString()
  },
  set(newValue) {
    if (isNull(newValue)) {
      router.replace({ query: { ...route.query, id: undefined } })
    } else {
      router.replace({ query: { ...route.query, id: newValue } })
    }
  },
})

const entry = computed(() => (id.value ? getCodexEntryByKey(id.value) : undefined))

const codexState = useCodexState()

const query: Ref<AssessQuery['input'] | undefined> = ref(undefined)

const result: ShallowRef<AssessResult | undefined> = shallowRef(undefined)

watch(id, () => reset(), { immediate: true })

const goto = useGoTo()

function scrollTo() {
  goto('#scroll', { offset: -64 })
}

function reset() {
  if (!isUndefined(entry.value)) {
    query.value = setQueryInput(entry.value)
  }
  result.value = undefined
}

function queryResult(isQualityCalc: boolean = false) {
  if (isUndefined(query.value)) {
    return false
  }
  const r = getAssessResult(query.value, isQualityCalc)
  if (r && r.quality !== 0) {
    result.value = r
  }
}

const qualityItems = computed(() => {
  if (
    result.value?.qualityCode !== undefined &&
    result.value?.qualityCode > -1 &&
    result.value?.exact
  ) {
    return {
      icon: mdiCheckCircle,
      color: 'success',
    }
  }
  if (!result.value?.exact) {
    return {
      icon: mdiAlertCircle,
      color: 'warning',
    }
  }
  return {
    icon: mdiCloseCircle,
    color: 'error',
  }
})

const entryName = computed(() => {
  if (result.value && entry.value) {
    return entry.value.name + ' ' + result.value.quality
  }
})

const { copy, copied, isSupported } = useClipboard({ source: entryName.value })

const tab = ref('')

const defaults: DefaultsOptions = {
  VBtn: {
    variant: 'tonal',
    size: 'small',
    rounded: 'lg',
  },
}
</script>

<template>
  <v-container fluid class="pa-2 mx-auto d-flex flex-column ga-2" :max-width="900">
    <v-defaults-provider :defaults="defaults">
      <v-card class="border-secondary border-md">
        <v-autocomplete
          hide-details
          single-line
          :label="$t('assess.gearChoice')"
          variant="solo-filled"
          rounded="lg"
          density="compact"
          :items="codexState.gearEntries"
          item-title="name"
          item-value="key"
          v-model="id"
          clearable
          class="pa-2"
        >
          <template v-slot:prepend-inner>
            <v-icon :icon="mdiMagnify"></v-icon>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item slim v-bind="props" :text="item.name">
              <template v-slot:prepend>
                <v-avatar :rounded="false">
                  <v-img :src="item.iconUrl" :class="item.iconClass"></v-img>
                </v-avatar>
              </template>
              <v-list-item-subtitle class="d-flex ga-1">
                <v-chip :text="item.tierName" color="amber-darken-2" size="x-small" />
                <v-chip
                  v-if="item.rarity"
                  :text="getOptionValueName('rarity', item.rarity)"
                  :color="item.rarityTextColor"
                  size="x-small"
                />
                <v-chip
                  size="x-small"
                  v-if="item.bossScaling !== 0"
                  :color="item.bossScaling > 0 ? 'red-darken-2' : undefined"
                  :text="getBossScalingName(item.bossScaling)"
                />
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>

        <template v-if="entry">
          <DropsItem :entry="entry" />
        </template>
      </v-card>

      <v-slide-y-transition>
        <v-card v-if="query && entry">
          <div class="d-flex flex-wrap ga-1 align-center justify-end pr-2">
            <v-tabs color="secondary" v-model="tab">
              <v-tab value="assess" :disabled="entry.isCelestialWeapon">
                {{ $t('assess.assess') }}
              </v-tab>
              <v-tab value="predict">
                {{ $t('assess.predict') }}
              </v-tab>
            </v-tabs>

            <v-spacer />

            <div class="d-flex ga-1 py-1">
              <v-tooltip :text="$t('helper.tooltip.provider')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="entry.bossScaling !== 0"
                    v-bind="props"
                    size="default"
                    color="success"
                    :prepend-icon="mdiCheckDecagramOutline"
                    :text="getBossScalingName(entry.bossScaling)"
                  />
                </template>
              </v-tooltip>
              <v-btn :icon="mdiRestore" color="error" @click="reset()" />
              <v-btn :icon="mdiChevronDoubleDown" color="default" @click="scrollTo()" />
            </div>
          </div>

          <v-divider />

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="predict">
              <v-row :gap="8" class="pa-4">
                <v-col cols="4" sm="3">
                  <v-select
                    density="compact"
                    :label="$t('assess.bossScaling')"
                    v-model="query.bossScaling"
                    :items="bossScalingItems"
                    item-value="value"
                    item-title="title"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon || !entry.isUpgradable"
                  />
                </v-col>
                <v-col cols="4" sm="3">
                  <v-number-input
                    density="compact"
                    :label="$t('assess.quality')"
                    v-model="query.quality"
                    controlVariant="hidden"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon"
                  />
                </v-col>
                <v-col cols="4" sm="3">
                  <v-number-input
                    density="compact"
                    :label="$t('assess.angLevel')"
                    v-model="query.angLevel"
                    controlVariant="hidden"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon || !entry.isUpgradable"
                  />
                </v-col>

                <v-col cols="12" class="pt-1">
                  <v-btn
                    variant="flat"
                    size="large"
                    color="secondary"
                    :text="$t('assess.query')"
                    rounded="md"
                    class="w-100 text-uppercase"
                    @click="queryResult(true)"
                  />
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="assess">
              <v-row :gap="8" class="pa-4">
                <v-col cols="4" sm="3">
                  <v-select
                    density="compact"
                    :label="$t('assess.bossScaling')"
                    v-model="query.bossScaling"
                    :items="bossScalingItems"
                    item-value="value"
                    item-title="title"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon || !entry.isUpgradable"
                  />
                </v-col>
                <v-col cols="4" sm="3">
                  <v-select
                    density="compact"
                    :label="$t('assess.level')"
                    v-model="query.level"
                    :items="levelItems"
                    item-value="value"
                    item-title="title"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon || !entry.isUpgradable"
                  />
                </v-col>

                <v-col cols="4" sm="3" v-for="(_, key) in query.stats" :key="key">
                  <v-number-input
                    density="compact"
                    :label="getOptionValueName('stats', key)"
                    v-model="query.stats[key]"
                    controlVariant="hidden"
                    hide-details
                    inset
                    :disabled="entry.isCelestialWeapon"
                  />
                </v-col>

                <v-col cols="12" class="pt-1">
                  <v-btn
                    variant="flat"
                    size="large"
                    color="secondary"
                    :text="$t('assess.query')"
                    rounded="md"
                    class="w-100 text-uppercase"
                    @click="queryResult()"
                  />
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-card v-if="result" id="scroll">
          <v-alert v-if="result.bossScaling === 0" border="start" type="error" variant="text">
            {{ $t('assess.bossScalingInput') }}
          </v-alert>
          <template v-else>
            <v-list-item>
              <template v-slot:append v-if="isSupported">
                <v-btn
                  size="default"
                  color="secondary"
                  @click="copy(entryName)"
                  :icon="copied ? mdiClipboardCheckOutline : mdiClipboardOutline"
                />
              </template>

              <template v-slot:title>
                <v-list-item-title>
                  {{ entry?.name }}
                </v-list-item-title>
                <div class="d-flex flex-wrap ga-1 py-1">
                  <v-chip
                    :prepend-icon="mdiStarCircle"
                    :color="getQualityColor(result.qualityCode)"
                    size="small"
                    rounded="md"
                    variant="tonal"
                    v-if="result.qualityCode > -1"
                  >
                    {{ $t(getQualityName(result.qualityCode)) }}
                  </v-chip>
                  <v-chip
                    :prepend-icon="qualityItems.icon"
                    :color="qualityItems.color"
                    :text="result.quality + '%'"
                    size="small"
                    rounded="md"
                    variant="tonal"
                  >
                    <template v-slot:append>
                      <span class="ml-1">
                        {{ `| ${(result.quality / 2).toFixed(1)}/100` }}
                      </span>
                    </template>
                  </v-chip>
                  <v-chip
                    v-if="result.range?.[0] !== result.range?.[1]"
                    :prepend-icon="mdiDatabaseSearch"
                    :text="result.range!.map((x) => x + '%').join('-')"
                    size="small"
                    rounded="md"
                    color="info"
                    variant="tonal"
                  />

                  <v-chip
                    v-if="result.angLevel > 0"
                    :prepend-icon="mdiEmoticonDevil"
                    :color="colors['anguish-text']"
                    :text="$t('assess.angLevel')"
                    size="small"
                    rounded="md"
                    variant="tonal"
                  >
                    <template v-slot:append>
                      <span class="ml-1">
                        {{ result.angLevel }}
                      </span>
                    </template>
                  </v-chip>
                </div>
              </template>
            </v-list-item>

            <v-divider />

            <v-table density="compact" class="text-no-wrap">
              <thead>
                <tr>
                  <th>
                    {{ $t('assess.level') }}
                  </th>
                  <th v-for="k in Object.keys(result.stats)" :key="k">
                    {{ getOptionValueName('stats', k) }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    {{ $t('assess.base') }}
                  </td>
                  <td v-for="(stat, index) in Object.values(result.stats)" :key="index">
                    {{ stat.base }}
                  </td>
                </tr>
                <tr v-for="level in range(result.levels)" :key="level">
                  <td>{{ level + 1 }}</td>
                  <td v-for="(stat, index) in Object.values(result.stats)" :key="index">
                    {{ stat.values[level] }}
                  </td>
                </tr>
                <tr>
                  <th>
                    {{ $t('assess.level') }}
                  </th>
                  <th v-for="k in Object.keys(result.stats)" :key="k">
                    {{ getOptionValueName('stats', k) }}
                  </th>
                </tr>
              </tbody>
            </v-table>
          </template>
        </v-card>
      </v-slide-y-transition>
    </v-defaults-provider>
  </v-container>
</template>

<style lang="css" scoped>
.table-right {
  text-align: right;
}

.table-right th {
  text-align: right;
}
</style>
