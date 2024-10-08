<script setup lang="ts">
import { useCompareState } from '@/stores/compare'
import { getStaticUrl, numerFixed, valueStrip } from '@/plugins/utils'
import { Quality, getQualityCode, getUpgradedBonus } from '@/plugins/assess'
import { i18n } from '@/i18n'
</script>

<template>
  <var-popup
    :default-style="false"
    :show="show"
    @update:show="$emit('update:show', $event)"
    safe-area
  >
    <var-space justify="center">
      <var-paper class="py-2 px-4" radius="16px">
        <var-space class="max-w-md" align="center" size="large" justify="space-between" line>
          <var-chip class="text-lg" type="default" elevation="2">
            <template #left>
              <Icon icon-class="i-mdi-scale-balance" />
            </template>
            <div>{{ $t('compare.title') }}</div>
          </var-chip>
          <div class="w-full"></div>
          <var-space align="center" justify="flex-end" size="mini" line>
            <PopupButton type="warning" icon-class="i-mdi-trash" @click="reset" />
            <PopupButton
              type="danger"
              icon-class="i-mdi-window-close"
              @click="$emit('update:show', false)"
            />
          </var-space>
        </var-space>
      </var-paper>
    </var-space>
    <var-style-provider :style-vars="styleVars">
      <div class="compare-container h-full">
        <div class="empty"></div>
        <div v-for="({ entry: entry, query: query }, index) in compareState.list" :key="index">
          <var-paper radius="16px" class="paper mx-auto" :elevation="8" :width="cardSize">
            <var-cell border class="p-cell flex">
              <template #icon>
                <var-icon :size="36" :name="getStaticUrl(entry.meta.icon)" class="append-icon" />
              </template>
              <div>
                {{ entry.lang.name }}
                <var-chip type="warning" size="mini" :round="true" plain>
                  {{ entry.tier }}
                </var-chip>
              </div>
            </var-cell>
            <var-cell border class="p-cell form">
              <var-row :gutter="[8, 4]" align="center">
                <var-col :span="12">
                  <var-select
                    variant="outlined"
                    :placeholder="$t('query.isBoss')"
                    v-model="query.isBoss"
                    size="small"
                    class="w-full"
                  >
                    <var-option :label="$t('yes')" :value="true" />
                    <var-option :label="$t('no')" :value="false" />
                  </var-select>
                </var-col>
                <var-col :span="12">
                  <var-select
                    variant="outlined"
                    :placeholder="$t('query.level')"
                    v-model="query.level"
                    size="small"
                    class="w-full"
                    :disabled="!entry.isUpgradable"
                  >
                    <var-option
                      :value="i"
                      :label="i"
                      v-for="i in Array.from({ length: 13 }, (_, i) => i + 1)"
                      :key="i"
                    />
                  </var-select>
                </var-col>
                <var-col :span="12">
                  <var-input
                    variant="outlined"
                    size="small"
                    type="number"
                    v-model="query.quality"
                    :placeholder="$t(`query.quality`)"
                    class="w-full"
                  >
                  </var-input>
                </var-col>
                <var-col :span="12">
                  <var-select
                    variant="outlined"
                    :placeholder="$t('query.qualityextra')"
                    v-model="query.qualityCode"
                    size="small"
                    class="w-full"
                    :disabled="Number(query.quality) < 200"
                    :options="qualityOptions"
                    v-if="entry.isAccessory"
                  />
                </var-col>
              </var-row>
            </var-cell>
            <div class="mx-1 mt-1 max-h-60vh overflow-auto">
              <var-cell v-for="(r, key) in result[index]" border class="p-cell s-cell" :key="key">
                <var-space justify="space-between" align="baseline">
                  {{ `${$t('meta.stats.' + key)}` }}
                  <div class="cell-description flex">
                    {{ numerFixed(r.base) }}
                    <div
                      v-if="r.delta !== 0"
                      :class="`${r.delta > 0 ? 'rare-text' : 'ornate-text'}`"
                    >
                      {{ `(${r.delta > 0 ? '+' : ''}${numerFixed(r.delta)})` }}
                    </div>
                  </div>
                </var-space>
              </var-cell>
            </div>
          </var-paper>
          <var-space justify="space-between" class="my-0 px-1 -translate-y-3">
            <var-space justify="flex-start" size="mini">
              <var-button v-if="index === 0" type="primary" size="mini" round>
                <div class="i-mdi-pin text-lg"></div>
              </var-button>
            </var-space>
            <var-space justify="flex-end" size="mini">
              <var-button v-if="index > 0" type="info" size="mini" @click="leftShift(index)" round>
                <div class="i-mdi-chevron-double-left text-lg"></div>
              </var-button>
              <var-button type="danger" size="mini" @click="remove(index)" round>
                <div class="i-mdi-delete text-lg"></div>
              </var-button>
            </var-space>
          </var-space>
        </div>
        <div class="empty"></div>
      </div>
    </var-style-provider>
  </var-popup>
