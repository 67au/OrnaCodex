<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import { i18n } from '@/i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getOptionName, getOptionValueName } from '@/plugins'
import {
  assessKeys,
  bossScalingItems,
  bossScalingName,
  getQualityCode,
  getQualityColor,
  getQualityName,
  useAssessQuery,
  useAssessResult,
} from '@/plugins/assess'
import { CodexEntryFactory } from '@/plugins/codex'
import { useCodexState } from '@/stores/codex'
import type { AssessQuery, AssessResult } from '@/types/assess'
import {
  mdiAccountCheck,
  mdiAlertCircle,
  mdiCheckboxMarkedCircle,
  mdiCheckCircle,
  mdiClipboardOutline,
  mdiClipboardCheckOutline,
  mdiDatabaseSearch,
  mdiInformationOutline,
  mdiMagnify,
  mdiRestart,
  mdiStarCircle,
  mdiSwordCross,
  mdiTshirtCrew,
  mdiRobotAngry,
} from '@mdi/js'
import { head, range } from 'es-toolkit'
import { isNull } from 'es-toolkit'
import { isUndefined } from 'es-toolkit'

const route = useRoute()
const router = useRouter()

const codexState = useCodexState()

const assessableEntries = Object.keys(codexState.codex!['items'])
  .map((key) => CodexEntryFactory.getEntry('items', key))
  .filter((e) => e.isAssessable || e.isCelestialWeapon)

const id = computed({
  get() {
    return route.query.id?.toString() ?? ''
  },
  set(newValue) {
    if (isNull(newValue)) {
      router.replace({ query: { ...route.query, id: '' } })
    }
    router.replace({ query: { ...route.query, id: newValue } })
  },
})

const entry = computed(() => CodexEntryFactory.getEntry('items', id.value))
const isNothing = computed(() => isUndefined(entry.value.raw))

const assessMap = {
  assess: {
    label: 'assess.assess',
    color: 'amber',
  },
  quality: {
    label: 'assess.qualityCalc',
    color: 'teal',
  },
} as const

type AssessType = keyof typeof assessMap

const supportedAssessTypes: Ref<Array<AssessType>> = computed(() => {
  if (!isNothing.value) {
    if (entry.value.isCelestialWeapon) {
      return ['quality']
    }
  }
  return ['assess', 'quality']
})

const assessType: Ref<AssessType> = ref(head(supportedAssessTypes.value)!)

const query: Ref<AssessQuery | undefined> = ref(undefined)
const result: Ref<AssessResult | undefined> = ref(undefined)

watch(
  () => id.value,
  () => {
    if (!supportedAssessTypes.value.includes(assessType.value)) {
      assessType.value = head(supportedAssessTypes.value)!
    } else {
      resetAssessQuery()
    }
  },
  { immediate: true },
)

watch(
  () => assessType.value,
  () => {
    resetAssessQuery()
  },
)

function resetAssessQuery() {
  result.value = undefined
  if (isNothing.value) {
    query.value = undefined
  } else {
    query.value = useAssessQuery(entry.value, assessType.value === 'quality')
  }
}

function getAssessResult() {
  if (!isUndefined(query.value)) {
    result.value = useAssessResult(query.value)
  }
}

const qualityCode = computed(() =>
  getQualityCode(result.value!.quality, 1, entry.value.isAccessory),
)
const qualityName = computed(() => getQualityName(qualityCode.value))
const qualityColor = computed(() => getQualityColor(qualityCode.value))
const qualityStat = computed(() => {
  if (qualityCode.value && result.value?.exact) {
    return {
      icon: mdiCheckCircle,
      color: 'secondary',
    }
  }
  if (!result.value?.exact) {
    return {
      icon: mdiAlertCircle,
      color: 'warning',
    }
  }
  return {
    icon: mdiCheckboxMarkedCircle,
    color: 'error',
  }
})

function itemProps(item: { value: number; title: string }) {
  return {
    title: i18n.global.t(item.title),
    value: item.value,
  }
}

