<script setup lang="ts">
import { i18n } from '@/i18n'
import { getOptionName, getOptionValueName, getStatConditionName } from '@/plugins'
import { bossScalingItems, bossScalingName, useQualityResult } from '@/plugins/assess'
import type { CodexEntry } from '@/plugins/codex'
import { getStatValueString } from '@/plugins/sort'
import { mdiClose, mdiEye } from '@mdi/js'

const dialog = shallowRef(false)
const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

const base = {
  quality: 200,
  level: props.entry.isUpgradable ? 13 : 1,
  bossScaling: props.entry.bossScaling,
  qualityCode: -1,
  angLevel: 0,
}
const query = ref(base)

// watch(dialog, (newValue) => {
//   if (newValue) {
//     query.value = base
//   }
// })

const result = computed(() => {
  return useQualityResult({
    entry: props.entry,
    query: query.value,
  })
})

const qualityCodeItems = [
  { title: i18n.global.t('compare.quality.default'), value: -1 },
  { title: i18n.global.t('compare.quality.masterforged'), value: 7 },
  { title: i18n.global.t('compare.quality.demonforged'), value: 8 },
  { title: i18n.global.t('compare.quality.godforged'), value: 9 },
]

function itemProps(item: { value: number; title: string }) {
  return {
    title: i18n.global.t(item.title),
    value: item.value,
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    :opacity="$vuetify.display.mobile ? 0 : 0.2"
    :transition="$vuetify.display.mobile ? 'dialog-bottom-transition' : 'fade-transition'"
    :fullscreen="$vuetify.display.mobile"
    scrollable
    :max-width="$vuetify.display.mobile ? undefined : 600"
  >
    <template v-slot:activator="{ props: activator }">
      <v-btn
        :icon="mdiEye"
        color="secondary"
        name="activator"
        variant="text"
        v-bind="activator"
      ></v-btn>
    </template>
    <v-card :rounded="!$vuetify.display.mobile">
      <v-toolbar v-if="$vuetify.display.mobile">
        <v-btn :icon="mdiClose" @click="dialog = false"></v-btn>

        <v-toolbar-title>{{ $t('tools.gearViewer') }}</v-toolbar-title>
      </v-toolbar>

      <v-toolbar v-else>
        <v-toolbar-title>{{ $t('tools.gearViewer') }}</v-toolbar-title>
        <template v-slot:append>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </template>
      </v-toolbar>

      <v-card-text>
        <v-sheet class="mx-auto w-100" max-width="600" border="md" rounded="lg">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar size="48" :rounded="false">
                <v-img :src="props.entry.iconUrl" :class="props.entry.iconClass"></v-img>
              </v-avatar>
            </template>
            <template v-slot:title>
              <v-list-item-title style="white-space: normal">
                {{ props.entry.name }}
              </v-list-item-title>
            </template>
            <template v-slot:subtitle>
              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip
                  rounded
                  size="x-small"
                  color="warning"
                  :text="props.entry.tierName"
                ></v-chip>

                <v-chip
                  rounded
                  size="x-small"
                  color="secondary"
                  v-if="props.entry.isUpgradable"
                  :text="$t(bossScalingName[props.entry.bossScaling])"
                ></v-chip>

                <v-chip rounded size="x-small" v-if="props.entry.raw.exotic" color="tertiary">
                  <div class="exotic">{{ getOptionName('exotic') }}</div>
                </v-chip>
              </div>
            </template>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item>
            <v-row dense class="py-2">
              <v-col cols="6" sm="3">
                <v-select
                  v-model="query.bossScaling"
                  :items="bossScalingItems"
                  :item-props="itemProps"
                  hide-details
                  inset
                  :disabled="!props.entry.isUpgradable"
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.bossScaling.title') }}</div>
                  </template>
                  <template v-slot:selection="{ item }">
                    {{ item.title }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-if="props.entry.isAccessory"
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
                  <template v-slot:selection="{ item }">
                    {{ item.title }}
                  </template>
                </v-select>
                <v-select
                  v-else
                  v-model="query.level"
                  :items="Array.from({ length: 13 }, (_, i) => i + 1)"
                  hide-details
                  inset
                  :disabled="!props.entry.isUpgradable"
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.level') }}</div>
                  </template>
                  <template v-slot:selection="{ item }">
                    {{ item.title }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="6" sm="3">
                <v-number-input v-model="query.quality" controlVariant="stacked" hide-details inset>
                  <template v-slot:label>
                    <div>{{ $t('assess.quality.title') }}</div>
                  </template>
                </v-number-input>
              </v-col>
              <v-col cols="6" sm="3">
                <v-number-input
                  v-if="props.entry.isUpgradable"
                  v-model="query.angLevel"
                  controlVariant="stacked"
                  hide-details
                  inset
                >
                  <template v-slot:label>
                    <div>{{ $t('assess.anglevel.title') }}</div>
                  </template>
                </v-number-input>
              </v-col>
            </v-row>
          </v-list-item>

          <template v-for="(stat, key) in result.stats" :key="key">
            <v-divider></v-divider>
            <v-list-item class="px-4" density="compact">
              <template v-slot:title>
                <v-list-item-title class="text-subtitle-2">
                  {{ getOptionValueName('stats', key) }}
                  <template
                    v-if="
                      result.entry.raw.stats_conditions?.[key as string] !== undefined &&
                      key !== undefined
                    "
                  >
                    {{ ` (${getStatConditionName(result.entry, key)})` }}
                  </template>
                </v-list-item-title>
              </template>
              <v-list-item-subtitle class="text-right">
                {{ getStatValueString(result.entry, key, stat) }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-sheet>
      </v-card-text>
      <v-sheet class="pb-8" v-if="$vuetify.display.mobile"></v-sheet>
    </v-card>
  </v-dialog>
</template>
