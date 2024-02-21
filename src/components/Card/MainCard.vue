<script setup>
import '@/assets/color.css';
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
        <var-space size="mini" class="cspace">
          <var-chip type="warning" size="small" :round="true" plain>{{ global.star + store.codex.usedItem['tier']
          }}</var-chip>
          <var-chip type="primary" size="small" :round="true" plain>{{
            $t(`categories.${store.codex.usedItem['category']}`)
          }}</var-chip>
          <template v-if="store.codex.usedItem['exotic'] !== undefined">
            <var-chip class="exotic" size="small" :round="true" plain v-if="store.codex.usedItem['exotic']">{{
              $t('exotic')
            }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['rarity'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ store.codex.usedItem['rarity'] }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['event'] !== undefined">
            <var-chip class="highlight" size="small" :round="true" plain v-for="event in store.codex.usedItem['event']">
              <span class="event">{{ event }}</span>
            </var-chip>
          </template>
          <template v-if="store.codex.usedItem['place'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ store.codex.usedItem['place'] }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['useable_by'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ store.codex.usedItem['useable_by'] }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['family'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ store.codex.usedItem['family'] }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['hp'] !== undefined">
            <var-chip type="danger" size="small" :round="true" plain>
              {{ store.codex.usedItem['hp'] }}
              <template #left>
                <var-icon name="heart" size="14" />
              </template>
            </var-chip>
          </template>
          <template v-if="store.codex.usedItem['spell_type'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ `${store.codex.usedItem['spell_type']}` }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['costs'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ `${store.codex.usedItem['costs']}` }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['price'] !== undefined">
            <var-chip size="small" :round="true" plain>{{ `${store.codex.usedItem['price']} ${$t('orns')}` }}</var-chip>
          </template>
          <template v-if="store.codex.usedItem['target'] !== undefined">
            <var-chip size="small" :round="true" plain>
              {{ `${store.codex.usedItem['target']}` }}
              <template #left>
                <var-icon name="alert-circle-outline" size="14" />
              </template>
            </var-chip>
          </template>
          <template v-if="store.codex.usedItem['power'] !== undefined">
            <var-chip size="small" :round="true" plain>
              <template #left>
                <var-icon name="fire" />
              </template>
              {{ `${store.codex.usedItem['power']}` }}
            </var-chip>
          </template>
          <template v-if="store.codex.usedItem['tags'] !== undefined">
            <var-chip size="small" :round="true" plain v-for="tag in store.codex.usedItem['tags']">{{ `${tag}`
            }}</var-chip>
          </template>
        </var-space>
      </div>
    </template>
  </var-card>
</template>

<script>
export default {
  data() {
    return {
      store,
    }
  }
}
</script>
