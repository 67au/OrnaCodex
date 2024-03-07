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
    <var-chip type="warning" size="mini" :round="true" plain>{{ global.star + codex['tier']
    }}</var-chip>
    <br>
    <var-space size="mini" class="cell-chip-space">
      <template v-if="codex['exotic'] !== undefined">
        <var-chip class="exotic" size="mini" :round="false" plain v-if="codex['exotic']">
          {{ $t('exotic') }}
        </var-chip>
      </template>
      <template v-if="!['spells', 'items', 'classes'].includes(codex['category'])">
      <var-chip type="primary" size="mini" :round="false" plain>
        {{ $t(`categories.${codex['category']}`) }}
      </var-chip>
    </template>
      <template v-if="codex['event'] !== undefined">
        <var-chip class="highlight" size="mini" :round="false" plain v-for="event in codex['event']" :key="event">
          {{ event }}
        </var-chip>
      </template>
      <template v-if="codex['rarity'] !== undefined">
        <var-chip :class="`${codex['aura']}-text`" size="mini" :round="false" plain>{{ codex['rarity'] }}</var-chip>
      </template>
      <template v-if="codex['place'] !== undefined">
        <var-chip size="mini" :round="false" plain>{{ codex['place'] }}</var-chip>
      </template>
      <template v-if="codex['useable_by'] !== undefined && !['items'].includes(codex['category'])">
        <var-chip size="mini" :round="false" plain>{{ codex['useable_by'] }}</var-chip>
      </template>
      <template v-if="codex['spell_type'] !== undefined">
        <var-chip size="mini" :round="false" plain>{{ codex['spell_type'] }}</var-chip>
      </template>
      <template v-if="codex['power'] !== undefined">
        <var-chip size="mini" :round="false" plain>
          <template #left>
            <var-icon name="fire" size="12" />
          </template>
          {{ codex['power'] }}
        </var-chip>
      </template>

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
        <var-chip type="primary" size="mini" :round="false" plain v-for="immunity, index in codex['immunities']" :key="index">
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
      default: () => {},
    },
    click: {
      type: Function,
      default: () => {},
    }
  }
})
</script>

<style src="@/styles/color.css" scoped></style>