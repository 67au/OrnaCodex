<script setup lang="ts">
import type { AssessQuery } from '@/plugins/assess';
import { useCodexViewState, useGuideState, useItemsMetaState } from '@/store';
import type { PropType } from 'vue';
</script>

<template>
  <var-dialog :show="show" @update:show="$emit('update:show', $event)" :cancel-button="false" dialog-class="dialog">
    <template #title>
      <var-space align="center" justify="space-between">
        <span>
          <var-icon name="magnify" /> {{ title }}
        </span>
        <var-chip size="small" :type="isGuide ? 'success' : 'warning'">
          {{ isGuide ? 'Guide' : 'YACO' }}
        </var-chip>
      </var-space>
    </template>
    <div>
      <var-row :gutter="[8, 4]" align="center">
        <var-col :span="24" >
          <var-cell class="codex-small-cell">
            <span> {{ codexViewState.lang['name'] }} </span>
            <template #description>
              <var-space size="mini" align="center" v-if="!codexViewState.isCelestialWeapon && codexViewState.isUpgradable">
                <span style="font-size: var(--cell-description-font-size); color: var(--cell-description-color);">
                {{ $t('query.isBoss') }}:
                </span>
                <var-chip type="warning" size="mini" plain>
                  YACO: {{ scaleText[codexViewState.bossScale] }}
                </var-chip>
                <var-chip v-if="guideState.boss !== undefined" type="success" size="mini" plain>
                  Guide: {{ guideState.boss ? scaleText[1] : scaleText[-1] }}
                </var-chip>
              </var-space>
            </template>
          </var-cell>
        </var-col>
        <var-col :span="8">
          <div class="assess">
            <var-select variant="outlined" :placeholder="$t('query.isBoss')" v-model="query.extra.isBoss" size="small"
              :disabled="query.extra.fromGuide || codexViewState.isCelestialWeapon || !codexViewState.isUpgradable">
              <var-option :label="$t('yes')" :value="true" />
              <var-option :label="$t('no')" :value="false" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-if="query.extra.isQuality">
          <div class="assess">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`query.quality`)"
              v-model="(query.data.quality as any)" :rules="[(v) => (Number(v) > 70 && Number(v) < 210) || '']"
              :disabled="codexViewState.isCelestialWeapon" />
          </div>
        </var-col>
        <var-col :span="8">
          <div class="assess">
            <var-select variant="outlined" :placeholder="$t('query.level')" v-model="query.data.level" size="small"
              :disabled="query.extra.isQuality || !codexViewState.isUpgradable">
              <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (_, i) => i + 1)" :key="i" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-for="key in Object.keys(baseStats)" :key="key">
          <div class="assess" v-if="!immutableKeysSet.has(key)">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`meta.stats.${key}`)"
              v-model="(query.data[key] as any)" :disabled="query.extra.isQuality" />
          </div>
        </var-col>
        <var-col :span="24">
          <var-button block type="primary" @click="queryFunc()">
            {{ $t('query.query') }}
          </var-button>
        </var-col>
      </var-row>
    </div>
  </var-dialog>
</template>

<script lang="ts">
const codexViewState = useCodexViewState();
const itemsMetaState = useItemsMetaState();
const guideState = useGuideState();
const immutableKeysSet = new Set(['adornment_slots']);

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    query: {
      type: Object as PropType<AssessQuery>,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    queryFunc: {
      type: Function,
      required: true,
    }
  },
  computed: {
    baseStats() {
      return this.query.extra.baseStats;
    },
    isGuide() {
      return this.query.extra.fromGuide && !codexViewState.isCelestialWeapon;
    },
    bossScale() {
      return itemsMetaState.getBossScale(codexViewState.page.id);
    },
    scaleText(): Record<number, string> {
      return {
        '-1': this.$t('no'),
        '0': this.$t('notfound'),
        '1': this.$t('yes'),
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  width: 85vw;
  max-width: 425px;
}
</style>