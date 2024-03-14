<script setup lang="ts">
import { watch, defineComponent } from 'vue';
import { store, global } from '@/store';
import { getItemQuailty, getUpgradedStats } from '@/plugins/assess.js';
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
</script>

<template>
  <main>
    <template v-if="!store.codexViewLoading && !loading">
      <!-- main -->
      <div class="container">
        <MainCard />
        <DescriptionCard />
        <!-- OrnaGuide -->
        <var-card class="card">
          <template #description>
            <div class="card-description">
              <var-space justify="flex-start" align="center" size="small">
                <var-link :href="`${global.ornaUrl}${store.codex.url}`" target="_blank" underline="none">
                  <var-button type="primary" size="small"> playorna.com </var-button>
                </var-link>
                <var-button type="success" size="small" @click="getOrnaGuide" :loading="show.loading"
                  loading-type="wave">
                  orna.guide </var-button>
                <var-button type="warning" size="small" @click="show.json = true"> JSON </var-button>
              </var-space>
            </div>
          </template>
        </var-card>

        <var-card class="card" :title="$t('assess')"
          v-if="store.codexPage.category === 'items' && store.codex.usedItem['stats'] !== undefined">
          <template #description>
            <div class="card-description">
              <var-space justify="flex-start" align="center" size="small">
                <var-button type="info" size="small" @click="getItemAssess()" :loading="show.loading"
                  loading-type="wave">
                  Guide
                </var-button>
                <var-button type="primary" size="small" @click="getItemAssessAPI()" :loading="show.loading"
                  loading-type="wave">
                  Guide API
                </var-button>
                <var-button type="success" size="small" @click="getItemAssessYACO()">
                  YACO
                </var-button>
                <var-button type="warning" size="small" @click="getItemAssessYACO(true)">
                  Quality
                </var-button>
              </var-space>
            </div>
          </template>
        </var-card>

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

  <!-- Dialog -->
  <var-dialog v-model:show="show.json" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="code-json" /> JSON
      </span>
    </template>
    <var-input textarea v-model="itemJson" readonly />
  </var-dialog>

  <!-- Result -->
  <var-popup :default-style="false" v-model:show="show.guide">
    <GuideResult class="popup-content" :click="() => show.guide = false" :href="guidePageUrl" />
  </var-popup>

  <!-- Assess -->
  <var-popup :default-style="false" v-model:show="show.assess">
    <GuideResult class="popup-content" :click="() => show.assess = false" :href="assessQueryUrl" />
  </var-popup>


  <!-- AssessApi -->
  <AssessQuery v-if="store.guide.cache !== undefined && guideStats !== undefined" title="Assess" :query="query"
    :base-stats="guideStats" v-model:show="show.api" :query-func="queryItemAssess" />
  <var-popup v-else :default-style="false" v-model:show="show.api">
    <GuideResult class="popup-content" @click="show.api = false" failed />
  </var-popup>

  <!-- AssessQuery -->
  <AssessResult :result="guide.result" v-model:show="show.result" />

  <!-- AssessYACO -->
  <AssessQuery v-if="yaco.result !== undefined && yaco.result.stats !== undefined" title="Assess" :query="query"
    :base-stats="yaco.result.stats" v-model:show="show.yaco" :query-func="queryItemAssessYACOAPI" />
  <template v-else>
    <var-popup :default-style="false" v-model:show="show.yaco">
      <GuideResult class="popup-content" :click="() => show.yacoResult = false" failed />
    </var-popup>
  </template>

  <!-- AssessQueryQuailty -->
  <AssessResult :result="yaco.result" v-model:show="show.yacoResult" />
  <AssessQuery v-if="yaco.result !== undefined && yaco.result.stats !== undefined" title="Assess" :query="query"
    :base-stats="yaco.result.stats" v-model:show="show.yaco" :query-func="queryItemAssessYACOAPI" />
  <template v-else>
    <var-popup :default-style="false" v-model:show="show.yaco">
      <GuideResult class="popup-content" :click="() => show.yacoResult = false" failed />
    </var-popup>
  </template>

  <!-- AssessQueryQuailty -->
  <AssessResult :result="yaco.result" v-model:show="show.yacoResult" />
</template>

<script lang="ts">

const guideApiMap: any = {
  'items': 'item',
  'monsters': 'monster',
  'bosses': 'monster',
  'raids': 'monster',
  'followers': 'pet',
  'spells': 'skill',
}
const guidePageMap: any = {
  'items': 'items',
  'monsters': 'monsters',
  'bosses': 'monsters',
  'raids': 'monsters',
  'followers': 'pets',
  'spells': 'skills',
}
const monsterSet = new Set(['monsters', 'bosses']);

const allowedKeys = new Set(['hp', 'mana', 'attack', 'magic', 'defense', 'resistance', 'dexterity', 'ward', 'crit', 'foresight']);

