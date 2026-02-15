<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { getElementColor, getOptionValueName } from '@/utils'
import { getCodexEntryByKey } from '@/utils/codex'
import {
  mdiCheckDecagramOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClipboardCheckOutline,
  mdiClipboardOutline,
  mdiMagnify,
  mdiPencil,
  mdiRestore,
} from '@mdi/js'
import { isNull, isUndefined, pickBy } from 'es-toolkit'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import DropsItem from '@/components/cards/DropsItem.vue'
import type { EnemyData } from '@/types/extra'
import { stringify } from 'smol-toml'
import config from '@/config'

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

function setInput(): EnemyData {
  const base = {
    elementWeaknesses: Array<string>(),
    elementImmunities: Array<string>(),
    elementResistances: Array<string>(),
    statusImmunities: Array<string>(),
  } as const

  return base
}

const enemyState = reactive(setInput())
const enemyStateStore: ShallowRef<EnemyData | undefined> = shallowRef(undefined)

const enemyItems = {
  elementWeaknesses: elements,
  elementImmunities: elements,
  elementResistances: elements,
  statusImmunities: statuses,
}

async function reset() {
  if (isUndefined(entry.value)) {
    return
  }
  enemyStateStore.value = await entry.value.getEnemyState()
  if (isUndefined(enemyStateStore.value)) {
    Object.assign(enemyState, setInput())
  }

  Object.assign(enemyState, { ...setInput(), ...enemyStateStore.value })
}

watch(id, () => reset(), { immediate: true })

const enemyIndex = computed(() => {
  if (isUndefined(entry.value)) {
    return -1
  }
  return codexState.enemyOrderMap.get(entry.value.key) ?? -1
})

function jumpEnemy(index: number) {
  router.push({
    query: { ...route.query, id: codexState.enemyEntries[index]?.key },
  })
}

const enemyToml = computed(() => {
  const s = pickBy(enemyState, (v) => {
    if (isUndefined(v)) {
      return false
    }
    return v.length > 0
  })
  return stringify(s)
})

const defaults: DefaultsOptions = {
  VBtn: {
    variant: 'tonal',
    size: 'small',
    rounded: 'lg',
    color: 'default',
  },
  VChip: {
    rounded: 'sm',
  },
}

const { copy, copied, isSupported } = useClipboard({ source: enemyToml.value })
</script>

<template>
  <v-container fluid class="pa-2 mx-auto d-flex flex-column ga-2" :max-width="900">
    <v-defaults-provider :defaults="defaults">
      <v-card class="border-secondary border-md">
        <v-autocomplete
          hide-details
          single-line
          :label="$t('enemy.choice')"
          variant="solo-filled"
          rounded="lg"
          density="compact"
          :items="codexState.enemyEntries"
          item-title="name"
          item-value="key"
          v-model="id"
          clearable
          class="pa-2"
          :prepend-inner-icon="mdiMagnify"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item slim v-bind="props" :text="item.name">
              <template v-slot:prepend>
                <v-avatar :rounded="false">
                  <v-img :src="item.iconUrl" :class="item.iconClass" />
                </v-avatar>
              </template>
              <v-list-item-subtitle class="d-flex ga-1">
                <v-chip :text="item.tierName" color="amber-darken-2" size="x-small" />
                <v-chip
                  :text="getOptionValueName('category', item.category)"
                  color="amber-darken-2"
                  size="x-small"
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
        <v-card v-if="entry">
          <div class="d-flex flex-wrap ga-1 align-center justify-end pa-2">
            <v-spacer />
            <div class="d-flex ga-1">
              <v-tooltip :text="$t('helper.tooltip.provider')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="enemyStateStore"
                    v-bind="props"
                    color="success"
                    :icon="mdiCheckDecagramOutline"
                  />
                </template>
              </v-tooltip>
              <v-btn
                :icon="mdiChevronLeft"
                :disabled="enemyIndex <= 0"
                @click="jumpEnemy(enemyIndex - 1)"
              />
              <v-btn
                :icon="mdiChevronRight"
                :disabled="enemyIndex >= codexState.enemyOrderMap.size - 1"
                @click="jumpEnemy(enemyIndex + 1)"
              />
              <v-btn :icon="mdiRestore" color="error" @click="reset()" />
              <v-btn
                color="secondary"
                @click="copy(enemyToml)"
                v-if="isSupported"
                :icon="copied ? mdiClipboardCheckOutline : mdiClipboardOutline"
              />
              <v-btn
                color="default"
                v-if="config.extraDataPrefix"
                :href="`${config.extraDataPrefix}/enemies/${entry.key}.toml`"
                target="_blank"
                :icon="mdiPencil"
              />
            </div>
          </div>

          <template v-for="(items, key) in enemyItems" :key="key">
            <v-divider />
            <v-list-item :title="$t('enemy.' + key)" class="px-2">
              <v-chip-group column multiple v-model="enemyState[key]">
                <template v-if="key.startsWith('element')">
                  <v-chip
                    size="small"
                    v-for="k in items"
                    :key="k"
                    :color="getElementColor(k)"
                    :text="$t('stats_text.' + k)"
                    :value="k"
                    filter
                  />
                </template>
                <template v-else-if="key.startsWith('status')">
                  <v-chip
                    size="small"
                    v-for="k in items"
                    color="warning"
                    :key="k"
                    :text="$t('status.' + k)"
                    :value="k"
                  />
                </template>
              </v-chip-group>
            </v-list-item>
          </template>
        </v-card>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-card v-if="entry" title="Toml">
          <div class="bg-surface-light rounded-lg mx-4 mb-4 pa-2">
            <code class="text-pre-wrap">
              {{ enemyToml }}
            </code>
          </div>
        </v-card>
      </v-slide-y-transition>
    </v-defaults-provider>
  </v-container>
</template>
