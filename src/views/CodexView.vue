<script setup>
import { watch } from 'vue'
import '@/assets/main.css'
import '@/assets/color.css'
import { store } from '@/store'

</script>

<template>
  <main>
    <var-space justify="space-around">
      <!-- main -->
      <var-card class="main-card" layout="row">
        <template #title>
          <div class="card-title">
            {{ item['name'] }}
          </div>
        </template>
        <template #image>
          <var-image :class="`icon ${item['aura']}`" :src="`${static_url}${item['icon']}`" width="72" fit="contain" />
        </template>
        <template #subtitle>
          <div class="card-subtitle">
            <var-space size="mini" class="space">
              <var-chip type="warning" size="small" :round="true" plain>{{ star + item['tier'] }}</var-chip>
              <var-chip type="primary" size="small" :round="true" plain>{{ $t(`categories.${item['category']}`)
              }}</var-chip>
              <template v-if="item['exotic'] !== undefined">
                <var-chip class="exotic" size="small" :round="true" plain v-if="item['exotic']">{{ $t('exotic')
                }}</var-chip>
              </template>
              <template v-if="item['rarity'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ item['rarity'] }}</var-chip>
              </template>
              <template v-if="item['event'] !== undefined">
                <var-chip class="highlight" size="small"
                  :round="true" plain v-for="event in item['event']">
                  <span class="event">{{ event }}</span>
                </var-chip>
              </template>
              <template v-if="item['place'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ item['place'] }}</var-chip>
              </template>
              <template v-if="item['useable_by'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ item['useable_by'] }}</var-chip>
              </template>
              <template v-if="item['family'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ item['family'] }}</var-chip>
              </template>
              <template v-if="item['hp'] !== undefined">
                <var-chip type="danger" size="small" :round="true" plain>
                  {{ item['hp'] }}
                  <template #left>
                    <var-icon name="heart" size="14" />
                  </template>
                </var-chip>
              </template>
              <template v-if="item['costs'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ `${item['costs']}` }}</var-chip>
              </template>
              <template v-if="item['price'] !== undefined">
                <var-chip size="small" :round="true" plain>{{ `${item['price']} ${$t('orns')}` }}</var-chip>
              </template>
              <template v-if="item['target'] !== undefined">
                <var-chip size="small" :round="true" plain>
                  {{ `${item['target']}` }}
                  <template #left>
                    <var-icon name="alert-circle-outline" size="14" />
                  </template>
                </var-chip>
              </template>
              <template v-if="item['power'] !== undefined">
                <var-chip size="small" :round="true" plain>
                  <template #left>
                    <var-icon name="fire" />
                  </template>
                  {{ `${item['power']}` }}
                </var-chip>
              </template>
              <template v-if="item['tags'] !== undefined">
                <var-chip size="small" :round="true" plain v-for="tag in item['tags']">{{ `${tag}` }}</var-chip>
              </template>
            </var-space>
          </div>
        </template>
        <template #description>
          <template v-if="item['description'] !== undefined">
            <div class="main-card-description">
              {{ item['description'] }}
            </div>
          </template>
        </template>
      </var-card>

      <!-- OrnaGuide -->
      <var-card class="card">
        <template #description>
          <div class="card-description">
            <var-space justify="flex-start" align="center">
              <var-link :href="`${orna_url}/codex/${category}/${id}/`" target="_blank" underline="none">
                <var-button type="primary" size="small"> Playorna.com </var-button>
              </var-link>
              <var-button type="success" size="small" @click="getOrnaGuide" :loading="guideLoading" loading-type="wave">
                Orna.guide </var-button>
              <var-button type="warning" size="small" @click="jsonShow = true"> JSON </var-button>
              <template v-if="category === 'items' && item['stats'] !== undefined">
                <var-button type="info" size="small" @click="getItemAssess" :loading="guideLoading" loading-type="wave">
                  Assess </var-button>
                <var-button type="danger" size="small" @click="getItemAssessAPI" :loading="guideLoading"
                  loading-type="wave">
                  Assess(API) </var-button>
              </template>
            </var-space>
          </div>
        </template>
      </var-card>

      <var-card class="card" :title="$t('stats')" v-if="item['stats'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-space class="space">
              <var-chip size="small" :round="false" plain v-for="stat in item['stats']">
                {{ `${stat.join(': ')}` }}
              </var-chip>
            </var-space>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('ability')" v-if="item['ability'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" border :title="item['ability'][0]" :description="item['ability'][1]">
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('skills')" v-if="item['skills'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['skills']" border @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
              <br>
              <var-space size="mini" class="space">
                <var-chip size="mini" :round="false" plain>{{ codex[category][id]['spell_type'] }}</var-chip>
                <var-chip size="mini" :round="false" plain v-if="codex[category][id]['power'] !== undefined">
                  <template #left>
                    <var-icon name="fire" size="12" />
                  </template>
                  {{ codex[category][id]['power'] }}
                </var-chip>
                <template v-if="codex[category][id]['causes'] !== undefined">
                  <var-chip type="danger" size="mini" :round="false" plain v-for="cause in codex[category][id]['causes']">
                    {{ `${cause['name']} (${cause['chance']})` }}
                  </var-chip>
                </template>
                <template v-if="codex[category][id]['gives'] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain v-for="give in codex[category][id]['gives']">
                    {{ `${give['name']} (${give['chance']})` }}
                  </var-chip>
                </template>
                <template v-if="codex[category][id]['cures'] !== undefined">
                  <var-chip type="success" size="mini" :round="false" plain v-for="cure in codex[category][id]['cures']">
                    {{ `${cure['name']}` }}
                  </var-chip>
                </template>
              </var-space>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('abilities')" v-if="item['abilities'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="ability in item['abilities']" border :title="ability['name']"
              :description="ability['description']">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${ability['icon']}`" />
              </template>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('dropped_by')" v-if="item['dropped_by'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['dropped_by']" border
              @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
              <br>
              <var-space size="mini" class="space">
                <var-chip type="primary" size="mini" :round="false" plain>{{
                  $t(`categories.${codex[category][id]['category']}`) }}</var-chip>
                <template v-if="codex[category][id]['event'] !== undefined">
                  <var-chip class="highlight" style="max-width: 190px; white-space: nowrap; text-overflow: ellipsis; "
                    size="mini" :round="false" plain v-for="event in codex[category][id]['event']">{{ event }}</var-chip>
                </template>
              </var-space>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('drops')" v-if="item['drops'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['drops']" border @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
              <br>
              <var-space size="mini" class="space">
                <template v-if="codex[category][id]['exotic'] !== undefined">
                  <var-chip class="exotic" size="mini" :round="false" plain v-if="codex[category][id]['exotic']">{{
                    $t('exotic')
                  }}</var-chip>
                </template>
                <var-chip size="mini" :round="false" plain>{{ codex[category][id]['rarity'] }}</var-chip>
                <var-chip size="mini" :round="false" plain>{{ codex[category][id]['useable_by'] }}</var-chip>
                <var-chip size="mini" :round="false" plain v-if="codex[category][id]['place'] !== undefined">{{
                  codex[category][id]['place'] }}</var-chip>
                <var-chip size="mini" :round="false" plain v-if="codex[category][id]['power'] !== undefined">{{
                  codex[category][id]['power'] }}</var-chip>
                <template v-if="codex[category][id]['causes'] !== undefined">
                  <var-chip type="danger" size="mini" :round="false" plain v-for="cause in codex[category][id]['causes']">
                    <span v-if="cause['chance']">
                      {{ `${cause['name']} (${cause['chance']})` }}
                    </span>
                    <span v-else>
                      {{ `${cause['name']}` }}
                    </span>
                  </var-chip>
                </template>
                <template v-if="codex[category][id]['gives'] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain v-for="give in codex[category][id]['gives']">
                    {{ `${give['name']} (${give['chance']})` }}
                  </var-chip>
                </template>
                <template v-if="codex[category][id]['immunities'] !== undefined">
                  <var-chip type="primary" size="mini" :round="false" plain
                    v-for="immunity in codex[category][id]['immunities']">
                    {{ `${immunity['name']}` }}
                  </var-chip>
                </template>
              </var-space>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('causes')" v-if="item['causes'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="cause in item['causes']" border>
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${cause['icon']}`" />
              </template>
              <span v-if="cause['chance']">
                {{ `${cause['name']} (${cause['chance']})` }}
              </span>
              <span v-else>
                {{ `${cause['name']}` }}
              </span>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('gives')" v-if="item['gives'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="give in item['gives']" border>
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${give['icon']}`" />
              </template>
              <span v-if="give['chance']">
                {{ `${give['name']} (${give['chance']})` }}
              </span>
              <span v-else>
                {{ `${give['name']}` }}
              </span>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('cures')" v-if="item['cures'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="cure in item['cures']" border>
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${cure['icon']}`" />
              </template>
              {{ `${cure['name']}` }}
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('immunities')" v-if="item['immunities'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="immunity in item['immunities']" border>
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${immunity['icon']}`" />
              </template>
              {{ `${immunity['name']}` }}
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('summons')" v-if="item['summons'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="summon in item['summons']" border>
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${summon['icon']}`" />
              </template>
              {{ `${summon['name']} (${summon['chance']})` }}
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('upgrade_materials')" v-if="item['upgrade_materials'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['upgrade_materials']" border
              @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('bestial_bond')" v-if="item['bestial_bond'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" :title="bb['name']" :description="bb['description']" v-for="bb in item['bestial_bond']"
              border />
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('learned_by')" v-if="item['learned_by'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['learned_by']" border
              @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('requirements')" v-if="item['requirements'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['requirements']" border
              @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('celestial_classes')" v-if="item['celestial_classes'] !== undefined">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="[category, id] in item['celestial_classes']" border
              @click="() => goToInfo(category, id)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][id]['icon']}`" />
              </template>
              {{ codex[category][id]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][id]['tier']
              }}</var-chip>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('materials')" v-if="category === 'items' && isMaterial(id)">
        <template #description>
          <div class="card-description">
            <var-cell class="cell" v-for="mid in store.codex['upgrade_materials'][id]" border
              @click="() => goToInfo(category, mid)">
              <template #icon>
                <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][mid]['icon']}`" />
              </template>
              {{ codex[category][mid]['name'] }}
              <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][mid]['tier']
              }}</var-chip>
            </var-cell>
          </div>
        </template>
      </var-card>
      <var-card class="card" :title="$t('speller')" v-if="category === 'spells' && isSkill(id)">
        <template #description>
          <div class="card-description">
            <template v-for="[category, spellers] in Object.entries(store.codex['skills'][id])">
              <var-cell class="cell" border v-for="speller in spellers" @click="() => goToInfo(category, speller)">
                <template #icon>
                  <var-icon class="append-icon" :size="36" :name="`${static_url}${codex[category][speller]['icon']}`" />
                </template>
                {{ codex[category][speller]['name'] }}
                <var-chip type="warning" size="mini" :round="false" plain>{{ star + codex[category][speller]['tier']
                }}</var-chip>
                <br>
                <var-chip type="primary" size="mini" :round="false" plain>{{
                  $t(`categories.${codex[category][speller]['category']}`) }}</var-chip>
              </var-cell>
            </template>
          </div>
        </template>
      </var-card>
    </var-space>
  </main>

  <!-- Dialog -->
  <var-dialog v-model:show="jsonShow" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="code-json" /> JSON
      </span>
    </template>
    <var-input textarea v-model="itemJson" readonly />
  </var-dialog>

  <!-- Result -->
  <var-dialog v-model:show="guideShow" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="bookmark" /> OrnaGuide
      </span>
    </template>
    <var-space size="normal" align="center" justify="center">
      <template v-if="guideCache !== undefined">
        <var-link :href="`${orna_guide_url}/${codexToGuidePage[category]}?show=${guideId}`" target="_blank"
          underline="none">
          <var-button type="primary"> {{ $t('found') }} </var-button>
        </var-link>
      </template>
      <template v-else>
        <var-button type="primary" disabled> {{ $t('notfound') }} </var-button>
      </template>
    </var-space>
  </var-dialog>

  <!-- Assess -->
  <var-dialog v-model:show="assessShow" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="magnify" /> Assess
      </span>
    </template>
    <var-space size="normal" align="center" justify="center">
      <template v-if="guideCache !== undefined">
        <var-link :href="`${orna_guide_url}/assess?item=${guideId}`" target="_blank" underline="none">
          <var-button type="primary"> {{ $t('found') }} </var-button>
        </var-link>
      </template>
      <template v-else>
        <var-button type="primary" disabled> {{ $t('notfound') }} </var-button>
      </template>
    </var-space>
  </var-dialog>

  <!-- AssessApi -->
  <var-dialog v-model:show="assessApiShow" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="magnify" /> Assess
      </span>
    </template>
    <template v-if="guideCache !== undefined && guideStats !== undefined">
      <div>
        <span> {{ item['name'] }} </span>
        <var-row :gutter="[8, 4]" style="margin-top: 8px;" align="center">
          <var-col :span="8">
            <div class="assess">
              <var-select variant="outlined" :placeholder="$t('query.level')" v-model="assessQuery['level']" size="small">
                <var-option :value="i" :label="i" v-for="i in Array.from({ length: 13 }, (x, i) => i + 1)" />
              </var-select>
            </div>
          </var-col>
          <var-col :span="8" v-for="key in Object.keys(guideCache['stats'])">
            <div class="assess">
              <var-input variant="outlined" size="small" type="number" :placeholder="$t(`query.${key}`)"
                v-model="assessQuery[key]" />
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
  <var-dialog v-model:show="assessQueryShow" :cancel-button="false">
    <template #title>
      <span>
        <var-icon name="magnify" /> {{ $t('query.query') }}
      </span>
    </template>
    <var-space align="center" justify="space-between" style="margin-bottom: 2px">
      <span>{{ item['name'] }}</span>
      <var-chip size="small" type="primary">
        <template #left>
          <var-icon name="checkbox-marked-circle" size="small" />
        </template>
        {{ `${assessQueryResult['quality'] * 100}%` }}
      </var-chip>
    </var-space>
    <var-table class="table">
      <thead>
        <tr>
          <th> {{ $t('query.level') }} </th>
          <th v-for="key in Object.keys(assessQueryResult['stats'])">{{ $t(`query.${key}`) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> {{ $t('query.base') }} </td>
          <td v-for="stat in Object.values(assessQueryResult['stats'])">{{ stat['base'] }}</td>
        </tr>
        <tr v-for="(_, i) in Array.from({ length: 13 })">
          <td>{{ i + 1 }}</td>
          <td v-for="stat in Object.values(assessQueryResult['stats'])">{{ stat['values'][i] }}</td>
        </tr>
        <tr>
          <th> {{ $t('query.level') }} </th>
          <th v-for="key in Object.keys(assessQueryResult['stats'])">{{ $t(`query.${key}`) }}</th>
        </tr>
      </tbody>
    </var-table>
  </var-dialog>
</template>

<script>
const star = '★';
const power = '💪';
const orna_url = 'https://playorna.com';
const static_url = 'https://playorna.com/static';
const orna_guide_url = 'https://orna.guide';
const orna_guide_api = 'https://orna.guide/api/v1';
const codexToGuide = {
  'items': 'item',
  'monsters': 'monster',
  'bosses': 'monster',
  'raids': 'monster',
  'followers': 'pet',
}
const codexToGuidePage = {
  'items': 'items',
  'monsters': 'monsters',
  'bosses': 'monsters',
  'raids': 'monsters',
  'followers': 'pets',
}
const monsterSet = new Set(['monsters', 'bosses']);

export default {
  mounted() {
    watch(() => this.$route.params, (newVal, oldVal) => {
      this.category = this.$route.params.category,
        this.id = this.$route.params.id
    });
  },
  data() {
    return {
      store,
      category: this.$route.params.category,
      id: this.$route.params.id,
      jsonShow: false,
      guideLoading: false,
      guideShow: false,
      assessShow: false,
      assessApiShow: false,
      assessQueryShow: false,
      guideCache: undefined,
      assessQuery: {
        level: "1",
      },
      assessQueryResult: undefined,
    }
  },
  methods: {
    goToInfo(category, id) {
      this.guideCache = undefined;
      this.$router.push({
        path: `/codex/${category}/${id}/`
      });
    },
    isMaterial(id) {
      return this.materials.has(id);
    },
    isSkill(id) {
      return this.skills.has(id);
    },
    async requestOrnaGuide() {
      const itemName = this.itemEn['name'];
      if (codexToGuide[this.category] === undefined) {
        return [];
      }
      let itemQuery = itemName
      if (monsterSet.has(this.category) && itemName.endsWith(' (Arisen)')) {
        itemQuery = itemName.slice(0, -9);
      }
      try {
        const resp = await fetch(`${orna_guide_api}/${codexToGuide[this.category]}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "icontains": [{ "name": itemQuery }] })
        })
        const result = await resp.json();
        return result;
      } catch (error) {
        return [];
      }
    },
    async updateGuideCache() {
      if (this.guideCache === undefined) {
        const result = await this.requestOrnaGuide();
        for (const c of result) {
          if (c['codex'] === this.codexUrl) {
            this.guideCache = c;
            break
          }
        }
      }
    },
    async getOrnaGuide() {
      this.guideLoading = true;
      await this.updateGuideCache()
      this.guideLoading = false;
      setTimeout(() => {
        this.guideShow = true;
      }, 350);
    },
    async getItemAssess() {
      this.guideLoading = true;
      await this.updateGuideCache()
      this.guideLoading = false;
      setTimeout(() => {
        this.assessShow = true;
      }, 350);
    },
    async requestItemAssess() {
      try {
        const resp = await fetch(`${orna_guide_api}/assess`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(Object.entries(this.assessQuery).map(([k, v]) => [k, Number(v)])))
        })
        const result = await resp.json();
        return result;
      } catch (error) {
        return undefined;
      }
    },
    async getItemAssessAPI() {
      this.guideLoading = true;
      await this.updateGuideCache()
      if (this.guideStats !== undefined) {
        this.assessQuery['id'] = this.guideCache['id']
        this.assessQuery['level'] = 1;
        for (const [key, value] of Object.entries(this.guideStats)) {
          this.assessQuery[key] = value['base'];
        }
      }
      this.guideLoading = false;
      setTimeout(() => {
        this.assessApiShow = true;
      }, 350);
    },
    async queryItemAssess() {
      this.assessQueryResult = await this.requestItemAssess();
      if (this.assessQueryResult !== undefined) {
        this.assessQueryShow = true;
      }
    },
  },
  computed: {
    guideStats() {
      return this.guideCache['stats']
    },
    guideId() {
      return this.guideCache['id']
    },
    codexUrl() {
      return `/codex/${this.category}/${this.id}/`
    },
    itemEn() {
      return store.codex['codex']['en'][this.category][this.id];
    },
    codex() {
      return store.codex['codex'][store.lang];
    },
    item() {
      return this.codex[this.category][this.id];
    },
    itemJson() {
      return JSON.stringify(this.item)
    },
    materials() {
      return new Set(Object.keys(store.codex['upgrade_materials']));
    },
    skills() {
      return new Set(Object.keys(store.codex['skills']));
    }
  },
}
</script>

<style scoped>
.main-card {
  width: 300px;
}

.main-card-description {
  color: var(--card-description-color);
  font-size: var(--card-description-font-size);
  padding: var(--card-description-padding);
  margin: 25px 0 0 0;
  transform: translateX(-92px);
  width: 292px;
}

.event {
  padding-top: 2px;
  max-width: 160px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell {
  min-height: 48px;
  padding: 3px 0px;
}

.table {
  overflow: scroll;
  max-height: 60vh;
  white-space: nowrap;
}

.assess {
  /* padding: 2px 2px; */
  width: 100%;
}

.space {
  line-height: 110%;
}

.card {
  width: 300px;
}

.icon {
  width: 72px;
  height: 72px;
  margin: 16px 12px;
  flex-shrink: 0;
  image-rendering: pixelated;
}

.card-subtitle {
  color: var(--card-subtitle-color);
  font-size: var(--card-subtitle-font-size);
  padding: var(--card-subtitle-padding);
  margin: var(--card-subtitle-margin);
}

</style>
