<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import { i18n } from '@/i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getOptionName, getOptionValueName, getSignedNumber } from '@/plugins'
import { bossScalingItems, bossScalingName } from '@/plugins/assess'
import { useCompareState } from '@/stores/compare'
import { mdiChevronDoubleLeft, mdiExport, mdiMagnify, mdiPin, mdiTrashCan } from '@mdi/js'

const compareState = useCompareState()

function itemProps(item: { value: number; title: string }) {
  return {
    title: i18n.global.t(item.title),
    value: item.value,
  }
}

function getDiffTextClass(n: number) {
  if (n > 0) {
    return 'rare-text'
  }
  if (n < 0) {
    return 'ornate-text'
  }
  return ''
}

const qualityCodeItems = computed(() => [
  { title: i18n.global.t('compare.quality.default'), value: -1 },
  { title: i18n.global.t('compare.quality.masterforged'), value: 7 },
  { title: i18n.global.t('compare.quality.demonforged'), value: 8 },
  { title: i18n.global.t('compare.quality.godforged'), value: 9 },
])
</script>

<template>
  <DefaultLayout :title="$t('tools.compare')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <template v-slot:tools>
      <v-fab-transition>
        <v-btn
          :icon="mdiTrashCan"
          @click="compareState.$reset()"
          v-show="compareState.count > 0"
        ></v-btn>
      </v-fab-transition>
    </template>
    <v-container fluid class="px-0">
      <template v-if="compareState.count === 0">
        <v-sheet class="mt-4 pa-4 text-center mx-auto w-100" :max-width="360" rounded="lg">
          <v-empty-state :icon="mdiMagnify" :title="$t('help.notFound')"> </v-empty-state>
          <div class="d-flex flex-column ga-2 align-center">
            <v-btn
              class="w-100 mt-4"
              size="large"
              max-width="300"
              color="info"
              variant="tonal"
              :to="{ name: 'home' }"
              :prepend-icon="mdiExport"
            >
              {{ $t('title') }}
            </v-btn>
          </div>
        </v-sheet>
      </template>
      <v-slide-group class="px-0 mx-auto" center-active v-else>
        <v-spacer style="width: 20px"></v-spacer>
        <template v-for="(result, index) in compareState.comparedResult" :key="index">
          <v-slide-group-item>
            <v-card border="md" :width="220" class="py-1 mr-1 align-self-start">
              <v-list-item class="px-1">
                <template v-slot:prepend>
                  <v-avatar size="36" :rounded="false" class="ml-1 mr-n3">
                    <v-img :src="result.entry.iconUrl" :class="result.entry.iconClass"></v-img>
                  </v-avatar>
                </template>
                <template v-slot:title>
                  <v-list-item-title class="text-caption" style="white-space: normal">
                    {{ result.entry.name }}
                  </v-list-item-title>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="px-2" density="compact">
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    rounded
                    size="x-small"
                    color="warning"
                    :text="result.entry.tierName"
                  ></v-chip>

                  <v-chip
                    rounded
                    size="x-small"
                    color="secondary"
                    v-if="result.entry.isUpgradable"
                    :text="$t(bossScalingName[result.entry.bossScaling])"
                  ></v-chip>

                  <v-chip rounded size="x-small" v-if="result.entry.raw.exotic" color="tertiary">
                    <div class="exotic">{{ getOptionName('exotic') }}</div>
                  </v-chip>
                </div>
              </v-list-item>

              <v-divider></v-divider>
              <v-list-item class="px-2" density="compact">
                <template v-slot:prepend>
                  <div class="d-flex ga-1">
                    <v-btn
                      size="small"
                      color="secondary"
                      :icon="mdiChevronDoubleLeft"
                      variant="tonal"
                      @click="compareState.leftShift(index)"
                      v-if="index > 0"
                    ></v-btn>
                    <v-btn
                      size="small"
                      color="info"
                      :icon="mdiPin"
                      variant="tonal"
                      :ripple="false"
                      v-else
                    ></v-btn>
                  </div>
                </template>
                <template v-slot:append>
                  <div class="d-flex ga-1">
                    <v-btn
                      size="small"
                      color="error"
                      :icon="mdiTrashCan"
                      variant="tonal"
                      @click="compareState.remove(index)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>

              <v-divider></v-divider>
              <v-list-item class="px-1">
                <v-row dense class="py-2">
                  <v-col cols="6">
                    <v-select
                      density="compact"
                      v-model="compareState.list[index].query.bossScaling"
                      :items="bossScalingItems"
                      :item-props="itemProps"
                      hide-details
                      inset
                      :disabled="!result.entry.isUpgradable"
                    >
                      <template v-slot:label>
                        <div>{{ $t('assess.bossScaling.title') }}</div>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="text-caption">{{ item.title }}</div>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-if="result.entry.isAccessory"
                      density="compact"
                      v-model="compareState.list[index].query.qualityCode"
                      :items="qualityCodeItems"
                      item-title="title"
                      item-value="value"
                      hide-details
                      inset
                      :disabled="compareState.list[index].query.quality < 200"
                    >
                      <template v-slot:label>
                        <div>{{ $t('assess.setQualityCode') }}</div>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="text-caption">{{ item.title }}</div>
                      </template>
                    </v-select>
                    <v-select
                      v-else
                      density="compact"
                      v-model="compareState.list[index].query.level"
                      :items="Array.from({ length: 13 }, (_, i) => i + 1)"
                      hide-details
                      inset
                      :disabled="!result.entry.isUpgradable"
                    >
                      <template v-slot:label>
                        <div>{{ $t('assess.level') }}</div>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="text-caption">{{ item.title }}</div>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-number-input
                      density="compact"
                      v-model="compareState.list[index].query.quality"
                      controlVariant="stacked"
                      hide-details
                      inset
                    >
                      <template v-slot:label>
                        <div>{{ $t('assess.quality.title') }}</div>
                      </template>
                    </v-number-input>
                  </v-col>
                </v-row>
              </v-list-item>
              <template v-for="(stat, key) in result.stats" :key="key">
                <v-divider></v-divider>
                <v-list-item class="px-2" density="compact">
                  <template v-slot:title>
                    <v-list-item-title class="text-caption">
                      {{ getOptionValueName('stats', key) }}
                    </v-list-item-title>
                  </template>
                  <v-list-item-subtitle class="text-right">
                    {{ stat.base }}
                    <template v-if="stat.diff !== undefined && stat?.diff !== 0">
                      <span :class="getDiffTextClass(stat.diff)">
                        {{ `(${getSignedNumber(stat.diff)})` }}
                      </span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-card>
          </v-slide-group-item>
        </template>
        <v-spacer style="width: 16px"></v-spacer>
      </v-slide-group>
    </v-container>
  </DefaultLayout>
</template>
