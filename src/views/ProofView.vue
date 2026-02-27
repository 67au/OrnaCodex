<script setup lang="ts">
import DropsItem from '@/components/cards/DropsItem.vue'
import { useCodexState } from '@/stores/codex'
import { getOptionValueName } from '@/utils'
import { CodexEntry, getCodexEntryByKey } from '@/utils/codex'
import { mdiMagnify } from '@mdi/js'
import { isNull, isUndefined, mapValues } from 'es-toolkit'
import { get } from 'es-toolkit/compat'

const proofScaling: Record<string, number> = {
  'proof-of-anguish': 1,
  'proof-of-agony': 1,
  'proof-of-despair': 1,
  'proof-of-melancholy': 1,
  'proof-of-torment': 1,
  'tower-shard': 200,
  coral: 20,
  'proof-of-monument': 10,
  'proof-of-felling': 20,
  'proof-of-sparring': 4,
  deepshard: 20,
  'proof-of-trials': 2,
  'proof-of-effort': 2,
  'proof-of-remembrance': 2,
} as const

const rarityScaling: Record<string, number> = {
  common: 0,
  rare: 1,
  famed: 2,
  legendary: 3,
} as const

// fp
const calScaling = 100

const codexState = useCodexState()

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

const proofEntries = Object.keys(proofScaling)
  .map((id) => getCodexEntryByKey('items/' + id))
  .filter((v) => !isUndefined(v))

function getBaseExchangeRate(entry: CodexEntry) {
  if (entry?.tier && entry?.rarity) {
    return entry.tier * 10 + get(rarityScaling, entry.rarity, 0) * 5
  }
  return undefined
}

const materialBaseExchangeRate = new Map(
  codexState.materialEntries.map((entry) => {
    return [entry.key, getBaseExchangeRate(entry)]
  }),
)

const proofExchangeRates = computed(() =>
  mapValues(proofScaling, (v) => {
    const rate = materialBaseExchangeRate.get(id.value ?? '')
    if (isUndefined(rate)) {
      return 0
    }
    return v * rate
  }),
)

const count = ref(0)

const proofCounts = computed(() => {
  return mapValues(proofExchangeRates.value, (r) => {
    return Math.ceil((count.value * r) / calScaling)
  })
})

function updateMaterialCount(id: string) {
  if (isUndefined(proofCounts.value[id]) || isUndefined(proofExchangeRates.value[id])) {
    //
  } else {
    count.value = Math.floor((proofCounts.value[id] * calScaling) / proofExchangeRates.value[id])
  }
}
</script>

<template>
  <v-container fluid class="pa-2 mx-auto d-flex flex-column ga-2" :max-width="900">
    <v-card class="border-secondary border-md">
      <v-autocomplete
        hide-details
        single-line
        :label="$t('proof.choiceMaterial')"
        variant="solo-filled"
        rounded="lg"
        density="compact"
        :items="codexState.materialEntries"
        item-title="name"
        item-value="key"
        v-model="id"
        clearable
        class="pa-2"
      >
        <template v-slot:prepend-inner>
          <v-icon :icon="mdiMagnify" />
        </template>
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
                v-if="item.rarity"
                :text="getOptionValueName('rarity', item.rarity)"
                :color="item.rarityTextColor"
                size="x-small"
              />
              <v-chip
                :text="`${$t('proof.baseRate')}: 100:${materialBaseExchangeRate.get(item.key)}`"
                color="blue-grey-lighten-2"
                size="x-small"
              />
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-card>

    <v-slide-y-transition>
      <v-card v-if="entry" class="py-1">
        <DropsItem :entry="entry" />
      </v-card>
    </v-slide-y-transition>

    <v-slide-y-transition>
      <v-card v-if="entry" >
        <div class="d-flex flex-column ga-2 pa-2">
          <v-number-input
            density="compact"
            :label="$t('proof.count')"
            v-model="count"
            controlVariant="stacked"
            hide-details
            inset
            class="pt-1"
            clearable
          />
          <v-divider thickness="2" />
          <v-row :gap="8">
            <template v-for="proof in proofEntries" :key="proof.id">
              <v-col cols="6" md="4" lg="3">
                <v-number-input
                  density="compact"
                  color="default"
                  :label="proof.name"
                  v-model="proofCounts[proof.id]"
                  controlVariant="hidden"
                  hide-details
                  inset
                  class="pt-1"
                  @update:model-value="updateMaterialCount(proof.id)"
                >
                  <template v-slot:prepend-inner>
                    <v-avatar size="24" :rounded="false" class="mr-1">
                      <v-img :src="proof.iconUrl" :class="proof.iconClass" />
                    </v-avatar>
                  </template>
                </v-number-input>
              </v-col>
            </template>
          </v-row>
        </div>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>
