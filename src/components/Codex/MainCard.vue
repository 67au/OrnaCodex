<script setup lang="ts">
import { global, useCodexViewState } from '@/store';
</script>

<template>
  <var-card class="card" layout="row">
    <template #title>
      <div class="card-title">
        {{ codexViewState.lang['name'] }}
      </div>
    </template>

    <template #image>
      <var-image :class="`codex-icon ${rarityAura}`"
        :src="global.getStaticUrl(codexViewState.item['icon'])" width="72" fit="contain" />
    </template>

    <template #description>
      <div class="card-description">
        <var-space size="mini" class="space">
          <var-chip type="warning" size="small" :round="true" plain>
            {{ global.getTier(codexViewState.item['tier']) }}
          </var-chip>
          <var-chip type="primary" size="small" :round="true" plain>
            {{ $t(`categories.${codexViewState.item['category']}`) }}
            <template #left>
              <var-icon name="bookmark" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexViewState.item['exotic'] === true" class="exotic" size="small" :round="true" plain>
            {{ $t('exotic') }}
          </var-chip>

          <var-chip v-if="codexViewState.item['rarity'] !== undefined" :class="rarityText"
            size="small" :round="true" plain>
            {{ $t(`meta.rarity.${codexViewState.item['rarity']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['event'] !== undefined" class="highlight" size="small" :round="true"
            plain v-for="event in codexViewState.item['event']" :key="event">
            <span class="event">
              {{ $t(`meta.event.${event}`) }}
            </span>
          </var-chip>

          <var-chip v-if="codexViewState.item['place'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.place.${codexViewState.item['place']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['item_type'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.item_type.${codexViewState.item['item_type']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['useable_by'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.useable_by.${codexViewState.item['useable_by']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['family'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="card-account-details-outline" size="14" />
            </template>
            {{ $t(`meta.family.${codexViewState.item['family']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['hp'] !== undefined" type="danger" size="small" :round="true" plain>
            {{ Number(codexViewState.item['hp']).toLocaleString() }}
            <template #left>
              <var-icon name="heart" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexViewState.item['spell_type'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.spell_type.${codexViewState.item['spell_type']}`) }}
          </var-chip>

          <var-chip v-if="codexViewState.item['costs'] !== undefined" size="small" :round="true" plain>
            {{ `${codexViewState.item['costs']} ${$t('mana')}` }}
          </var-chip>

          <var-chip v-if="codexViewState.item['price'] !== undefined" size="small" :round="true" plain>
            {{ `${Number(codexViewState.item['price']).toLocaleString()} ${$t('orns')}` }}
          </var-chip>

          <var-chip v-if="codexViewState.item['target'] !== undefined" size="small" :round="true" plain>
            {{ $t(`meta.target.${codexViewState.item['target']}`) }}
            <template #left>
              <var-icon name="alert-circle-outline" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="codexViewState.item['power'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="fire" size="14" />
            </template>
            {{ `${codexViewState.item['power']}` }}
          </var-chip>

          <template v-if="codexViewState.item['tags'] !== undefined">
            <var-chip size="small" :round="true" plain v-for="tag in codexViewState.item['tags']" :key="tag">
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
const codexViewState = useCodexViewState();

export default {
  computed: {
    rarityAura() {
      if (['items', 'bosses', 'monsters'].includes(codexViewState.page.category)) {
        return codexViewState.item['aura'] || '';
      }
      if (codexViewState.page.category === 'followers') {
        return global.rarityAura[codexViewState.item['rarity']];
      }
      return ''
    },
    rarityText() {
      if (codexViewState.page.category === 'items') {
        return `${codexViewState.item['aura']}-text`
      }
      if (codexViewState.page.category === 'followers') {
        return `${global.rarityAura[codexViewState.item['rarity']]}-text`;
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