<template>
  <var-button text-color="#fff" text round @click="show = true">
    <div class="i-mdi-github text-xl" />
  </var-button>
  <PopupPaper v-model:show="show" max-width="sm">
    <template #title>
      <var-chip class="text-md" type="default" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-information" />
        </template>
        <div>{{ $t('about') }}</div>
      </var-chip>
    </template>
    <div class="px-2 pt-4">
      <var-cell class="mini-cell line-height-normal" title="Data Last Updated At">
        <template #icon>
          <div class="i-mdi-update text-size-3xl mr-2"></div>
        </template>
        <template #description>
          <div class="cell-description">
            {{ dataCreated?.toLocaleString() }}
          </div>
        </template>
      </var-cell>
      <var-cell class="mini-cell line-height-normal" title="Repo">
        <template #icon>
          <div class="i-mdi-github text-size-3xl mr-2"></div>
        </template>
        <template #description>
          <div class="cell-description">
            <var-link text-color="#aaa" href="https://github.com/67au/OrnaCodex" target="_blank">
              GitHub
            </var-link>
          </div>
        </template>
      </var-cell>
      <var-cell class="mini-cell line-height-normal" title="Author">
        <template #icon>
          <div class="i-mdi-account-circle text-size-3xl mr-2"></div>
        </template>
        <template #description>
          <div class="cell-description">
            <var-link text-color="#aaa" href="https://github.com/67au" target="_blank">
              FQEGG
            </var-link>
          </div>
        </template>
      </var-cell>
      <var-cell class="mini-cell line-height-normal" title="Credit">
        <template #icon>
          <div class="i-mdi-thumb-up text-size-3xl mr-2"></div>
        </template>
        <template #description>
          <var-space class="cell-description line-height-none pt-1">
            <var-link text-color="#aaa" href="https://playorna.com" target="_blank">
              Official OrnaRPG Codex
            </var-link>
            <var-link text-color="#aaa" href="https://github.com/yukixz/orna-tools" target="_blank">
              套套@yukixz
            </var-link>
            <var-link text-color="#aaa" href="https://orna.guide" target="_blank">
              OrnaGuide
            </var-link>
          </var-space>
        </template>
      </var-cell>
      <var-cell class="mini-cell line-height-normal" title="License">
        <template #icon>
          <div class="i-mdi-license text-size-3xl mr-2"></div>
        </template>
        <template #description>
          <div class="cell-description">
            <var-link
              text-color="#aaa"
              href="https://github.com/67au/OrnaCodex/raw/main/LICENSE"
              target="_blank"
            >
              MIT License
            </var-link>
          </div>
        </template>
      </var-cell>
    </div>
  </PopupPaper>
</template>

<script lang="ts">
import PopupPaper from '../Utils/PopupPaper.vue'

export default {
  props: {
    dataCreated: {
      type: Object as PropType<Date>
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style>
.cell-description {
  font-size: var(--cell-description-font-size);
  color: var(--cell-description-color);
}
</style>
