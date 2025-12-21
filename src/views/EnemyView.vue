<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getOptionValueName } from '@/plugins'
import { CodexEntry, CodexEntryFactory } from '@/plugins/codex'
import { useCodexState } from '@/stores/codex'
import {
  mdiArrowLeft,
  mdiArrowRight,
  mdiClipboardCheckOutline,
  mdiClipboardOutline,
  mdiClose,
  mdiDiamondStone,
  mdiMagnify,
  mdiPencilCircleOutline,
  mdiRestore,
  mdiRestoreAlert,
  mdiToolbox,
} from '@mdi/js'
import { cloneDeep, isNull, isUndefined, mapValues, pickBy } from 'es-toolkit'
import colors from '@/styles/colors.module.scss'
import { stringify } from 'smol-toml'
import { fromPairs, isArray, size } from 'es-toolkit/compat'
import { extraEnemyStorage } from '@/storages/extra'
import type { Enemy } from '@/types/extra'
import config from '@/config'

const route = useRoute()
const router = useRouter()

const enemyKey = ['bosses', 'monsters', 'raids']

const codexState = useCodexState()

const enemyEntries = enemyKey.reduce((acc, key) => {
  return acc.concat(
    Object.keys(codexState.codex?.[key] ?? {}).map((v) => CodexEntryFactory.getEntry(key, v)),
  )
}, [] as Array<CodexEntry>)

const enemyMap: Map<string, number> = new Map(enemyEntries.map((ce, i) => [ce.cacheKey, i]))

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

const elements = [
  'water',
  'fire',
  'lightning',
  'earthen',
  'dark',
  'holy',
  'dragon',
  'arcane',
  'physical',
]

const statuses = [
  'poisoned',
  'bleeding',
  'burning',
  'windswept',
  'frozen',
  'paralyzed',
  'rot',
  'blind',
  'asleep',
  'drenched',
  'stunned',
  'blight',
  'petrified',
  'stasis',
  'att_d',
  'def_d',
  'def_dd',
  't__def_d',
  't__att_d',
  'mag_d',
  't__mag_d',
  't__mag_dd',
  't__res_d',
  't__att_dd',
  't__def_dd',
  't__def_ddd',
  't__res_dd',
  'res_dd',
  'dmg_dd',
  'res_d',
  't__dex_d',
  'lyon_s_mark',
]

const enemyBase = {
  elementWeaknesses: fromPairs(elements.map((a) => [a, false])),
  elementImmunities: fromPairs(elements.map((a) => [a, false])),
  elementResistances: fromPairs(elements.map((a) => [a, false])),
  statusImmunities: fromPairs(statuses.map((a) => [a, false])),
} as const

const enemyIndex = computed(() => enemyMap.get(id.value) ?? -1)
const entry = computed(() => enemyEntries[enemyIndex.value])

const enemyStats = reactive(cloneDeep(enemyBase))

watch(
  () => id.value,
  async () => {
    if (entry.value?.isExisted) {
      const value: Enemy | null = await extraEnemyStorage.getItem(entry.value.cacheKey)
      Object.assign(enemyStats, initValue(value))
    }
  },
  { immediate: true },
)

const enemyObj = computed(() => mapValues(enemyStats, (v) => Object.keys(v).filter((k) => v[k])))
const enemyJson = computed(() =>
  pickBy(enemyObj.value, (v) => (isArray(v) ? v.length > 0 : v !== undefined)),
)
watch(enemyJson, async () => {
  if (entry.value?.isExisted && size(enemyJson.value) > 0) {
    await extraEnemyStorage.setItem(entry.value.cacheKey, enemyJson.value)
  }
})
const enemyToml = computed(() => stringify(enemyJson.value))

function initValue(cache: Enemy | undefined | null = undefined) {
  return mapValues(cloneDeep(enemyBase), (value, key) => {
    const m = (cache ?? entry.value?.enemyStats)?.[key]
    if (isUndefined(m)) {
      return value
    } else {
      return mapValues(value, (_, k) => m.includes(k as string))
    }
  })
}

function toggle(key: string, value: string) {
  for (const m in enemyStats) {
    const k = m as keyof typeof enemyStats
    if (k.startsWith('element')) {
      if (k === key) {
        enemyStats[k][value] = !enemyStats[k][value]
      } else {
        enemyStats[k][value] = false
      }
    } else {
      if (k === key) {
        enemyStats[k][value] = !enemyStats[k][value]
      }
    }
  }
}

const { copy, copied, isSupported } = useClipboard({ source: enemyToml.value })
async function resetAll() {
  await extraEnemyStorage.clear()
  window.location.reload()
}
</script>

