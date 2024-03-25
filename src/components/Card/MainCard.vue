<script setup lang="ts">
import { global, useCodexState } from '@/store';
</script>

<template>
  <var-card class="card" layout="row">
    <template #title>
      <div class="card-title">
        {{ codexState.basedItem['name'] }}
      </div>
    </template>

    <template #image>
      <var-image :class="`codex-icon ${rarityAura}`"
        :src="global.getStaticUrl(codexState.usedItem['icon'])" width="72" fit="contain" />
    </template>

    <template #description>
      <div class="card-description">
        <var-space size="mini" class="space">
          <var-chip type="warning" size="small" :round="true" plain>
            {{ global.getTier(codexState.usedItem['tier']) }}
          </var-chip>
          <var-chip type="primary" size="small" :round="true" plain>
            {{ $t(`categories.${codexState.usedItem['category']}`) }}
            <template #left>
              <var-icon name="bookmark" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexState.usedItem['exotic'] === true" class="exotic" size="small" :round="true" plain>
            {{ $t('exotic') }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['rarity'] !== undefined" :class="rarityText"
            size="small" :round="true" plain>
            {{ $t(`meta.rarity.${codexState.usedItem['rarity']}`) }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['event'] !== undefined" class="highlight" size="small" :round="true"
            plain v-for="event in codexState.usedItem['event']" :key="event">
            <span class="event">
              {{ $t(`meta.event.${event}`) }}
            </span>
          </var-chip>

          <var-chip v-if="codexState.usedItem['place'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.place.${codexState.usedItem['place']}`) }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['useable_by'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.useable_by.${codexState.usedItem['useable_by']}`) }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['family'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="card-account-details-outline" size="14" />
            </template>
            {{ $t(`meta.family.${codexState.usedItem['family']}`) }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['hp'] !== undefined" type="danger" size="small" :round="true" plain>
            {{ Number(codexState.usedItem['hp']).toLocaleString() }}
            <template #left>
              <var-icon name="heart" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexState.usedItem['spell_type'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.spell_type.${codexState.usedItem['spell_type']}`) }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['costs'] !== undefined" size="small" :round="true" plain>
            {{ `${codexState.usedItem['costs']} ${$t('mana')}` }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['price'] !== undefined" size="small" :round="true" plain>
            {{ `${Number(codexState.usedItem['price']).toLocaleString()} ${$t('orns')}` }}
          </var-chip>

          <var-chip v-if="codexState.usedItem['target'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.target.${codexState.usedItem['target']}`) }}
            <template #left>
              <var-icon name="alert-circle-outline" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexState.usedItem['power'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="fire" size="14" />
            </template>
            {{ `${codexState.usedItem['power']}` }}
          </var-chip>

          <template v-if="codexState.usedItem['tags'] !== undefined">
            <var-chip size="small" :round="true" plain v-for="tag in codexState.usedItem['tags']" :key="tag">
              {{ $t(`meta.tags.${tag}`) }}
              <template #left>
                <var-icon name="tag" size="14" />
              </template>
            </var-chip>
          </template>

        </var-space>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
const codexState = useCodexState();

export default {
  computed: {
    rarityAura() {
      if (['items', 'bosses', 'monsters'].includes(codexState.page.category)) {
        return codexState.usedItem['aura'] || '';
      }
      if (codexState.page.category === 'followers') {
        return global.rarityAura[codexState.usedItem['rarity']];
      }
      return ''
    },
    rarityText() {
      if (codexState.page.category === 'items') {
        return `${codexState.usedItem['aura']}-text`
      }
      if (codexState.page.category === 'followers') {
        return `${global.rarityAura[codexState.usedItem['rarity']]}-text`;
      }
      return ''
    }
  }
}
</script>

<style src="@/styles/color.less" lang="less" />

<style>
.codex-icon {
  width: 72px;
  height: 72px;
  margin: 16px 0 0 16px;
  flex-shrink: 0;
  image-rendering: pixelated;
}
</style>