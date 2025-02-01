<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { enterCodex, getStaticUrl, rarityAura, rarityText } from '@/plugins/utils'
import { useCodexState } from '@/stores/codex'
import type { Status } from '@/types'
import type { PropType } from 'vue'
</script>

<template>
  <var-cell class="entry-cell" border @click="enterCodex(entry.category, entry.id)">
    <template #icon>
      <var-icon
        class="append-icon"
        :class="rarityAura(entry.category, entry.id)"
        :size="36"
        :name="getStaticUrl(entry.meta.icon)"
      />
    </template>

    <var-space align="center" size="small">
      <span :class="rarityText(entry.category, entry.id)">
        {{ entry.lang.name }}
      </span>
      <var-chip type="warning" size="mini" :round="true" plain>
        {{ entry.tier }}
      </var-chip>
    </var-space>

    <template #description>
      <var-space size="mini" class="line-height-tight">
        <var-chip
          type="primary"
          size="mini"
          :round="false"
          plain
          v-if="!disableKeysSet.has(ce.category)"
        >
          {{ $t(`categories.${ce.category}`) }}
        </var-chip>

        <template v-if="entry.meta.event !== undefined">
          <var-chip
            class="highlight"
            size="mini"
            :round="false"
            plain
            v-for="event in entry.meta.event"
            :key="event"
          >
            {{ $t(`meta.event.${event}`) }}
          </var-chip>
        </template>

        <var-chip
          v-if="entry.meta.rarity !== undefined && entry.category !== 'items'"
          size="mini"
          :round="false"
          plain
        >
          {{ $t(`meta.rarity.${entry.meta.rarity}`) }}
        </var-chip>

        <var-chip v-if="entry.meta.exotic === true" class="exotic" size="mini" :round="false" plain>
          {{ $t('exotic') }}
        </var-chip>

        <var-chip v-if="entry.meta.place !== undefined" size="mini" :round="false" plain>
          {{ $t(`meta.place.${entry.meta.place}`) }}
        </var-chip>
        <var-chip v-if="entry.meta.useable_by !== undefined" size="mini" :round="false" plain>
          {{ $t(`meta.useable_by.${entry.meta.useable_by}`) }}
        </var-chip>
        <var-chip
          type="primary"
          v-if="entry.meta.spell_type !== undefined"
          size="mini"
          :round="false"
          plain
        >
          {{ $t(`meta.spell_type.${entry.meta.spell_type}`) }}
        </var-chip>
        <var-chip v-if="ce.power !== undefined" size="mini" :round="false" plain>
          <template #left>
            <div class="i-mdi-fire text-sm"></div>
          </template>
          {{ ce.power }}
        </var-chip>

        <!-- Drops -->
        <template v-if="ce.meta.causes !== undefined">
          <var-chip
            type="danger"
            size="mini"
            :round="false"
            plain
            v-for="(status, index) in ce.meta.causes as Array<Status>"
            :key="index"
          >
            <span v-if="status.chance !== undefined">
              {{ `${$t(`meta.status.${status.name}`)} (${status.chance})` }}
            </span>
            <span v-else>
              {{ `${$t(`meta.status.${status.name}`)}` }}
            </span>
          </var-chip>
        </template>

        <template v-if="ce.meta.gives !== undefined">
          <var-chip
            type="info"
            size="mini"
            :round="false"
            plain
            v-for="(status, index) in ce.meta.gives as Array<Status>"
            :key="index"
          >
            {{ `${$t(`meta.status.${status.name}`)} (${status.chance})` }}
          </var-chip>
        </template>

        <template v-if="ce.meta.cures !== undefined">
          <var-chip
            type="success"
            size="mini"
            :round="false"
            plain
            v-for="(status, index) in ce.meta.cures as Array<Status>"
            :key="index"
          >
            {{ `${$t(`meta.status.${status.name}`)}` }}
          </var-chip>
        </template>

        <template v-if="ce.meta.immunities !== undefined">
          <var-chip
            type="warning"
            size="mini"
            :round="false"
            plain
            v-for="(status, index) in ce.meta.immunities as Array<Status>"
            :key="index"
          >
            {{ `${$t(`meta.status.${status.name}`)}` }}
          </var-chip>
        </template>
      </var-space>
      <template v-if="ce.meta.stats !== undefined">
        <var-divider dashed/>
        <StatLists class="color-gray" size="mini" :stats="ce.meta.stats"/>
      </template>
    </template>
  </var-cell>
</template>

<script lang="ts">
const disableKeysSet = new Set(['spells', 'items', 'classes'])

export default {
  props: {
    entry: {
      type: Object as PropType<CodexEntry>,
      required: true
    }
  },
  computed: {
    ce() {
      return this.entry
    },
    codexState() {
      return useCodexState()
    }
  }
}
</script>

<style src="@/styles/color.less" lang="less" />
