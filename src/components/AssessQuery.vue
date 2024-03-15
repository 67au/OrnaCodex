<script setup lang="ts">
import { store } from '@/store';
</script>

<template>
  <var-dialog :show="show" @update:show="$emit('update:show', $event)" :cancel-button="false">
    <template #title>
    <var-space align="center" justify="space-between">
      <span>
        <var-icon name="magnify" /> {{ title }}
      </span>
      <var-chip size="small" :type="query.extra.fromGuide?'success':'warning'">
        {{ query.extra.fromGuide?'Guide':'YACO' }}
      </var-chip>
    </var-space>
    </template>
    <div> 
      <span> {{ name }} </span>
      <var-row :gutter="[8, 4]" style="margin-top: 8px;" align="center">
        <var-col :span="8">
          <div class="assess">
            <var-select variant="outlined" :placeholder="$t('query.isBoss')" v-model="query.extra.isBoss" size="small"
              :disabled="query.extra.fromGuide">
              <var-option :label="$t('yes')" :value="true" />
              <var-option :label="$t('no')" :value="false" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-if="query.extra.isQuality">
          <div class="assess">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`query.quality`)"
              v-model="query.data.quality" :rules="[(v) => (Number(v)>70 && Number(v) < 210) || '']"/>
          </div>
        </var-col>
        <var-col :span="8">
          <div class="assess">
            <var-select variant="outlined" :placeholder="$t('query.level')" v-model="query.data.level" size="small"
              :disabled="query.extra.isQuality">
              <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (_, i) => i + 1)" :key="i" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-for="key in Object.keys(baseStats)" :key="key">
          <div class="assess">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`meta.stats.${key}`)"
              v-model="query.data[key]" :disabled="query.extra.isQuality" />
          </div>
        </var-col>
        <var-col :span="8">
          <var-button style="width: 100%;" type="primary" @click="queryFunc()">
            {{ $t('query.query') }}
          </var-button>
        </var-col>
      </var-row>
    </div>
  </var-dialog>
</template>

<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
    baseStats: {
      type: Object,
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
    name() {
      return store.codex.basedItem['name'];
    }
  },
}
</script>

<style>
.popup-content {
  padding: 24px;
  width: 85vw;
  max-width: 375px;
  border-radius: 28px;
}
</style>