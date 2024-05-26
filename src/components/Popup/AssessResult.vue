<script setup lang="ts">
import { getQualityName } from '@/plugins/assess';
import type { CodexEntry } from '@/plugins/codex';
import { global } from '@/plugins/global';
import type { GuideEntry } from '@/plugins/guide';
import type { AssessResult } from '@/types';
import { type PropType } from 'vue';
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-paper class="popup-assess">
      <var-cell class="text-cell">
        <var-space justify="center" class="text-lg">
          {{ ce.lang.name }}
        </var-space>
        <template #description>
          <var-space align="center" justify="center" size="mini" line class="py-1">
            <var-chip v-if="qualityName !== undefined" size="small" :color="global.qualityColor[qualityName]">
              <template #left>
                <div class="i-mdi-clover text-md" />
              </template>
              {{ $t(`query.qualitylabel.${qualityName}`) }}
            </var-chip>
            <var-chip size="small" :type="resultChipType">
              <template #left>
                <div v-if="qualityName === undefined" class="i-mdi-close-circle text-md" />
                <div v-else-if="result.exact === false" class="i-mdi-alert-circle text-md" />
                <div v-else class="i-mdi-checkbox-marked-circle text-md" />
              </template>
              {{ `${(result.quality * 100).toFixed()}%` }}
            </var-chip>
            <var-chip v-if="result.range !== undefined" size="small" type="info">
              <template #left>
                <div class="i-mdi-database-search text-md" />
              </template>
              {{ result.range.map((x) => `${x}%`).join('-') }}
            </var-chip>
          </var-space>
        </template>
      </var-cell>
      <var-table :elevation="2" class="assess-table" :scroller-height="result.levels !== 1 ? '65vh' : undefined">
        <thead>
          <tr>
            <th> {{ $t('query.level') }} </th>
            <th v-for="key in Object.keys(result.stats)" :key="key">{{ $t(`meta.stats.${key}`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {{ $t('query.base') }} </td>
            <td v-for="stat, index in Object.values(result.stats)" :key="index">
              {{ stat.base }}
            </td>
          </tr>
          <tr v-for="(_, i) in Array.from({ length: result.levels === undefined ? 13 : result.levels })" :key="i">
            <td>{{ i + 1 }}</td>
            <td v-for="stat, index in Object.values(result.stats)" :key="index">
              {{ stat.values[i] }}
            </td>
          </tr>
        </tbody>
        <thead style="border-bottom: unset; border-top: thin solid var(--color-outline);">
          <tr>
            <th> {{ $t('query.level') }} </th>
            <th v-for="key in Object.keys(result.stats)" :key="key">{{ $t(`meta.stats.${key}`) }}</th>
          </tr>
        </thead>
      </var-table>
      <var-space justify="space-around" class="pt-2">
        <var-button type="primary" icon-container @click="$emit('update:show', false)">
          {{ $t('close') }}
        </var-button>
      </var-space>
    </var-paper>
  </var-popup>
</template>

<script lang="ts">
export default {
  inject: ['view', 'guide'],
  props: {
    result: {
      type: Object as PropType<AssessResult>,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    ge() {
      return this.guide as GuideEntry
    },
    qualityName(): string | undefined {
      return getQualityName(this.result.quality, this.ce.isAccessory);
    },
    resultChipType() {
      if (this.qualityName === undefined) {
        return 'danger'
      } else {
        return this.result.exact !== false ? 'primary' : 'warning'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.assess-table {
  white-space: nowrap;
}

.assess-table {
  thead th {
    text-align: center;
    position: sticky;
    top: 0;
    background-color: var(--table-background);
    border-bottom: var(--table-thead-tr-border-bottom);
  }

  tbody td {
    text-align: center;
  }
}

.popup-assess {
  border-radius: 16px;
  max-width: 85vw;
}

@media screen and (max-width: 320px) {
  .popup-assess {
    padding: 16px 6px;
  }
}

@media screen and (min-width: 375px) {
  .popup-assess {
    padding: 16px 9px;
  }
}

@media screen and (min-width: 768px) {
  .popup-assess {
    padding: 24px 12px;
    max-width: 768px;
  }
}
</style>