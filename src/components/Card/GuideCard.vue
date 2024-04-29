<script setup lang="ts">
import { global, useGuideState } from '@/store';
import { storeToRefs } from 'pinia';
import { convertStatusKey } from '@/plugins/utils';
import { parseGuideCache } from '@/plugins/guide';
</script>

<template>
  <var-card class="card" title="OrnaGuide" v-if="isNotEmpty">
    <template #description>
      <div class="card-description">
        <template v-for="[status, element] in (Object.entries(guide?.elements || []) as Array<[string, string[]]>)">
          <var-cell v-if="element.length > 0" class="guide-cell" border>
            <var-space align="center" size="small" style="line-height: 100%;">
              <span> {{ $t(`guide.elements.${status}`) + ':' }} </span>
              <var-chip :color="global.elementColor[elem.toLowerCase()]" size="small" v-for="elem in element"
                :round="false" plain>
                {{ $t(`meta.stats.${elem.toLowerCase()}`) }}
              </var-chip>
            </var-space>
          </var-cell>
        </template>
        <var-cell v-if="guide?.statusImmunities" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.status.immunity') + ':' }}
            <var-chip type="primary" size="small" v-for="status in guide.statusImmunities" :round="false" plain>
              {{ $t(`meta.status.${convertStatusKey(status)}`) }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="guide?.spawns" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.spawns') + ':' }}
            <var-chip type="primary" size="small" v-for="spawn in guide.spawns" :round="false" plain>
              {{ spawn }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="guide?.element" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.element') + ':' }}
            <var-chip :color="global.elementColor[guide.element.toLowerCase()]" size="small" :round="false" plain>
              {{ $t(`meta.stats.${guide.element.toLowerCase()}`) }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="guide?.category" class="guide-cell" border>
          <var-space align="center" size="small" style="line-height: 100%;">
            {{ $t('guide.category') + ':' }}
            <var-chip type="primary" size="small" :round="false" plain>
              {{ guide.category }}
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
    guide() {
      return parseGuideCache(cache.value);
    },
    isNotEmpty() {
      return Object.keys(this.guide).length > 0;
    }
  },
}
</script>

<style lang="less">
.guide-cell {
  padding: 4px 0px;
  --cell-border-left: 0px;
  --cell-border-right: 0px;
}
</style>