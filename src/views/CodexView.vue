<script setup lang="ts">
import { watch, defineComponent } from 'vue';
import { global, useAssessState, useCodexViewState, useCompareState, useGuideState, type GuideStats, type ComparedItem } from '@/store';

import MainCard from '@/components/Codex/MainCard.vue';
import StatsCard from '@/components/Codex/StatsCard.vue';
import AbilityCard from '@/components/Codex/AbilityCard.vue';
import DropsCard from '@/components/Codex/DropsCard.vue';
import MaterialCard from '@/components/Codex/MaterialCard.vue';
import SpellCard from '@/components/Codex/SpellCard.vue';
import DescriptionCard from '@/components/Codex/DescriptionCard.vue';
import GuideResult from '@/components/GuideResult.vue';
import OffHandItemsCard from '@/components/Codex/OffHandItemsCard.vue';
import AssessResult from '@/components/AssessResult.vue';
import AssessQuery from '@/components/AssessQuery.vue';

import { Snackbar } from '@varlet/ui';
import '@varlet/ui/es/snackbar/style/index';
</script>

<template>
  <main>
    <template v-if="!loading">
      <!-- main -->
      <div class="container">
        <MainCard />
        <DescriptionCard />
        <!-- OrnaGuide -->
        <var-card class="card">
          <template #description>
            <div class="card-description">
              <var-space justify="space-between" align="center">
                <var-space align="center" size="mini">
                  <var-link :href="`${global.ornaUrl}${codexViewState.url}`" target="_blank" underline="none">
                    <var-button type="primary" size="small">
                      OrnaRPG
                    </var-button>
                  </var-link>
                  <var-button type="success" size="small" @click="getGuidePage" :loading="show.guide.loading"
                    loading-type="wave">
                    OrnaGuide
                  </var-button>
                </var-space>
                <var-chip size="small" :type="isGuide ? 'success' : 'warning'" :closeable="isGuide"
                  @close="guideState.$reset()">
                  {{ isGuide ? 'Guide' : 'YACO' }}
                </var-chip>
              </var-space>
            </div>
          </template>
        </var-card>

        <var-card class="card" :title="$t('assess')"
          v-if="codexPage.category === 'items' && codexViewState.item['stats'] !== undefined">
          <template #description>
            <div class="card-description">
              <var-space justify="flex-start" align="center" size="mini">
                <template v-if="codexViewState.isAssessable">
                <var-button-group type="success">
                  <var-button type="info" size="small" @click="assessGuidePage" :loading="show.guide.loading"
                    loading-type="wave">
                    Guide
                  </var-button>
                  <var-button size="small" @click="initGuideQuery()" :loading="show.guide.loading" loading-type="wave"
                    v-if="!codexViewState.isCelestialWeapon">
                    API
                  </var-button>
                </var-button-group>
                <var-button type="warning" size="small" @click="initYacoQuery()" v-if="!codexViewState.isCelestialWeapon">
                  YACO
                </var-button>
                <var-button :type="isGuide && !codexViewState.isCelestialWeapon ? 'success' : 'warning'" size="small"
                  @click="initYacoQuery(true)">
                  {{ $t('query.quality') }}
                </var-button>
                </template>
                <var-button type="primary" size="small" @click.stop="addToCompare"
                  v-if="!codexViewState.isCelestialWeapon">
                  {{ $t('compare.button') }}
                </var-button>
              </var-space>
            </div>
          </template>
        </var-card>

        <GuideCard v-if="isGuide" />

        <StatsCard />
        <AbilityCard />
        <DropsCard name="abilities" text />
        <DropsCard name="skills" />
        <DropsCard name="dropped_by" />
        <DropsCard name="drops" />
        <DropsCard name="causes" chance />
        <DropsCard name="gives" chance />
        <DropsCard name="cures" chance />
        <DropsCard name="immunities" chance />
        <DropsCard name="summons" chance />
        <DropsCard name="upgrade_materials" />
        <DropsCard name="bestial_bond" text />
        <DropsCard name="learned_by" />
        <DropsCard name="requirements" />
        <DropsCard name="celestial_classes" />
        <MaterialCard />
        <SpellCard />
        <OffHandItemsCard />
      </div>
    </template>
  </main>

  <!-- Result -->
  <GuideResult v-model:show="show.guide.page" :href="guidePageUrl" />

  <!-- Assess -->
  <GuideResult v-model:show="show.guide.assess" :href="guideAssessUrl" />

  <!-- AssessApi -->
  <AssessQuery v-if="guideState.cache !== undefined" title="Assess" :query="assessState.query"
    v-model:show="show.guide.query" :query-func="assessGuideApi" />
  <GuideResult v-else v-model:show="show.guide.query" failed />

  <!-- AssessYACO -->
  <AssessQuery v-if="assessState.result !== undefined" title="Assess" :query="assessState.query"
    v-model:show="show.yaco.query" :query-func="assessYacoApi" />
  <GuideResult v-else v-model:show="show.yaco.query" failed />

  <!-- AssessQueryQuailty -->
  <AssessResult :result="assessState.result" v-model:show="show.result" />
