<script setup lang="ts">
import { convertStatusKey } from '@/plugins/utils'
import { GuideEntry } from '@/plugins/guide'
import { global } from '@/plugins/global'
import { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/snackbar/style/index'
</script>

<template>
  <var-card class="card" v-if="ge.guideApiCategory !== undefined">
    <template #title="{ slotClass }">
      <div :class="slotClass">
        <var-space justify="space-between">
          <div>OrnaGuide</div>
          <var-space justify="flex-end" size="small">
            <var-link v-if="ge.exist" :href="ge.pageUrl" target="_blank" underline="none">
              <var-button size="small" round icon-container elevation="3" type="primary">
                <Icon icon-class="i-mdi-export text-md" />
              </var-button>
            </var-link>

            <var-button
              v-if="ge.exist"
              size="small"
              round
              icon-container
              elevation="3"
              type="danger"
              @click="ge.cache = undefined"
            >
              <Icon icon-class="i-mdi-close text-md" />
            </var-button>
            <var-button
              v-if="!ge.exist"
              :loading="loading"
              size="small"
              round
              icon-container
              elevation="3"
              type="info"
              @click="fetchCache"
            >
              <Icon icon-class="i-mdi-magnify text-md" />
            </var-button>
          </var-space>
        </var-space>
      </div>
    </template>
    <template #description>
      <div class="card-description" v-if="ge.exist">
        <template v-if="isNotEmpty">
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
        </template>
        <var-divider>
          <div class="mx-4">Updated at: {{ ge.datetime.toLocaleString() }}</div>
        </var-divider>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
export default {
  inject: ['guide'],
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ge() {
      return this.guide as GuideEntry
    },
    data() {
      return GuideEntry.parseGuideCache(this.ge.data)
    },
    isNotEmpty() {
      return Object.keys(this.data).length > 0
    }
  },
  async mounted() {
    if (!this.ge.exist) {
      await this.ge.loadCache()
    }
  },
  methods: {
    async fetchCache() {
      this.loading = true
      const result = await this.ge.fetchCache()
      this.loading = false
      if (!result) {
        Snackbar({
          type: 'error',
          content: this.$t('notfound'),
          duration: 8000
        })
      }
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
