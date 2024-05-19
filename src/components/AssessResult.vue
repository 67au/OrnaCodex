<script setup lang="ts">
import { useCodexViewState } from '@/store';
import { type PropType } from 'vue';
import { type AssessResult, getQualityName } from '@/plugins/assess';
import { global } from '@/store';
import { isAccessory } from '@/plugins/item_utils';
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-paper class="popup-assess">
      <var-space align="center" justify="space-between" size="large" style="margin: 0 4px 4px;" line>
        <span>{{ codexViewState.lang['name'] }}</span>
          <var-space align="center" justify="flex-end" size="mini" line>
            <var-chip size="small" :type="qualityName === undefined ? 'danger' : 'primary'">
              <template #left>
                <var-icon v-if="qualityName === undefined" name="close-circle" size="small" />
                <var-icon v-else name="checkbox-marked-circle" size="small" />
              </template>
              {{ `${(result.quality * 100).toFixed()}%` }}
            </var-chip>
            <var-chip v-if="qualityName !== undefined" size="small" :color="global.qualityColor[qualityName]">
              {{ $t(`query.qualitylabel.${qualityName}`) }}
            </var-chip>
          </var-space>
      </var-space>
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
            <td v-for="stat, index in (Object.values(result.stats) as StatValue)" :key="index">
              {{ stat['base'] }}
            </td>
          </tr>
          <tr v-for="(_, i) in Array.from({ length: result.levels === undefined ? 13 : result.levels })" :key="i">
            <td>{{ i + 1 }}</td>
            <td v-for="stat, index in (Object.values(result.stats) as StatValue)" :key="index">
              {{ stat['values'][i] }}
            </td>
          </tr>
          <tr>
            <td> {{ $t('query.level') }} </td>
            <td v-for="key in Object.keys(result.stats)" :key="key">{{ $t(`meta.stats.${key}`) }}</td>
          </tr>
        </tbody>
      </var-table>
      <var-space justify="space-around" style="margin-top: 4px;">
        <var-button type="primary" icon-container @click="$emit('update:show', false)">
          {{ $t('close') }}
        </var-button>
      </var-space>
    </var-paper>
  </var-popup>
</template>

<script lang="ts">
const codexViewState = useCodexViewState();
type StatValue = Array<any>;

export default {
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
    qualityName(): string | undefined {
      return getQualityName(this.result.quality, isAccessory(codexViewState.item));
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
    padding: 18px 6px;
  }
}

@media screen and (min-width: 375px) {
  .popup-assess {
    padding: 18px 9px;
  }
}

@media screen and (min-width: 768px) {
  .popup-assess {
    padding: 24px 12px;
    max-width: 768px;
  }
}
</style>