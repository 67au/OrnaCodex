<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
import { enterCodex, getStaticUrl, getTierName } from '@/plugins/utils'
import { rarityAura, rarityText } from '@/plugins/utils'
import { global } from '@/plugins/global'
</script>

<template>
  <var-card class="card">
    <template #title>
      <var-space justify="space-between" align="center" class="pt-2 px-4">
        <var-space justify="flex-start" align="center" size="small">
          <var-chip size="small" elevation="2">
            <template #left>
              <Icon class="text-lg" icon-class="i-mdi-magnify" />
            </template>
            <div class="text-md">
              {{ codexState.sorted.length }}
            </div>
          </var-chip>
        </var-space>
        <var-space justify="flex-end" align="center" size="small">
          <PopupButton
            type="info"
            icon-class="i-mdi-layers-edit"
            @click="() => (show.layer = !show.layer)"
          />
        </var-space>
      </var-space>
    </template>
    <template #description>
      <div class="card-description">
        <var-list
          :finished="entriesListState.finished"
          v-model:loading="entriesListState.loading"
          @load="entriesListState.load"
          :offset="1200"
        >
          <var-cell
            v-for="({ category, id }, index) in entriesListState.entries"
            class="entry-cell"
            border
            @click="() => enterCodex(category, id)"
            :key="index"
          >
            <template #icon>
              <var-icon
                :class="`append-icon ${rarityAura(category, id)}`"
                :size="48"
                :name="getStaticUrl(codexState.meta[category][id]['icon'])"
              />
            </template>

            <var-space align="center" size="small">
              <span>
                {{ codexState.lang[category][id]['name'] }}
              </span>
              <var-chip
                v-if="category === 'items' || category === 'followers'"
                size="mini"
                plain
                :class="rarityText(category, id)"
              >
                {{ $t(`meta.rarity.${codexState.meta[category][id]['rarity']}`) }}
              </var-chip>
            </var-space>

            <template #description>
              <var-space size="mini" class="line-height-tight">
                <var-chip type="warning" size="mini" :round="false" plain>
                  {{ getTierName(codexState.meta[category][id]['tier']) }}
                </var-chip>
                <var-chip type="primary" size="mini" :round="false" plain>
                  {{ $t(`categories.${category}`) }}
                </var-chip>

                <var-chip
                  v-if="codexState.meta[category][id]['exotic'] === true"
                  class="exotic"
                  size="mini"
                  :round="false"
                  key="exotic"
                  plain
                >
                  {{ $t('exotic') }}
                </var-chip>

                <var-chip
                  class="highlight"
                  size="mini"
                  :round="false"
                  plain
                  v-for="event in codexState.meta[category][id]['event'] || []"
                  :key="event"
                >
                  <span>{{ $t(`meta.event.${event}`) }}</span>
                </var-chip>

                <var-chip
                  v-for="([key, v], index) in displayKeys.filter(([k, v]) => {
                    if (k === 'raids') {
                      return codexState.meta[category][id][v] !== undefined
                    }
                    return (
                      codexState.meta[category][id]['stats'] !== undefined &&
                      codexState.meta[category][id]['stats'][v] !== undefined
                    )
                  })"
                  :type="index === 0 && sortState?.nameTuple?.[1] === v ? 'success' : 'info'"
                  size="mini"
                  :round="false"
                  :color="
                    v === 'element'
                      ? global.elementColor[codexState.meta[category][id]['stats'][v]]
                      : ''
                  "
                  :plain="codexState.meta[category][id]?.stats?.[v] !== true"
                  :key="index"
                >
                  <template v-if="key === 'raids' && v === 'hp'">
                    {{
                      `${$t('meta.stats.hp')}: ${Number(codexState.meta[category][id]['hp']).toLocaleString()}`
                    }}
                  </template>
                  <template v-else-if="v === 'element'">
                    {{ $t(`meta.stats.${codexState.meta[category][id]['stats'][v]}`) }}
                  </template>
                  <template
                    v-else-if="typeof codexState.meta[category][id]['stats'][v] === 'string'"
                  >
                    {{ `${$t(`meta.stats.${v}`)}: ${codexState.meta[category][id]['stats'][v]}` }}
                  </template>
                  <template v-else>
                    {{ $t(`meta.stats.${v}`) }}
                  </template>
                </var-chip>
              </var-space>
            </template>
          </var-cell>
        </var-list>
      </div>
    </template>
  </var-card>

  <PopupPaper v-model:show="show.layer" max-width="md">
    <template #title>
      <var-chip class="text-md" type="info" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-layers-edit text-lg" />
        </template>
        <div>{{ $t('extraTags') }}</div>
      </var-chip>
    </template>
    <template #button>
      <PopupButton type="warning" icon-class="i-mdi-trash" @click="() => display.clear()" />
    </template>

    <var-divider dashed />

    <var-paper radius="0px">
      <var-space size="small" class="chip-list px-1 py-1">
        <var-chip
          :type="display.has(k) ? 'success' : 'default'"
          v-for="[k, _] in sortKeys"
          elevation="3"
          @click="() => editLayer(k)"
        >
          {{ $t(`sortKeys.${k}`) }}
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: {
        layer: false
      },
      display: new Set()
    }
  },
  methods: {
    editLayer(key: string) {
      if (this.display.has(key)) {
        this.display.delete(key)
      } else {
        this.display.add(key)
      }
    }
  },
  computed: {
    codexState() {
      return useCodexState()
    },
    filtersState() {
      return useFiltersState()
    },
    entriesListState() {
      return useEntriesListState()
    },
    sortState() {
      return useSortState()
    },
    sortKeys() {
      return Object.entries(this.sortState.keys)
    },
    displayKeys() {
      return (this.sortState.nameTuple === undefined ? [] : [this.sortState.nameTuple]).concat(
        this.sortKeys
          .filter(([key]) => this.display.has(key))
          .map(([key, value]) => {
            return (
              key === 'items.stats' ? Array.from(value).concat('element') : Array.from(value)
            ).map((v) => [key, v])
          })
          .flat(1)
          .filter(([k, v]) => {
            if (this.sortState.nameTuple === undefined) {
              return true
            }
            if (k === this.sortState.nameTuple[0] && v === this.sortState.nameTuple[1]) {
              return false
            }
            return true
          }) as [string, string][]
      )
    }
  }
})
</script>

<style>
.entry-cell {
  min-height: 64px;
  padding: 3px 0px;
  --cell-border-left: 6px;
  --cell-border-right: 6px;
}
.chip-list {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
<style src="@/styles/color.less" lang="less" />