export default defineComponent({
  mounted() {
    store.codexPage.category = this.$route.params.category
    store.codexPage.id = this.$route.params.id
    this.loading = false;
    watch(() => this.$route.params, () => {
      store.codexPage.category = this.$route.params.category
      store.codexPage.id = this.$route.params.id
    });
  },
  data() {
    return {
      store,
      query: {
        data: {},
        extra: {},
      } as any,
      guide: {
        result: undefined,
      } as any,
      yaco: {
        result: undefined,
      } as any,
      show: {
        guide: false,
        json: false,
        assess: false,
        api: false,
        result: false,
        loading: false,
        yaco: false,
        yacoResult: false,
      },
      loading: true,
    }
  },
  computed: {
    guidePageUrl() {
      if (store.guide.cache !== undefined) {
        return `${global.guideUrl}/${this.guidePage}?show=${this.guideId}`
      } else {
        return `${global.guideUrl}/${this.guidePage}`
      }
    },
    assessQueryUrl() {
      if (store.guide.cache !== undefined) {
        return `${global.guideUrl}/assess?item=${this.guideId}`;
      } else {
        return `${global.guideUrl}/assess`;
      }
    },
    assessUrl() {
      return `${global.guideApiUrl}/assess`
    },
    searchUrl() {
      return `${global.guideApiUrl}/${this.guideApi}`
    },
    guideApi() {
      return guideApiMap[store.codexPage.category]
    },
    guidePage() {
      return guidePageMap[store.codexPage.category]
    },
    guideStats() {
      return store.guide.cache['stats']
    },
    guideId() {
      return store.guide.cache['id']
    },
    itemJson() {
      return JSON.stringify(store.codex.usedItem);
    },
    ornaStats() {
      return store.codex.usedItem['stats'];
    },
    isAssessItem() {
      if (store.codex.usedItem['stats'] === undefined) {
        return false;
      }
      for (const key of Object.keys(store.codex.usedItem['stats'])) {
        if (allowedKeys.has(key)) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    isMonster() {
      return monsterSet.has(store.codexPage.category);
    },
    async requestOrnaGuide() {
      let itemName = store.codex.basedItem['name'];
      if (this.guideApi === undefined) {
        return [];
      }
      if (this.isMonster() && itemName.endsWith(' (Arisen)')) {
        itemName = itemName.slice(0, -9);
      }
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000);
      try {
        const resp = await fetch(this.searchUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({ "icontains": [{ "name": itemName }] })
        })
        const result = await resp.json();
        return result;
      } catch (error) {
        return [];
      }
    },
    async updateGuideCache() {
      if (store.guide.cache === undefined) {
        const result = await this.requestOrnaGuide();
        for (const c of result) {
          if (c['codex'] === store.codex.url) {
            store.guide.cache = c;
            break
          }
        }
      }
    },
    async getOrnaGuide() {
      this.show.loading = true;
      await this.updateGuideCache()
      this.show.loading = false;
      setTimeout(() => {
        this.show.guide = true;
      }, 350);
    },
    async getItemAssess() {
      this.show.loading = true;
      await this.updateGuideCache()
      this.show.loading = false;
      setTimeout(() => {
        this.show.assess = true;
      }, 350);
    },
    async requestItemAssess() {
      try {
        const resp = await fetch(this.assessUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(Object.entries(this.query.data).map(([k, v]) => [k, Number(v)])))
        })
        const result = await resp.json();
        return result;
      } catch (error) {
        return undefined;
      }
    },
    async getItemAssessAPI() {
      this.show.loading = true;
      await this.updateGuideCache()
      if (store.guide.cache !== undefined && this.guideStats !== undefined) {
        this.query.data = {
          id: store.guide.cache['id'],
          level: 1,
        }
        this.query.extra = {
          isQuality: false,
          isBoss: store.guide.cache['boss'],
          fromGuide: true,
        }
        for (const [key, value] of (Object.entries(this.guideStats) as Array<[string, any]>)) {
          this.query.data[key] = value['base'];
        }
      }
      this.show.loading = false;
      setTimeout(() => {
        this.show.api = true;
      }, 150);
    },
    async queryItemAssess() {
      this.guide.result = await this.requestItemAssess();
      if (this.guide.result !== undefined) {
        this.show.result = true;
      }
    },
    getItemAssessYACO(quality: boolean = false) {
      // reset
      this.query.data = {
        level: 1,
        quality: 100,
      };
      this.query.extra = {
        isQuality: quality,
        isBoss: true,
        fromGuide: false,
      };
      if (quality && store.guide.cache !== undefined) {
        this.query.extra.fromGuide = true;
        this.query.extra.isBoss = store.guide.cache['boss'];
      }
      this.yaco.result = {
        quality: 1,
        stats: {},
      }
      for (const [key, value] of (Object.entries(this.ornaStats) as Array<[string, string]>)) {
        if (allowedKeys.has(key)) {
          this.query.data[key] = Number(value.endsWith('%') ? value.slice(0, -1) : value);
          this.yaco.result.stats[key] = {
            base: Number(value.endsWith('%') ? value.slice(0, -1) : value),
            values: Array({ length: 13 }),
          }
        }
      }
      setTimeout(() => {
        this.show.yaco = true;
      }, 150);
    },
    queryItemAssessYACOAPI() {
      const isWeapon = store.codex.basedItem['place'] === 'Weapon';
      let pass: any = undefined;
      if (isWeapon) {
        pass = new Set(['crit', 'dexterity', 'mana', 'hp']);
      } else {
        pass = new Set(['crit', 'dexterity']);
      }
      const query = (Object.entries(this.query.data).filter((m) => !pass.has(m[0])) as Array<[string, number]>).toSorted((a: [string, number], b: [string, number]) => b[1] - a[1]);
      if (this.query.extra.isQuality) {
        this.yaco.result.quality = this.query.data.quality / 100;
      }
      else {
        this.yaco.result.quality = 2;
        if (query.length > 0) {
          const key = query[0][0];
          this.yaco.result.quality = getItemQuailty(this.query.data[key], this.yaco.result.stats[key].base, this.query.data.level, this.query.data.isBoss);
        }
      }
      (Object.entries(this.yaco.result.stats) as Array<[string, any]>).forEach(([key, stat]) => {
        this.yaco.result.stats[key].values = getUpgradedStats(stat.base, this.yaco.result.quality, this.query.extra.isBoss, key, isWeapon)
      })
      this.show.yacoResult = true;
    }
  },
})
</script>
