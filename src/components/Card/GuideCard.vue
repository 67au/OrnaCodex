<script setup lang="ts">
import { global, useGuideState, type GuideCache } from '@/store';
import { storeToRefs } from 'pinia';
</script>

<template>
  <var-card class="card" title="OrnaGuide" v-if="isNotEmpty">
    <template #description>
      <div class="card-description">
        <template v-for="[status, element] in (Object.entries(elements) as Array<[string, string]>)">
          <var-cell v-if="element.length > 0" class="guide-cell" border>
            <var-space align="center" size="small" style="line-height: 100%;">
              <span> {{ $t(`guide.element.${status}`) + ':' }} </span>
              <var-chip :color="global.elementColor[elem.toLowerCase()]" size="small" v-for="elem in element"
                :round="false" plain>
                {{ $t(`meta.stats.${elem.toLowerCase()}`) }}
              </var-chip>
            </var-space>
          </var-cell>
        </template>
        <var-cell v-if="statusImmunities.length > 0" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.status.immunity') + ':' }}
            <var-chip type="primary" size="small" v-for="status in statusImmunities" :round="false" plain>
              {{ $t(`meta.status.${convertStatusKey(status)}`) }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="spawns.length > 0" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.spawns') + ':' }}
            <var-chip type="primary" size="small" v-for="spawn in spawns" :round="false" plain>
              {{ spawn }}
            </var-chip>
          </var-space>
        </var-cell>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
const guideState = useGuideState();
const { cache } = storeToRefs(guideState);

export default {
  computed: {
    guideCache() {
      return cache.value as GuideCache;
    },
    isNotEmpty() {
      return [this.statusImmunities, this.resistantTo, this.weakTo, this.resistantTo, this.spawns].some((e) => e.length > 0)
    },
    statusImmunities() {
      if (this.guideCache.immune_to_status === undefined) {
        return [];
      } else {
        return this.guideCache.immune_to_status;
      }
    },
    elements() {
      return {
        resistance: this.resistantTo,
        weak: this.weakTo,
        immunity: this.immuneTo,
      }
    },
    resistantTo() {
      if (this.guideCache.resistant_to === undefined) {
        return [];
      } else {
        return this.guideCache.resistant_to;
      }
    },
    weakTo() {
      if (this.guideCache.weak_to === undefined) {
        return [];
      } else {
        return this.guideCache.weak_to;
      }
    },
    immuneTo() {
      if (this.guideCache.immune_to === undefined) {
        return [];
      } else {
        return this.guideCache.immune_to;
      }
    },
    spawns() {
      if (this.guideCache.spawns === undefined) {
        return [];
      } else {
        return this.guideCache.spawns;
      }
    },
  },
  methods: {
    convertStatusKey(key: string) {
      const regex_temp = / \[temp\]/ig;
      const regex_underline = / |\.|\:|\\|\/|\'/ig;
      const regex_up = /↑/ig;
      const regex_down = /↓/ig;
      return key.toLowerCase().replaceAll(regex_temp, '')
        .replaceAll(regex_underline, '_')
        .replaceAll(regex_up, 'u')
        .replaceAll(regex_down, 'd')
    }
  }
}
</script>

<style lang="less">
.guide-cell {
  padding: 4px 0px;
  --cell-border-left: 0px;
  --cell-border-right: 0px;
}
</style>