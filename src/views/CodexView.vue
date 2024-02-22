<script setup>
import { watch } from 'vue';
import { store, global } from '@/store';
import { defineAsyncComponent } from 'vue';
import MainCard from '@/components/Card/MainCard.vue';
import StatsCard from '@/components/Card/StatsCard.vue';
import AbilityCard from '@/components/Card/AbilityCard.vue';
import DropsCard from '@/components/Card/DropsCard.vue';
import MaterialCard from '@/components/Card/MaterialCard.vue';
import SpellCard from '@/components/Card/SpellCard.vue';
import DescriptionCard from '@/components/Card/DescriptionCard.vue';
import GuideResult from '@/components/GuideResult.vue'
</script>

<template>
  <main>
    <template v-if="loading">
      <!-- main -->
      <div class="container">
        <MainCard />
        <DescriptionCard />
        <!-- OrnaGuide -->
        <var-card class="card">
          <template #description>
            <div class="card-description">
              <var-space justify="flex-start" align="center">
                <var-link :href="`${global.ornaUrl}${store.codex.url}`" target="_blank" underline="none">
                  <var-button type="primary" size="small"> Playorna.com </var-button>
                </var-link>
                <var-button type="success" size="small" @click="getOrnaGuide" :loading="show.loading" loading-type="wave">
                  Orna.guide </var-button>
                <var-button type="warning" size="small" @click="show.json = true"> JSON </var-button>
                <template v-if="store.codexPage.category === 'items' && store.codex.usedItem['stats'] !== undefined">
                  <var-button type="info" size="small" @click="getItemAssess" :loading="show.loading" loading-type="wave">
                    Assess </var-button>
                  <var-button type="danger" size="small" @click="getItemAssessAPI" :loading="show.loading"
                    loading-type="wave">
                    Assess(API) </var-button>
                </template>
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
    <GuideResult :click="() => show.guide = false" :href="guidePageUrl" />
  </var-popup>

  <!-- Assess -->
  <var-popup :default-style="false" v-model:show="show.assess">
    <GuideResult :click="() => show.assess = false" :href="assessQueryUrl" />
  </var-popup>


  <!-- AssessApi -->
  <var-dialog v-model:show="show.api" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="magnify" /> Assess
      </span>
    </template>
    <template v-if="store.guide.cache !== undefined && guideStats !== undefined">
      <div>
        <span> {{ store.codex.usedItem['name'] }} </span>
        <var-row :gutter="[8, 4]" style="margin-top: 8px;" align="center">
          <var-col :span="8">
            <div class="assess">
              <var-select variant="outlined" :placeholder="$t('query.level')" v-model="guide.query['level']" size="small">
                <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (x, i) => i + 1)" />
              </var-select>
            </div>
          </var-col>
          <var-col :span="8" v-for="key in Object.keys(guideStats)">
            <div class="assess">
              <var-input variant="outlined" size="small" type="number" :placeholder="$t(`query.${key}`)"
                v-model="guide.query[key]" />
            </div>
          </var-col>
          <var-col :span="8">
            <var-button style="width: 100%;" type="primary" @click="queryItemAssess">
              {{ $t('query.query') }}
            </var-button>
          </var-col>
        </var-row>
      </div>
    </template>
    <template v-else>
      <var-space size="normal" align="center" justify="center">
        <var-button type="primary" disabled> {{ $t('notfound') }} </var-button>
      </var-space>
    </template>
  </var-dialog>

  <!-- AssessQuery -->
  <var-popup :default-style="false" v-model:show="show.result">
    <var-paper class="popup-content">
      <var-space align="center" justify="space-between" style="margin-bottom: 2px">
        <span>{{ store.codex.usedItem['name'] }}</span>
        <var-chip size="small" :type="guide.result['quality'] > 0 ? 'primary' : 'danger'">
          <template #left>
            <var-icon v-if="guide.result['quality'] > 0" name="checkbox-marked-circle" size="small" />
            <var-icon v-else name="close-circle" size="small" />
          </template>
          {{ `${guide.result['quality'] * 100}%` }}
        </var-chip>
      </var-space>
      <var-table class="assess-table">
        <thead>
          <tr>
            <th> {{ $t('query.level') }} </th>
            <th v-for="key in Object.keys(guide.result['stats'])">{{ $t(`query.${key}`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {{ $t('query.base') }} </td>
            <td v-for="stat in Object.values(guide.result['stats'])">{{ stat['base'] }}</td>
          </tr>
          <tr v-for="(_, i) in Array.from({ length: 13 })">
            <td>{{ i + 1 }}</td>
            <td v-for="stat in Object.values(guide.result['stats'])">{{ stat['values'][i] }}</td>
          </tr>
          <tr>
            <th> {{ $t('query.level') }} </th>
            <th v-for="key in Object.keys(guide.result['stats'])">{{ $t(`query.${key}`) }}</th>
          </tr>
        </tbody>
      </var-table>
      <var-space justify="space-around" style="margin-top: 4px;">
        <var-button size="small" type="primary" icon-container @click="show.result = false">
          <var-icon name="window-close" size="16" />
        </var-button>
      </var-space>
    </var-paper>
  </var-popup>
</template>

<script>
const guideApiMap = {
  'items': 'item',
  'monsters': 'monster',
  'bosses': 'monster',
  'raids': 'monster',
  'followers': 'pet',
  'spells': 'skill',
}
const guidePageMap = {
  'items': 'items',
  'monsters': 'monsters',
  'bosses': 'monsters',
  'raids': 'monsters',
  'followers': 'pets',
  'spells': 'skills',
}
const monsterSet = new Set(['monsters', 'bosses']);

export default {
  mounted() {
    store.codexPage.category = this.$route.params.category
    store.codexPage.id = this.$route.params.id
    this.loading = true
    watch(() => this.$route.params, (newVal, oldVal) => {
      store.codexPage.category = this.$route.params.category
      store.codexPage.id = this.$route.params.id
    });
  },
  data() {
    return {
      store,
      guide: {
        query: {
          level: "1",
        },
        result: undefined,
      },
      show: {
        guide: false,
        json: false,
        assess: false,
        api: false,
        result: false,
        loading: false,
      },
      loading: false,
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
        return `${this.assessUrl}?item=${this.guideId}`;
      } else {
        return assessUrl;
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
    }
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
      setTimeout(() => controller.abort(), 5000);
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
          body: JSON.stringify(Object.fromEntries(Object.entries(this.guide.query).map(([k, v]) => [k, Number(v)])))
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
      if (this.guideStats !== undefined) {
        this.guide.query['id'] = store.guide.cache['id']
        this.guide.query['level'] = 1;
        for (const [key, value] of Object.entries(this.guideStats)) {
          this.guide.query[key] = value['base'];
        }
      }
      this.show.loading = false;
      setTimeout(() => {
        this.show.api = true;
      }, 350);
    },
    async queryItemAssess() {
      this.guide.result = await this.requestItemAssess();
      if (this.guide.result !== undefined) {
        this.show.result = true;
      }
    },
  },
}
</script>

<style scoped>
.assess-table {
  overflow: scroll;
  max-height: 65vh;
  white-space: nowrap;
}

.popup-content {
  padding: 24px;
  width: 85vw;
  max-width: 375px;
  border-radius: 28px;
}
</style>
