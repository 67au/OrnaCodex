<script setup lang="ts">
import { convertStatusKey } from '@/plugins/utils'
import { GuideEntry } from '@/plugins/guide'
import { global } from '@/plugins/global'
</script>

<template>
  <var-card class="card" title="OrnaGuide" v-if="isNotEmpty">
    <template #description>
      <div class="card-description">
        <template
          v-for="[status, element] in Object.entries(data?.elements || []) as Array<
            [string, string[]]
          >"
        >
          <var-cell v-if="element.length > 0" class="guide-cell" border :key="status">
            <var-space align="center" size="small" class="leading-none">
              <span> {{ $t(`guide.elements.${status}`) + ':' }} </span>
              <var-chip
                :color="global.elementColor[elem.toLowerCase()]"
                size="small"
                v-for="elem in element"
                :round="false"
                plain
                :key="elem"
              >
                {{ $t(`meta.stats.${elem.toLowerCase()}`) }}
              </var-chip>
            </var-space>
          </var-cell>
        </template>
        <var-cell v-if="data?.statusImmunities" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.status.immunity') + ':' }}
            <var-chip
              type="warning"
              size="small"
              v-for="(status, index) in data.statusImmunities"
              :round="false"
              plain
              :key="index"
            >
              {{ $t(`meta.status.${convertStatusKey(status)}`) }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="data?.spawns" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.spawns') + ':' }}
            <var-chip
              type="primary"
              size="small"
              v-for="spawn in data.spawns"
              :round="false"
              plain
              :key="spawn"
            >
              {{ spawn }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="data?.element" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.element') + ':' }}
            <var-chip
              :color="global.elementColor[data.element.toLowerCase()]"
              size="small"
              :round="false"
              plain
            >
              {{ $t(`meta.stats.${data.element.toLowerCase()}`) }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="data?.category" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.category') + ':' }}
            <var-chip type="primary" size="small" :round="false" plain>
              {{ data.category }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="data?.level !== undefined" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.level') + ':' }}
            <var-chip type="primary" size="small" :round="false" plain>
              {{ data.level }}
            </var-chip>
          </var-space>
        </var-cell>
        <var-cell v-if="data.cost !== undefined" class="guide-cell" border>
          <var-space align="center" size="small" class="leading-none">
            {{ $t('guide.cost') + ':' }}
            <var-chip type="primary" size="small" :round="false" plain>
              {{
                `${data.cost.toLocaleString()} ${$t((data.tier as number) > 7 ? 'guide.orns' : 'guide.gold')}`
              }}
            </var-chip>
          </var-space>
        </var-cell>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
export default {
  inject: ['guide'],
  computed: {
    ge() {
      return this.guide as GuideEntry
    },
    data() {
      return GuideEntry.parseGuideCache(this.ge.cache)
    },
    isNotEmpty() {
      return Object.keys(this.data).length > 0
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
