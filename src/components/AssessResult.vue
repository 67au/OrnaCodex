<script setup lang="ts">
import { useCodexViewState } from '@/store';
import { type PropType } from 'vue';
import { type AssessResult } from '@/plugins/assess';
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-paper class="popup-assess">
      <var-space align="center" justify="space-between" style="margin-bottom: 4px">
        <span>{{ codexViewState.lang['name'] }}</span>
        <var-chip size="small" :type="result['quality'] > 0 ? 'primary' : 'danger'">
          <template #left>
            <var-icon v-if="result['quality'] > 0" name="checkbox-marked-circle" size="small" />
            <var-icon v-else name="close-circle" size="small" />
          </template>
          {{ `${(result['quality'] * 100).toFixed()}%` }}
        </var-chip>
      </var-space>
      <var-table :elevation="2" class="assess-table" scroller-height="65vh">
        <thead>
          <tr>
            <th> {{ $t('query.level') }} </th>
            <th v-for="key in Object.keys(result['stats'])" :key="key">{{ $t(`meta.stats.${key}`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {{ $t('query.base') }} </td>
            <td v-for="stat, index in (Object.values(result['stats']) as StatValue)" :key="index">
              {{ stat['base'] }}
            </td>
          </tr>
          <tr v-for="(_, i) in Array.from({ length: result.levels === undefined ? 13 : result.levels })" :key="i">
            <td>{{ i + 1 }}</td>
            <td v-for="stat, index in (Object.values(result['stats']) as StatValue)" :key="index">
              {{ stat['values'][i] }}
            </td>
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
  tbody td{
    text-align: center;
  }
}

.popup-assess {
  border-radius: 16px;
}

@media screen and (max-width: 320px) {
  .popup-assess {
    padding: 18px 6px;
    width: 85vw;
  }
}

@media screen and (min-width: 375px) {
  .popup-assess {
    padding: 18px 9px;
    width: 85vw;
  }
}

@media screen and (min-width: 768px) {
  .popup-assess {
    padding: 24px 12px;
    width: 85vw;
    max-width: 768px;
  }
}
</style>