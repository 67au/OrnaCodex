<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { global } from '@/plugins/global'
import { getStaticUrl, rarityAura, rarityText } from '@/plugins/utils'
</script>

<template>
  <var-card class="card" layout="row">
    <template #title slotClass="">
      <div class="card-title">
        {{ ce.lang['name'] }}
      </div>
    </template>
    <template #image>
      <var-space
        class="ml-4 mt-6"
        direction="column"
        size="large"
        justify="flex-start"
        align="center"
      >
        <var-image
          :class="['codex-icon', rarityAura(ce.category, ce.id)]"
          :src="getStaticUrl(ce.meta['icon'])"
          width="72"
          fit="contain"
        />
      </var-space>
    </template>

    <template #extra>
      <var-space class="mb-1" direction="column">
        <var-link :href="`${global.ornaUrl}${ce.url}`" target="_blank" underline="none">
          <var-button type="primary" size="small">
            <div class="i-mdi-export-variant text-md mr-0.5"></div>
            OrnaRPG
          </var-button>
        </var-link>
      </var-space>
    </template>

    <template #description>
      <div class="card-description mt-2 pb-8">
        <var-divider dashed />
        <var-space size="mini" class="line-height-tight">
          <var-chip type="warning" :size="chipSize" :round="true" plain>
            {{ ce.tier }}
          </var-chip>

          <var-chip type="primary" :size="chipSize" :round="true" plain>
            {{ $t(`categories.${ce.meta.category}`) }}
            <template #left>
              <div class="i-mdi-category text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            v-if="ce.meta.exotic === true"
            class="exotic"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t('exotic') }}
          </var-chip>

          <var-chip
            v-if="ce.meta.rarity !== undefined"
            :class="rarityText(ce.category, ce.id)"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.rarity.${ce.meta.rarity}`) }}
            <template #left>
              <div class="i-mdi-clover text-lg"></div>
            </template>
          </var-chip>

          <template v-if="ce.meta.event !== undefined">
            <var-chip
              class="highlight"
              :size="chipSize"
              :round="true"
              plain
              v-for="event in ce.meta.event"
              :key="event"
            >
              <span class="event">
                {{ $t(`meta.event.${event}`) }}
              </span>
            </var-chip>
          </template>

          <var-chip
            type="info"
            v-if="ce.meta.place !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.place.${ce.meta.place}`) }}
            <template #left>
              <div class="i-mdi-treasure-chest text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="info"
            v-if="ce.meta.item_type !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.item_type.${ce.meta.item_type}`) }}
            <template #left>
              <div class="i-mdi-invoice-line-items text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="info"
            v-if="ce.meta.useable_by !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.useable_by.${ce.meta.useable_by}`) }}
            <template #left>
              <div class="i-mdi-target-account text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="warning"
            v-if="ce.meta.family !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.family.${ce.meta.family}`) }}
            <template #left>
              <div class="i-mdi-account-tag text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="danger"
            v-if="ce.meta.hp !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ `${Number(ce.meta.hp).toLocaleString()}` }}
            <template #left>
              <div class="i-mdi-heart text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="warning"
            v-if="ce.meta.spell_type !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ $t(`meta.spell_type.${ce.meta.spell_type}`) }}
            <template #left>
              <div v-if="ce.meta.spell_type === 'skill'" class="i-mdi-sword text-lg"></div>
              <div v-else class="i-mdi-magic-staff text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="danger"
            v-if="ce.meta.price !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ `${Number(ce.meta.price).toLocaleString()} ${$t('orns')}` }}
          </var-chip>

          <var-chip v-if="ce.meta.target !== undefined" :size="chipSize" :round="true" plain>
            {{ $t(`meta.target.${ce.meta.target}`) }}
            <template #left>
              <div class="i-mdi-target text-lg"></div>
            </template>
          </var-chip>

          <var-chip
            type="danger"
            v-if="ce.power !== undefined"
            :size="chipSize"
            :round="true"
            plain
          >
            {{ ce.power }}
            <template #left>
              <div class="i-mdi-fire text-lg"></div>
            </template>
          </var-chip>

          <template v-if="ce.meta.tags !== undefined">
            <var-chip
              type="info"
              :size="chipSize"
              :round="true"
              plain
              v-for="tag in ce.meta.tags"
              :key="tag"
            >
              {{ $t(`meta.tags.${tag}`) }}
              <template #left>
                <div class="i-mdi-tag text-lg"></div>
              </template>
            </var-chip>
          </template>
        </var-space>
        <var-divider />
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
const chipSize = 'small'

export default defineComponent({
  inject: ['view'],
  computed: {
    ce() {
      return this.view as CodexEntry
    }
  }
})
</script>

<style src="@/styles/color.less" lang="less" scoped />
<style scoped>
.card-title {
  color: var(--card-title-color);
  font-size: var(--card-title-font-size);
  padding: var(--card-title-padding);
  margin: var(--card-title-margin);
}

.codex-icon {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  image-rendering: pixelated;
}
</style>
