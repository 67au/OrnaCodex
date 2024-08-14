<script setup lang="ts">
import { getQualityName } from '@/plugins/assess'
import type { CodexEntry } from '@/plugins/codex'
import { global } from '@/plugins/global'
import type { GuideEntry } from '@/plugins/guide'
import type { AssessResult } from '@/types'
import { type PropType } from 'vue'
</script>

<template>
  <PopupPaper :show="show" @update:show="$emit('update:show', $event)" max-width="lg">
    <template #title>
      <var-chip class="text-md" type="default" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-magnify" />
        </template>
        <div>{{ $t('assess') }}</div>
      </var-chip>
    </template>
    <var-cell class="text-cell">
      <var-space justify="center" class="text-lg py-2">
        {{ ce.lang.name }}
      </var-space>
      <template #description>
        <var-space align="center" justify="center" size="mini" line class="py-1">
          <var-chip
            v-if="qualityName !== undefined"
            size="small"
            :color="global.qualityColor[qualityName]"
            elevation="1"
          >
            <template #left>
              <div class="i-mdi-clover text-md" />
            </template>
            {{ $t(`query.qualitylabel.${qualityName}`) }}
          </var-chip>
          <var-chip size="small" :type="resultChipType" elevation="1">
            <template #left>
              <div v-if="qualityName === undefined" class="i-mdi-close-circle text-md" />
              <div v-else-if="result.exact === false" class="i-mdi-alert-circle text-md" />
              <div v-else class="i-mdi-checkbox-marked-circle text-md" />
            </template>
            {{ `${(result.quality * 100).toFixed()}%` }}
          </var-chip>
          <var-chip
            v-if="result.range !== undefined && result.range[0] !== result.range[1]"
            size="small"
            type="info"
          >
            <template #left>
              <div class="i-mdi-database-search text-md" />
            </template>
            {{ result.range.map((x) => `${x}%`).join('-') }}
          </var-chip>
        </var-space>
      </template>
    </var-cell>
    <var-table
      elevation="3"
      class="assess-table"
      :scroller-height="result.levels !== 1 && windowHeight < 1135 ? '65vh' : undefined"
    >
      <thead>
        <tr>
          <th>{{ $t('query.level') }}</th>
          <th v-for="key in Object.keys(result.stats)" :key="key">{{ $t(`meta.stats.${key}`) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('query.base') }}</td>
          <td v-for="(stat, index) in Object.values(result.stats)" :key="index">
            {{ stat.base }}
          </td>
        </tr>
        <tr
          v-for="(_, i) in Array.from({ length: result.levels === undefined ? 13 : result.levels })"
          :key="i"
        >
          <td>{{ i + 1 }}</td>
          <td v-for="(stat, index) in Object.values(result.stats)" :key="index">
            {{ stat.values[i] }}
          </td>
        </tr>
      </tbody>
      <thead style="border-bottom: unset; border-top: thin solid var(--color-outline)">
        <tr>
          <th>{{ $t('query.level') }}</th>
          <th v-for="key in Object.keys(result.stats)" :key="key">{{ $t(`meta.stats.${key}`) }}</th>
        </tr>
      </thead>
    </var-table>
  </PopupPaper>
</template>

<script lang="ts">
export default {
  inject: ['view', 'guide'],
  props: {
    result: {
      type: Object as PropType<AssessResult>,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    isGuide: {
      type: Boolean
    }
  },
  data() {
    return {
      windowHeight: window.innerHeight
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowHeight = window.innerHeight
    }
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    ge() {
      return this.guide as GuideEntry
    },
    qualityName(): string | undefined {
      return getQualityName(this.result.quality, this.ce.isAccessory)
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
</style>