</template>

<script lang="ts">
const codexViewState = useCodexViewState();
const guideState = useGuideState();
const assessState = useAssessState();
const compareState = useCompareState();

export default defineComponent({
  components: {
    GuideCard: defineAsyncComponent(() => import('@/components/Codex/GuideCard.vue')),
  },
  mounted() {
    watch(() => this.$route.params, () => {
      guideState.$reset();
      codexViewState.page.category = this.$route.params.category as string;
      codexViewState.page.id = this.$route.params.id as string;
    }, { immediate: true });
    this.loading = false;
  },
  data() {
    return {
      show: {
        guide: {
          page: false,
          assess: false,
          loading: false,
          query: false,
        },
        yaco: {
          query: false,
        },
        result: false,
      },
      loading: true,
    }
  },
  computed: {
    codexPage() {
      return {
        category: codexViewState.page.category,
        id: codexViewState.page.id,
      }
    },
    guidePage() {
      return {
        category: guideState.page.category,
        id: guideState.page.id,
      }
    },
    isGuide() {
      return guideState.cache !== undefined
    },
    guidePageUrl() {
      return `${global.guideUrl}/${this.guidePage.category}?show=${this.guidePage.id}`
    },
    guideAssessUrl() {
      return `${global.guideUrl}/assess?item=${this.guidePage.id}`
    },
    guideStats() {
      return guideState.stats as GuideStats
    },
  },
  methods: {
    addToCompare() {
      const item: ComparedItem = {
        id: codexViewState.page.id,
        quality: '200',
        level: codexViewState.isUpgradable ? 13 : 1,
        isBoss: true,
      };
      const result = compareState.addItem(item);
      Snackbar.allowMultiple(true);
      Snackbar({
        content: result ? this.$t('compare.success') : this.$t('compare.failed'),
        type: result ? 'success' : 'error',
      });
    },
    async refreshGuide() {
      this.show.guide.loading = true;
      await guideState.refreshCache();
      this.show.guide.loading = false;
    },
    async getGuidePage() {
      await this.refreshGuide();
      setTimeout(() => {
        this.show.guide.page = true;
      }, 150);
    },
    async assessGuidePage() {
      await this.refreshGuide();
      setTimeout(() => {
        this.show.guide.assess = true;
      }, 150);
    },
    async initGuideQuery() {
      await this.refreshGuide();
      assessState.initGuideQuery();
      setTimeout(() => {
        this.show.guide.query = true;
      }, 150);
    },
    async assessGuideApi() {
      if (await assessState.queryGuideApi()) {
        setTimeout(() => {
          this.show.result = true;
        }, 150);
      }
    },
    initYacoQuery(quality: boolean = false) {
      assessState.initYacoQuery(quality);
      setTimeout(() => {
        this.show.yaco.query = true;
      }, 150);
    },
    assessYacoApi() {
      assessState.queryYacoApi();
      setTimeout(() => {
        this.show.result = true;
      }, 150);
    }
  }
})
</script>
