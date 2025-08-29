<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getOptionValueName } from '@/plugins'
import { CodexEntryFactory } from '@/plugins/codex'
import { useCodexState } from '@/stores/codex'
import { mdiDiamondStone, mdiMagnify } from '@mdi/js'
import { isNull, mapValues } from 'es-toolkit'

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

const calScaling = 100

const route = useRoute()
const router = useRouter()

const codexState = useCodexState()

const materialEntries = Object.keys(codexState.codex?.['items'] ?? {})
  .map((key) => CodexEntryFactory.getEntry('items', key))
  .filter((e) => e.isMaterial)

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

const count = ref(0)

const proofEntries = Object.keys(proofScaling).map((k) => CodexEntryFactory.getEntry('items', k))

const proofRate = computed(() =>
  mapValues(proofScaling, (v) => {
    if (entry.value.raw.tier && entry.value.raw.rarity) {
      return v * (entry.value.raw.tier * 10 + rarityScaling[entry.value.raw.rarity]! * 5)
    }
    return 0
  }),
)

const proofCount = computed(() =>
  mapValues(proofRate.value, (v) => {
    return Math.ceil((count.value * v) / calScaling)
  }),
)

function updateMaterialCount(id: string) {
  count.value = Math.floor((proofCount.value[id]! * calScaling) / proofRate.value[id]!)
}
</script>

<template>
  <DefaultLayout :title="$t('tools.proof')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <v-container fluid class="px-4 mx-auto d-flex flex-column ga-2" :max-width="900">
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
              :items="materialEntries"
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
                    <template v-if="item.raw.raw.rarity">
                      <span> | </span>
                      <span :class="item.raw.rarityTextClass">
                        {{ getOptionValueName('rarity', item.raw.raw.rarity) }}
                      </span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-list-item-title>
        </v-list-item>
      </v-card>

      <v-slide-y-transition>
        <v-card v-if="entry.isExisted" border="md">
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
            <v-number-input
              density="compact"
              :label="$t('proof.count')"
              v-model="count"
              controlVariant="stacked"
              hide-details
              inset
              clearable
              class="py-2"
            >
            </v-number-input>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-row dense class="py-2">
              <template v-for="entry in proofEntries" :key="entry.id">
                <v-col cols="6" lg="4">
                  <v-number-input
                    density="compact"
                    :label="entry.name"
                    v-model="proofCount[entry.id]"
                    controlVariant="stacked"
                    hide-details
                    inset
                    class="py-1"
                    @update:model-value="updateMaterialCount(entry.id)"
                  >
                    <template v-slot:prepend-inner>
                      <v-avatar size="24" :rounded="false" class="mx-2">
                        <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
                      </v-avatar>
                    </template>
                  </v-number-input>
                </v-col>
              </template>
            </v-row>
          </v-list-item>
        </v-card>
      </v-slide-y-transition>
    </v-container>
  </DefaultLayout>
</template>
