<script setup lang="ts">
import { watch, defineComponent } from 'vue';
import { global, useAssessState, useCodexState, useGuideState, type GuideStats } from '@/store';
import MainCard from '@/components/Card/MainCard.vue';
import StatsCard from '@/components/Card/StatsCard.vue';
import AbilityCard from '@/components/Card/AbilityCard.vue';
import DropsCard from '@/components/Card/DropsCard.vue';
import MaterialCard from '@/components/Card/MaterialCard.vue';
import SpellCard from '@/components/Card/SpellCard.vue';
import DescriptionCard from '@/components/Card/DescriptionCard.vue';
import GuideResult from '@/components/GuideResult.vue';
import OffHandItemsCard from '@/components/Card/OffHandItemsCard.vue';
import AssessResult from '@/components/AssessResult.vue';
import AssessQuery from '@/components/AssessQuery.vue';
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
                <var-space align="center" size="small">
                  <var-link :href="`${global.ornaUrl}${codexState.url}`" target="_blank" underline="none">
                    <var-button type="primary" size="small">
                      OrnaRPG
                    </var-button>
                  </var-link>
                  <var-button type="success" size="small" @click="getGuidePage" :loading="show.guide.loading"
                    loading-type="wave">
                    OrnaGuide
                  </var-button>
                </var-space>
                <var-chip size="small" :type="isGuide? 'success' : 'warning'" :closeable="isGuide"
                  @close="guideState.$reset()">
                  {{ isGuide ? 'Guide' : 'YACO' }}
                </var-chip>
              </var-space>
            </div>
          </template>
        </var-card>

        <var-card class="card" :title="$t('assess')"
          v-if="codexPage.category === 'items' && codexState.usedItem['stats'] !== undefined">
          <template #description>
            <div class="card-description">
              <var-space justify="flex-start" align="center" size="small">
                <var-button type="info" size="small" @click="assessGuidePage" :loading="show.guide.loading"
                  loading-type="wave">
                  Guide
                </var-button>
                <var-button type="success" size="small" @click="initGuideQuery()" :loading="show.guide.loading"
                  loading-type="wave" v-if="!codexState.isCelestialWeapon">
                  GuideAPI
                </var-button>
                <var-button type="primary" size="small" @click="initYacoQuery()" v-if="!codexState.isCelestialWeapon">
                  YACO
                </var-button>
                <var-button :type="isGuide && !codexState.isCelestialWeapon ?'success':'warning'" size="small" @click="initYacoQuery(true)">
                  Quality
                </var-button>
              </var-space>
            </div>
          </template>
        </var-card>

        <GuideCard v-if="isGuide && guideState.isMonster()" />

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
  <AssessResult :result="assessState.result" v-model:show="show.result"/>
</template>

<script lang="ts">
const codexState = useCodexState();
const guideState = useGuideState();
const assessState = useAssessState();

export default defineComponent({
  components: {
    GuideCard: defineAsyncComponent(() => import('@/components/Card/GuideCard.vue')),
  },
  mounted() {
    watch(() => this.$route.params, () => {
      guideState.$reset();
      codexState.page.category = this.$route.params.category as string;
      codexState.page.id = this.$route.params.id as string;
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
        category: codexState.page.category,
        id: codexState.page.id,
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
