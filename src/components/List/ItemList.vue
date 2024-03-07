<script setup lang="ts">
import { global } from '@/store';
import { defineComponent } from 'vue';
</script>

<template>
  <var-cell class="codex-cell" border @click="click()">
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${codex['icon']}`" />
    </template>
    {{ codex['name'] }}
    <var-chip type="warning" size="mini" :round="true" plain>
      {{ global.star + codex['tier'] }}
    </var-chip>
    <br>
    <var-space size="mini" class="cell-chip-space">

      <var-chip v-if="codex['exotic'] === true" class="exotic" size="mini" :round="false" plain>
        {{ $t('exotic') }}
      </var-chip>

      <var-chip v-if="!['spells', 'items', 'classes'].includes(codex['category'])" type="primary" size="mini"
        :round="false" plain>
        {{ $t(`categories.${codex['category']}`) }}
      </var-chip>
      <template v-if="codex['event'] !== undefined">
        <var-chip class="highlight" size="mini" :round="false" plain v-for="event in codex['event']" :key="event">
          {{ event }}
        </var-chip>
      </template>
      <var-chip v-if="codex['rarity'] !== undefined" :class="`${codex['aura']}-text`" size="mini" :round="false" plain>
        {{ codex['rarity'] }}
      </var-chip>
      <var-chip v-if="codex['place'] !== undefined" size="mini" :round="false" plain>
        {{ codex['place'] }}
      </var-chip>
      <var-chip v-if="codex['useable_by'] !== undefined && !['items'].includes(codex['category'])" size="mini"
        :round="false" plain>
        {{ codex['useable_by'] }}
      </var-chip>
      <var-chip v-if="codex['spell_type'] !== undefined" size="mini" :round="false" plain>
        {{ codex['spell_type'] }}
      </var-chip>
      <var-chip v-if="codex['power'] !== undefined" size="mini" :round="false" plain>
        <template #left>
          <var-icon name="fire" size="12" />
        </template>
        {{ codex['power'] }}
      </var-chip>

      <!-- Drops -->
      <template v-if="codex['causes'] !== undefined">
        <var-chip type="danger" size="mini" :round="false" plain v-for="cause, index in codex['causes']" :key="index">
          <span v-if="cause['chance']">
            {{ `${cause['name']} (${cause['chance']})` }}
          </span>
          <span v-else>
            {{ `${cause['name']}` }}
          </span>
        </var-chip>
      </template>

      <template v-if="codex['gives'] !== undefined">
        <var-chip type="info" size="mini" :round="false" plain v-for="give, index in codex['gives']" :key="index">
          {{ `${give['name']} (${give['chance']})` }}
        </var-chip>
      </template>

      <template v-if="codex['cures'] !== undefined">
        <var-chip type="success" size="mini" :round="false" plain v-for="cure, index in codex['cures']" :key="index">
          {{ `${cure['name']}` }}
        </var-chip>
      </template>

      <template v-if="codex['immunities'] !== undefined">
        <var-chip type="primary" size="mini" :round="false" plain v-for="immunity, index in codex['immunities']"
          :key="index">
          {{ `${immunity['name']}` }}
        </var-chip>
      </template>
      
    </var-space>
  </var-cell>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    codex: {
      type: Object,
      default: () => { },
    },
    click: {
      type: Function,
      default: () => { },
    }
  }
})
</script>

<style src="@/styles/color.css" scoped></style>