const itemName = computed(() => {
  if (result.value && result.value.quality) {
    return `${entry.value.name} ${(result.value.quality * 100).toFixed()}`
  }
})

const { copy, copied, isSupported } = useClipboard({ source: itemName.value })
</script>

<template>
  <DefaultLayout :title="$t('tools.assess')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <v-container fluid class="px-4 pb-8 mx-auto d-flex flex-column ga-2" :max-width="900">
      <v-card>
        <v-list-item density="default" variant="tonal" class="px-2">
          <v-list-item-title>
            <v-autocomplete
              hide-details
              single-line
              :label="$t('tools.search')"
              variant="solo"
              color="secondary"
              density="compact"
              :items="assessableEntries"
              item-title="name"
              item-value="id"
              v-model="id"
              class="py-1"
              clearable
            >
              <template v-slot:prepend-inner>
                <v-icon :icon="mdiMagnify"></v-icon>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :text="item.title">
                  <template v-slot:prepend>
                    <v-avatar :rounded="false">
                      <v-img :src="item.raw.iconUrl" class="image-render-pixel"></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-subtitle>
                    <span class="text-warning">
                      {{ `${item.raw.tierName}` }}
                    </span>
                    <template v-if="item.raw.raw.useable_by">
                      {{ ` | ${getOptionValueName('useable_by', item.raw.raw.useable_by)}` }}
                    </template>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-list-item-title>
        </v-list-item>
      </v-card>

      <v-slide-y-transition>
        <v-card v-if="!isNothing">
          <v-list-item :to="entry.url">
            <template v-slot:prepend>
              <v-avatar size="36" :rounded="false">
                <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
              </v-avatar>
            </template>
            <template v-slot:title>
              <v-list-item-title>
                {{ entry.name }}
              </v-list-item-title>
            </template>
            <template v-slot:subtitle>
              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip size="x-small" color="warning" :text="entry.tierName"></v-chip>

                <v-chip
                  size="x-small"
                  color="primary"
                  variant="flat"
                  v-if="entry.isUpgradable"
                  :prepend-icon="mdiRobotAngry"
                  :text="$t(bossScalingName[entry.bossScaling])"
                ></v-chip>

                <v-chip size="x-small" v-if="entry.raw.exotic" color="tertiary">
                  <div class="exotic">{{ getOptionName('exotic') }}</div>
                </v-chip>

                <v-chip
                  size="x-small"
                  color="secondary"
                  v-if="entry.raw.useable_by"
                  :prepend-icon="mdiAccountCheck"
                  :text="getOptionValueName('useable_by', entry.raw.useable_by)"
                ></v-chip>

                <v-chip
                  size="x-small"
                  color="secondary"
                  v-if="entry.raw.place"
                  :prepend-icon="mdiTshirtCrew"
                  :text="getOptionValueName('place', entry.raw.place)"
                ></v-chip>

                <v-chip
                  v-if="entry.raw.type"
                  size="x-small"
                  color="secondary"
                  :prepend-icon="mdiSwordCross"
                  :text="getOptionValueName('type', entry.raw.type)"
                ></v-chip>
              </div>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <template v-slot:prepend>
              <v-chip-group mandatory v-model="assessType">
                <template v-for="type in supportedAssessTypes" :key="type">
                  <v-chip
                    rounded="lg"
                    :color="assessMap[type].color"
                    :text="$t(assessMap[type].label)"
                    :value="type"
                  ></v-chip>
                </template>
              </v-chip-group>
            </template>
            <template v-slot:append>
              <v-btn
                size="small"
                variant="tonal"
                color="secondary"
                :icon="mdiRestart"
                @click="resetAssessQuery"
              ></v-btn>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-row dense class="py-2">
              <v-col cols="4" sm="3">
                <v-select
                  density="compact"
                  :label="$t('assess.bossScaling.title')"
                  v-model="query!.options.bossScaling"
                  :items="bossScalingItems"
                  :item-props="itemProps"
                  hide-details
                  inset
                  :disabled="query?.options.isCelestialWeapon || !query?.options.isUpgradable"
                >
                </v-select>
              </v-col>

              <v-col cols="4" sm="3" v-if="query?.options.isQualityCalc">
                <v-number-input
                  density="compact"
                  :label="$t('assess.quality.title')"
                  v-model="query.query.quality"
                  controlVariant="stacked"
                  hide-details
                  inset
                  :disabled="query?.options.isCelestialWeapon"
                >
                </v-number-input>
              </v-col>

              <v-col>
                <v-select
                  density="compact"
                  :label="$t('assess.level')"
                  v-model="query!.query.level"
                  :items="Array.from({ length: 13 }, (_, i) => i + 1)"
                  hide-details
                  inset
                  :disabled="query?.options.isQualityCalc || !query?.options.isUpgradable"
                >
                </v-select>
              </v-col>

              <template v-for="key in assessKeys" :key="key">
                <v-col cols="4" sm="3" v-if="!isUndefined(query?.options.baseStats[key])">
                  <v-number-input
                    density="compact"
                    :label="getOptionValueName('stats', key)"
                    v-model="query.query[key]"
                    controlVariant="stacked"
                    hide-details
                    inset
                    :disabled="query?.options.isQualityCalc"
                  >
                  </v-number-input>
                </v-col>
              </template>
              <v-col cols="12">
                <v-btn
                  density="default"
                  :text="$t('assess.query')"
                  block
                  rounded="md"
                  @click="getAssessResult"
                ></v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card>
      </v-slide-y-transition>

      <template v-if="!isUndefined(result)">
        <v-card v-if="result.quality > 0">
          <v-list-item density="compact" class="bg-surface-light text-center">
            <template v-slot:title>
              <v-list-item-title>
                {{ entry.name }}
                <template v-if="isSupported">
                  <v-btn
                    size="small"
                    variant="text"
                    color="secondary"
                    @click="copy(itemName)"
                    :icon="copied ? mdiClipboardCheckOutline : mdiClipboardOutline"
                  ></v-btn>
                </template>
              </v-list-item-title>
            </template>
            <template v-slot:subtitle>
              <div class="d-flex flex-wrap justify-center ga-1 py-1">
                <v-chip
                  :prepend-icon="mdiStarCircle"
                  :color="qualityColor"
                  size="small"
                  rounded="md"
                  variant="flat"
                  v-if="qualityName"
                >
                  {{ qualityName }}
                </v-chip>
                <v-chip
                  :prepend-icon="qualityStat.icon"
                  :color="qualityStat.color"
                  size="small"
                  rounded="md"
                  variant="flat"
                >
                  {{ `${(result.quality * 100).toFixed()}%` }}
                </v-chip>
                <v-chip
                  v-if="result.range?.[0] !== result.range?.[1]"
                  :prepend-icon="mdiDatabaseSearch"
                  size="small"
                  rounded="md"
                  color="info"
                  variant="flat"
                >
                  {{ result.range!.map((x) => `${x}%`).join('-') }}
                </v-chip>
              </div>
            </template>
          </v-list-item>
          <v-card-text class="py-0">
            <v-table fixed-header density="compact" class="text-no-wrap">
              <thead>
                <tr>
                  <th>
                    {{ $t('assess.level') }}
                  </th>
                  <template v-for="key in Object.keys(result.stats)" :key="key">
                    <th>
                      {{ getOptionValueName('stats', key) }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ $t('assess.base') }}
                  </td>
                  <template v-for="(stat, index) in Object.values(result.stats)" :key="index">
                    <td>
                      {{ stat.base }}
                    </td>
                  </template>
                </tr>
                <template v-for="i in range(result.levels)" :key="i">
                  <tr>
                    <td>{{ i + 1 }}</td>
                    <template v-for="(stat, index) in Object.values(result.stats)" :key="index">
                      <td>
                        {{ stat.values[i] }}
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
        <v-alert v-else :icon="mdiInformationOutline" density="compact" rounded="lg">
          {{ $t('assess.help') }}
        </v-alert>
      </template>
    </v-container>
  </DefaultLayout>
</template>
