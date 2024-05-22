<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import { global } from '@/plugins/global';
import type { GuideEntry } from '@/plugins/guide';
import { useCompareState } from '@/stores';
import type { AssessQuery } from '@/types';
import { Snackbar } from '@varlet/ui';
</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-space justify="space-between" align="center">
          <var-space align="center" size="mini">
            <var-link :href="`${global.ornaUrl}${ce.url}`" target="_blank" underline="none">
              <var-button type="primary" size="small">
                OrnaRPG
              </var-button>
            </var-link>
            <var-button type="success" size="small" @click="getGuidePage" :loading="loading.guide" loading-type="wave">
              OrnaGuide
            </var-button>
          </var-space>
          <var-chip size="small" :type="ge.exist ? 'success' : 'warning'" :closeable="ge.exist"
            @close="ge.cache = undefined">
            {{ ge.exist ? 'Guide' : 'YACO' }}
          </var-chip>
        </var-space>
      </div>
    </template>
  </var-card>

  <var-card class="card" :title="$t('assess')" v-if="ce.category === 'items' && ce.meta.stats !== undefined">
    <template #description>
      <div class="card-description">
        <var-space justify="flex-start" align="center" size="mini">
          <template v-if="ce.isAssessable">
            <var-button-group type="success">
              <var-button type="info" size="small" @click="getGuideAssess" :loading="loading.guide" loading-type="wave">
                Guide
              </var-button>
              <var-button size="small" @click="initGuideQuery()" :loading="loading.guide" loading-type="wave"
                v-if="!ce.isCelestialWeapon">
                API
              </var-button>
            </var-button-group>
            <var-button type="warning" size="small" @click="initYacoQuery()" v-if="!ce.isCelestialWeapon">
              YACO
            </var-button>
            <var-button type="warning" size="small" @click="initYacoQuery(true)">
              {{ $t('query.quality') }}
            </var-button>
          </template>
          <var-button type="primary" size="small" @click.stop="addToCompare" v-if="!ce.isCelestialWeapon">
            {{ $t('compare.button') }}
          </var-button>
        </var-space>
      </div>
    </template>
  </var-card>

  <GuideResult v-model:show="show.guide.page" :href="ge.pageUrl" :result="ge.exist" />
  <GuideResult v-model:show="show.guide.assessPage" :href="ge.assessUrl" :result="ge.exist" />

  <AssessQuery v-if="query !== undefined" title="Assess" :query="query" v-model:show="show.assess"
    :from-guide="fromGuide" />
  <GuideResult v-else v-model:show="show.assess" :result="false" />
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view', 'guide'],
  data() {
    return {
      loading: {
        guide: false
      },
      show: {
        guide: {
          page: false,
          assessPage: false
        },
        yaco: {
          quality: false
        },
        assess: false
      },
      query: undefined as AssessQuery | undefined,
      fromGuide: false,
    }
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    ge() {
      return this.guide as GuideEntry
    },
    compareState() {
      return useCompareState()
    }
  },
  methods: {
    async getGuidePage() {
      await this.fetchCache()
      setTimeout(() => {
        this.show.guide.page = true
      }, 120)
    },
    async getGuideAssess() {
      await this.fetchCache()
      setTimeout(() => {
        this.show.guide.assessPage = true
      }, 150)
    },
    async fetchCache() {
      this.loading.guide = true
      await this.ge.fetchCache()
      this.loading.guide = false
    },
    async initGuideQuery() {
      await this.fetchCache()
      if (this.ge.exist) {
        this.query = this.ge.assessQuery()
        this.fromGuide = true
      } else {
        this.query = undefined
      }
      setTimeout(() => {
        this.show.assess = true
      }, 150)
    },
    initYacoQuery(quality: boolean = false) {
      this.query = this.ce.assessQuery(quality)
      this.fromGuide = false
      setTimeout(() => {
        this.show.assess = true
      }, 150)
    },
    addToCompare() {
      const entry = new CodexEntry(this.ce.category, this.ce.id);
      const result = this.compareState.add({
        entry: entry,
        query: {
          quality: '200',
          level: entry.isUpgradable ? 13 : 1,
          isBoss: this.ce.bossScale > -1,
          qualityCode: -1
        }
      })
      Snackbar.allowMultiple(true)
      Snackbar({
        content: result ? this.$t('compare.success') : this.$t('compare.failed'),
        type: result ? 'success' : 'error',
      });
    }
  }
})
</script>