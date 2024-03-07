<script setup lang="ts">
import { store, global } from '@/store';
</script>

<template>
  <var-card class="card" layout="row">
    <template #title>
      <div class="card-title">
        {{ store.codex.usedItem['name'] }}
      </div>
    </template>

    <template #image>
      <var-image :class="`codex-icon ${store.codex.usedItem['aura']}`"
        :src="`${global.staticUrl}${store.codex.usedItem['icon']}`" width="72" fit="contain" />
    </template>

    <template #description>
      <div class="card-description">
        <var-space size="mini" class="space">
          <var-chip type="warning" size="small" :round="true" plain>
            {{ global.star + store.codex.usedItem['tier'] }}
          </var-chip>
          <var-chip type="primary" size="small" :round="true" plain>
            {{ $t(`categories.${store.codex.usedItem['category']}`) }}
            <template #left>
              <var-icon name="bookmark" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="store.codex.usedItem['exotic'] === true" class="exotic" size="small" :round="true" plain>
            {{ $t('exotic') }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['rarity'] !== undefined" :class="`${store.codex.usedItem['aura']}-text`"
            size="small" :round="true" plain>
            {{ store.codex.usedItem['rarity'] }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['event'] !== undefined" class="highlight" size="small" :round="true"
            plain v-for="event in store.codex.usedItem['event']" :key="event">
            <span class="event">{{ event }}</span>
          </var-chip>

          <var-chip v-if="store.codex.usedItem['place'] !== undefined" size="small" :round="true" plain>
            {{ store.codex.usedItem['place'] }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['useable_by'] !== undefined" size="small" :round="true" plain>
            {{ store.codex.usedItem['useable_by'] }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['family'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="card-account-details-outline" size="14" />
            </template>
            {{ store.codex.usedItem['family'] }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['hp'] !== undefined" type="danger" size="small" :round="true" plain>
            {{ Number(store.codex.usedItem['hp']).toLocaleString() }}
            <template #left>
              <var-icon name="heart" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="store.codex.usedItem['spell_type'] !== undefined" size="small" :round="true" plain>
            {{ `${store.codex.usedItem['spell_type']}` }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['costs'] !== undefined" size="small" :round="true" plain>
            {{ `${store.codex.usedItem['costs']}` }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['price'] !== undefined" size="small" :round="true" plain>
            {{ `${Number(store.codex.usedItem['price']).toLocaleString()} ${$t('orns')}` }}
          </var-chip>

          <var-chip v-if="store.codex.usedItem['target'] !== undefined" size="small" :round="true" plain>
            {{ `${store.codex.usedItem['target']}` }}
            <template #left>
              <var-icon name="alert-circle-outline" size="14" />
            </template>
          </var-chip>

          <var-chip v-if="store.codex.usedItem['power'] !== undefined" size="small" :round="true" plain>
            <template #left>
              <var-icon name="fire" size="14" />
            </template>
            {{ `${store.codex.usedItem['power']}` }}
          </var-chip>

          <template v-if="store.codex.usedItem['tags'] !== undefined">
            <var-chip size="small" :round="true" plain v-for="tag in store.codex.usedItem['tags']" :key="tag">
              {{ `${tag}` }}
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
export default {
  data() {
    return {
      store,
    }
  }
}
</script>

<style src="@/styles/color.css" scoped></style>

<style scoped>
.codex-icon {
  width: 72px;
  height: 72px;
  margin: 16px 0 0 16px;
  flex-shrink: 0;
  image-rendering: pixelated;
}
</style>