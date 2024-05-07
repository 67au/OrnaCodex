<script setup lang="ts">
import { defineComponent, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { global, useCodexState, useCompareState, type CodexItem, type ComparedItem } from '@/store';
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-style-provider :style-vars="styleVars">
      <div style="text-align: center; font-size: 24px;">
        {{ $t('compare.title') }}
      </div>
      <div class="compare-container">
        <div class="item empty"></div>
        <div class="item" v-for="(item, index) in items">
          <var-paper class="paper" :elevation="12" :width="170">
            <var-cell border class="cell" style="display: flex;">
              <template #icon>
                <var-icon :size="36" :name="global.getStaticUrl(base(item)['icon'])" class="append-icon" />
              </template>
              <div>
                {{ lang(item)['name'] }}
                <var-chip type="warning" size="mini" :round="true" plain>
                  {{ global.getTier(base(item)['tier']) }}
                </var-chip>
              </div>
            </var-cell>
            <var-cell border class="cell form">
              <var-row :gutter="[8, 4]" align="center">
                <var-col :span="12">
                  <var-select variant="outlined" :placeholder="$t('query.isBoss')" v-model="items[index].isBoss"
                    size="small" class="assess">
                    <var-option :label="$t('yes')" :value="true" />
                    <var-option :label="$t('no')" :value="false" />
                  </var-select>
                </var-col>
                <var-col :span="12">
                  <var-select variant="outlined" :placeholder="$t('query.level')" v-model="items[index].level"
                    size="small" class="assess" :disabled="!checkUpgradable(item)">
                    <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (_, i) => i + 1)" :key="i" />
                  </var-select>
                </var-col>
                <var-col :span="12">
                  <var-input variant="outlined" size="small" type="number" v-model="items[index].quality"
                    :placeholder="$t(`query.quality`)" class="assess">
                  </var-input>
                </var-col>
              </var-row>
            </var-cell>
            <var-cell v-for="r, key in result[index]" border class="cell cell-stat">
              <var-space justify="space-between" align="baseline">
                {{ `${$t('meta.stats.' + key)}` }}
                <div class="cell-description" style="display: flex;">
                  {{ r.base }}
                  <div v-if="r.delta !== 0" :class="`${r.delta > 0 ? 'rare-text' : 'ornate-text'}`">
                    {{ `(${r.delta > 0 ? '+' : ''}${r.delta})` }}
                  </div>
                </div>
              </var-space>
            </var-cell>
          </var-paper>
          <var-space justify="space-between" style="margin: 0 2px; transform: translateY(-14px);">
            <var-space justify="flex-start" size="mini">
              <var-button v-if="index === 0" type="primary" size="mini">
                <var-icon class="mdi mdi-pin" :size="16" />
              </var-button>
            </var-space>
            <var-space justify="flex-end" size="mini">
              <var-button v-if="index > 0" type="info" size="mini" @click="leftShiftItem(index)">
                <var-icon class="mdi mdi-chevron-double-left" :size="16" />
              </var-button>
              <var-button type="danger" size="mini" @click="removeItem(index)">
                <var-icon class="mdi mdi-delete" :size="16" />
              </var-button>
            </var-space>
          </var-space>
        </div>
        <div class="item empty"></div>
      </div>
    </var-style-provider>
  </var-popup>
</template>

<script lang="ts">
const bonusKeysSet = new Set(['orn_bonus', 'exp_bonus', 'luck_bonus', 'gold_bonus'])

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    items: {
      type: Object as PropType<Array<ComparedItem>>,
      required: true,
    },
  },
  data() {
    return {
      styleVars: {},
      assess: storeToRefs(useCompareState()).assess,
    }
  },
  computed: {
    display() {
      return [this.show, this.items.length];
    },
    keys() {
      const compareState = useCompareState();
      return compareState.keys
    },
    initResult() {
      return this.assess.map((ar, index) => {
        return Object.fromEntries(this.keys.map((key) => {
          const base = ar.stats[key]?.values[this.items[index].level - 1] || parseInt(this.base(this.items[index])['stats'][key]) || 0;
          let newbase;
          if (bonusKeysSet.has(key) && this.items[index].level > 10 && base !== 0) {
            newbase = ((100 + base) * (this.items[index].level + 2) * 10 - 10000) / 100;
          }
          if (key === 'adornment_slots' && ar.extra?.isMoreSlots) {
            newbase = base;
            if (this.items[index].level > 10) {newbase +=3};
            if (this.items[index].level === 13) {newbase += 1};
          }
          return [key, {
            base: newbase || base,
            delta: 0,
          }]
        }))
      })
    },
    result() {
      this.initResult.forEach((r, index) => {
        if (index === 0) { return }
        Object.entries(r).forEach(([key, res]) => {
          this.initResult[index][key].delta = res.base - this.initResult[0][key].base
        })
      })
      return this.initResult
    }
  },
  mounted() {
    watch(() => this.display, (newValue, _) => {
      if (newValue[0] && this.items.length > 2 && window.innerWidth < 768) {
        this.styleVars = {
          '--compare-container-margin': 'unset',
          '--compare-container-just-content': 'flex-start',
        }
      } else {
        this.styleVars = {
          '--compare-container-margin': '0 auto',
          '--compare-container-just-content': 'center',
        }
      }
    }, { deep: true })
  },
  methods: {
    lang(item: ComparedItem) {
      const codexState = useCodexState();
      return codexState.lang['items'][item.id]
    },
    base(item: ComparedItem): CodexItem {
      const codexState = useCodexState();
      return codexState.used['items'][item.id]
    },
    checkUpgradable(item: ComparedItem): boolean {
      const i = this.base(item);
      return i['item_type'] === 'weapon' || (i['item_type'] === 'armor' && i['place'] !== 'accessory');
    },
    removeItem(index: number) {
      const compareState = useCompareState();
      compareState.removeItem(index);
      if (compareState.list.length === 0) { this.$emit('update:show', false) }
    },
    leftShiftItem(index: number) {
      const compareState = useCompareState();
      compareState.leftShiftItem(index);
    }
  }
})
</script>

<style scoped>
.cell {
  padding: 6px 8px;
  --cell-border-left: 1px;
  --cell-border-right: 1px;
}

.cell-stat {
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
  padding: 18px 1px;
  overflow-x: auto;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  width: 100vw;
  position: relative;
  margin: var(--compare-container-margin);
  justify-content: var(--compare-container-just-content);
}

.compare-container>.item {
  flex: 0 0 auto;
  position: relative;
  margin-top: auto;
}

.compare-container>.empty {
  width: 1.5vw;
}

@media screen and (min-width: 375px) {

  .compare-container>.empty {
    width: 4vw;
  }

}

@media screen and (min-width: 768px) {
  .compare-container {
    padding: 24px 1px;
    max-width: 768px;
  }

  .compare-container>.empty {
    width: 0;
  }

}
</style>