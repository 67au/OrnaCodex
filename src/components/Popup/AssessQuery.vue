<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex';
import type { GuideEntry } from '@/plugins/guide';
import type { AssessQuery, AssessResult } from '@/types';
import { Snackbar } from '@varlet/ui';
import '@varlet/ui/es/snackbar/style/index';
</script>

<template>
  <var-dialog :show="show" @update:show="$emit('update:show', $event)" :cancel-button="false" dialog-class="dialog">
    <template #title>
      <var-space align="center" justify="space-between">
        <span>
          <var-icon name="magnify" /> {{ title }}
        </span>
        <var-chip size="small" :type="aqExtra.isGuide ? 'success' : 'warning'">
          {{ aqExtra.isGuide ? 'Guide' : 'YACO' }}
        </var-chip>
      </var-space>
    </template>
    <div>
      <var-row :gutter="[8, 4]" align="center">
        <var-col :span="24">
          <var-cell class="text-cell">
            <span> {{ ce.lang.name }} </span>
            <template #description>
              <var-space size="mini" align="center" v-if="!ce.isCelestialWeapon && ce.isUpgradable">
                <var-chip type="warning" size="mini" plain>
                  YACO | {{ scaleText[ce.bossScale] }}
                </var-chip>
                <var-chip v-if="ge.exist" type="success" size="mini" plain>
                  Guide | {{ ge.cache.boss ? scaleText[1] : scaleText[-1] }}
                </var-chip>
              </var-space>
            </template>
          </var-cell>
        </var-col>
        <var-col :span="8">
          <div class="w-full">
            <var-select variant="outlined" :placeholder="$t('query.isBoss')" v-model="aqExtra.isBoss" size="small"
              :disabled="aqExtra.isGuide || aqExtra.isCelestialWeapon || !aqExtra.isUpgradable">
              <var-option :label="$t('yes')" :value="true" />
              <var-option :label="$t('no')" :value="false" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-if="aqExtra.isQuality">
          <div class="w-full">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`query.quality`)"
              v-model="(aqData.quality as any)" :rules="[(v) => (Number(v) > 70 && Number(v) < 210) || '']"
              :disabled="aqExtra.isCelestialWeapon" />
          </div>
        </var-col>
        <var-col :span="8">
          <div class="w-full">
            <var-select variant="outlined" :placeholder="$t('query.level')" v-model="aqData.level" size="small"
              :disabled="aqExtra.isQuality || !aqExtra.isUpgradable">
              <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (_, n) => String(n + 1))"
                :key="i" />
            </var-select>
          </div>
        </var-col>
        <var-col :span="8" v-for="key in Object.keys(aqExtra.baseStats)" :key="key">
          <div class="w-full" v-if="!immutableKeysSet.has(key)">
            <var-input variant="outlined" size="small" type="number" :placeholder="$t(`meta.stats.${key}`)"
              v-model="(aqData[key] as any)" :disabled="aqExtra.isQuality" />
          </div>
        </var-col>
        <var-col :span="24">
          <var-button block type="primary" @click="queryAssess">
            {{ $t('query.query') }}
          </var-button>
        </var-col>
      </var-row>
    </div>
  </var-dialog>
  <AssessResult v-if="ar !== undefined" :result="ar" v-model:show="showResult" />
</template>

<script lang="ts">
const immutableKeysSet = new Set(['adornment_slots']);
type QueryString = Record<string, string>

export default defineComponent({
  inject: ['view', 'guide'],
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    ge() {
      return this.guide as GuideEntry
    },
    scaleText(): Record<number, string> {
      return {
        '-1': this.$t('bossScale.no'),
        '0': this.$t('bossScale.unknown'),
        '1': this.$t('bossScale.yes'),
      }
    },
    aq(): AssessQuery {
      return {
        data: this.queryToNumber(this.aqData),
        extra: this.aqExtra
      }
    }
  },
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
    fromGuide: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      aqData: this.queryToString(this.query.data) as QueryString,
      aqExtra: this.query.extra as AssessQuery['extra'],
      ar: undefined as AssessResult | undefined,
      showResult: false,
      loading: false
    }
  },
  mounted() {
    watch(() => this.show, (newValue) => {
      if (newValue === true) {
        this.aqData = this.queryToString(this.query.data)
        this.aqExtra = this.query.extra
      }
    })
  },
  methods: {
    async queryAssess() {
      if (this.fromGuide) {
        const bar = Snackbar({
          type: 'loading',
          content: 'Loading...',
        })
        this.ar = await this.ge.assess(this.aq)
        bar.clear()
      } else {
        this.ar = this.ce.assess(this.aq)
      }
      setTimeout(() => {
        this.showResult = true
      }, 150)
    },
    queryToString(query: AssessQuery['data']) {
      return Object.fromEntries(Object.entries(query).map(([key, value]) => [key, String(value)]))
    },
    queryToNumber(query: QueryString) {
      return Object.fromEntries(Object.entries(query).map(([key, value]) => [key, Number(value)]))
    }
  }
})
</script>