</template>

<script lang="ts">
const bonusKeysSet = new Set([
  'orn_bonus',
  'exp_bonus',
  'luck_bonus',
  'gold_bonus',
  'monster_encounters',
  'no_follower_bonus'
])
const cardSize = 185
const qualityNameEn = ['MF', 'DF', 'GF']

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    styleVars() {
      if (this.windowWidth < this.compareState.length * cardSize) {
        return {
          '--compare-container-margin': 'unset',
          '--compare-container-just-content': 'flex-start',
          '--empty-min-width': '20px'
        }
      } else {
        return {
          '--compare-container-margin': '0 auto',
          '--compare-container-just-content': 'center',
          '--empty-min-width': '0'
        }
      }
    },
    compareState() {
      return useCompareState()
    },
    initializeResult() {
      return this.compareState.assess.map((ar, index) => {
        const { entry: entry, query: query } = this.compareState.list[index]
        return this.compareState.keys.map((key) => {
          let base
          if (ar.stats[key] !== undefined) {
            base = ar.stats[key]?.values[query.level - 1]
          } else {
            const v = entry.meta.stats[key] || '0'
            const value = typeof v === 'string' ? valueStrip(v) : v === true ? 1 : 0
            if (bonusKeysSet.has(key) && value > 0) {
              if (query.level > 10) {
                base = getUpgradedBonus(value, query.level - 4, false, key) // level - 10 + 6
              } else {
                if (query.qualityCode > 0) {
                  base = getUpgradedBonus(value, query.qualityCode, entry.isAdornment, key)
                } else {
                  base = getUpgradedBonus(value, getQualityCode(ar.quality), entry.isAdornment, key)
                }
              }
            } else {
              base = value
            }
          }
          return [key, { base: base, delta: 0 }]
        })
      })
    },
    qualityOptions() {
      return Array.from({ length: 4 }).map((_, i: number) => {
        if (i === 0) {
          return {
            label: this.$t('query.qualitylabel.default'),
            value: -1
          }
        } else {
          if (i18n.global.locale.value === 'en') {
            return {
              label: qualityNameEn[i - 1],
              value: i + 6
            }
          } else {
            return {
              label: this.$t(`query.qualitylabel.${Quality[i + 6]}`),
              value: i + 6
            }
          }
        }
      })
    },
    result() {
      return this.initializeResult.map((r, index) => {
        if (index === 0) {
          return Object.fromEntries(r)
        }
        return Object.fromEntries(
          (r as Array<[string, any]>).map(([key, res], index) => {
            return [
              key,
              {
                base: res.base as number,
                delta: res.base - (this.initializeResult[0][index][1] as any).base
              }
            ]
          })
        )
      })
    }
  },
  methods: {
    remove(index: number) {
      this.compareState.remove(index)
      if (this.compareState.length === 0) {
        this.$emit('update:show', false)
      }
    },
    leftShift(index: number) {
      this.compareState.leftShift(index)
    },
    reset() {
      this.compareState.$reset()
      this.$emit('update:show', false)
    }
  }
})
</script>

<style lang="less" scoped>
.p-cell {
  padding: 6px 8px;
  --cell-border-left: 1px;
  --cell-border-right: 1px;
}

.s-cell {
  --cell-font-size: var(--font-size-sm);
  --cell-min-height: 36px;
  height: 36px;
  line-height: 80%;
}

.cell-description {
  font-size: var(--font-size-sm);
  color: var(--cell-description-color);
  text-align: right;
}

.form {
  margin-top: 4px;
  --field-decorator-placeholder-size: var(--font-size-md);
  --input-input-font-size: var(--font-size-md);
  --select-label-font-size: var(--font-size-sm);
  --select-arrow-size: var(--font-size-md);
  --field-decorator-outlined-small-padding-left: 8px;
  --field-decorator-outlined-small-padding-right: 8px;
  --field-decorator-outlined-small-margin-top: 4px;
  --field-decorator-outlined-small-margin-bottom: 4px;
}

.paper {
  margin: 2px;
  padding-bottom: 8px;
  padding-top: 2px;
}

.compare-container {
  padding: 12px 0;
  overflow-x: auto;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  width: 100vw;
  overflow-y: auto;
  margin: var(--compare-container-margin);
  justify-content: var(--compare-container-just-content);
}

.compare-container > .empty {
  min-width: var(--empty-min-width);
}
</style>