<template>
  <DefaultLayout :title="$t('tools.enemy')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <template v-slot:tools>
      <v-dialog
        close-on-back
        opacity="0.1"
        transition="fade-transition"
        :max-width="$vuetify.display.mobile ? undefined : 600"
      >
        <template v-slot:activator="{ props: activator }">
          <v-btn v-bind="activator" :icon="mdiToolbox"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card :rounded="!$vuetify.display.mobile">
            <v-toolbar>
              <v-toolbar-title>{{ $t('tools.enemy') }} </v-toolbar-title>
              <template v-slot:append>
                <v-btn :icon="mdiClose" variant="text" @click="isActive.value = false"></v-btn>
              </template>
            </v-toolbar>

            <v-list lines="two">
              <v-dialog transition="fade-transition">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" :prepend-icon="mdiRestoreAlert">
                    <v-list-item-title>
                      {{ $t('enemy.restore') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot="{ isActive }">
                  <v-sheet class="pa-4 text-center mx-auto w-100" rounded>
                    <v-icon :icon="mdiRestoreAlert" color="error" class="mb-4" size="112"> </v-icon>
                    <v-list-item>
                      <v-list-item-title>
                        <h2 class="text-h5 mb-4">
                          {{ $t('tools.enemy') }}
                        </h2>
                      </v-list-item-title>
                    </v-list-item>
                    <div class="d-flex flex-column ga-3">
                      <v-btn
                        block
                        color="error"
                        @click="
                          () => {
                            isActive.value = false
                            resetAll()
                          }
                        "
                      >
                        {{ $t('enemy.restore') }}
                      </v-btn>
                      <v-btn block color="secondary">
                        {{ $t('update.dismiss') }}
                      </v-btn>
                    </div>
                  </v-sheet>
                </template>
              </v-dialog>
            </v-list>
          </v-card>
        </template>
      </v-dialog>
    </template>

    <v-container fluid class="px-2 mx-auto d-flex flex-column ga-2" :max-width="900">
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
              :items="Object.values(enemyEntries)"
              item-title="name"
              item-value="cacheKey"
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
                    <span>
                      {{ ` | ${getOptionValueName('category', item.raw.category)}` }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-list-item-title>
        </v-list-item>
      </v-card>

      <v-slide-y-transition>
        <v-card v-if="entry?.isExisted" border="md">
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
                  color="warning"
                  :text="getOptionValueName('category', entry.category)"
                ></v-chip>
                <v-chip
                  v-if="entry.raw.rarity"
                  size="x-small"
                  :prepend-icon="mdiDiamondStone"
                  :color="entry.rarityTextColor"
                  :text="getOptionValueName('rarity', entry.raw.rarity)"
                ></v-chip>
              </div>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title>
              {{ $t('enemy.stats.title') }}
            </v-list-item-title>
            <template v-slot:append>
              <v-btn
                variant="text"
                color="default"
                :disabled="enemyIndex < 1"
                @click="
                  router.push({
                    query: { ...route.query, id: enemyEntries[enemyIndex - 1]?.cacheKey },
                  })
                "
                :icon="mdiArrowLeft"
              ></v-btn>
              <v-btn
                variant="text"
                color="default"
                class="text-decoration-none"
                @click="
                  router.push({
                    query: { ...route.query, id: enemyEntries[enemyIndex + 1]?.cacheKey },
                  })
                "
                :disabled="enemyIndex >= enemyEntries.length - 1"
                :icon="mdiArrowRight"
              ></v-btn>
              <v-btn
                variant="text"
                color="default"
                :icon="mdiRestore"
                @click="Object.assign(enemyStats, initValue())"
              ></v-btn>
              <v-btn
                variant="text"
                color="default"
                @click="copy(enemyToml)"
                v-if="isSupported"
                :icon="copied ? mdiClipboardCheckOutline : mdiClipboardOutline"
              ></v-btn>
              <v-btn
                variant="text"
                color="default"
                v-if="config.extraDataPrefix"
                :href="`${config.extraDataPrefix}/${entry.cacheKey}.toml`"
                target="_blank"
                :icon="mdiPencilCircleOutline"
              ></v-btn>
            </template>
          </v-list-item>

          <template v-for="(value, key) in enemyStats" :key="key">
            <v-divider></v-divider>
            <v-list-item>
              <template v-slot:title>
                <v-list-item-title>
                  {{ $t('enemy.stats.' + key) }}
                </v-list-item-title>
              </template>
              <template v-slot:subtitle>
                <template v-if="key.startsWith('element')">
                  <v-chip-group :model-value="enemyObj[key]" multiple column filter variant="tonal">
                    <template v-for="k in elements" :key="key + k">
                      <v-chip
                        rounded="lg"
                        size="small"
                        :color="colors[k]"
                        :value="k"
                        @click="() => toggle(key, k)"
                      >
                        {{ getOptionValueName('element', k) }}
                      </v-chip>
                    </template>
                  </v-chip-group>
                </template>
                <template v-if="key.startsWith('status')">
                  <v-chip-group :model-value="enemyObj[key]" multiple column variant="flat">
                    <template v-for="k in statuses" :key="k">
                      <v-chip
                        rounded="lg"
                        size="small"
                        color="primary"
                        :value="k"
                        @click="() => toggle(key, k)"
                      >
                        {{ getOptionValueName('status', k) }}
                      </v-chip>
                    </template>
                  </v-chip-group>
                </template>
              </template>
            </v-list-item>
          </template>
        </v-card>
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-card v-if="entry?.isExisted && enemyToml !== ''" border="md">
          <v-card-title>
            {{ 'Toml' }}
          </v-card-title>
          <v-card-text>
            <div class="bg-surface-light rounded-lg px-4 py-2">
              <code class="text-pre-wrap text-subtitle-2">{{ enemyToml }}</code>
            </div>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-container>
  </DefaultLayout>
</template>
