<template>
  <var-button text-color="#fff" text round @click="show = true">
    <div class="i-mdi-github text-xl" />
  </var-button>
  <var-dialog :title="$t('about')" v-model:show="show" :cancel-button="false">
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
        <div class="cell-description">
          <var-link text-color="#aaa" href="https://playorna.com" target="_blank">
            Official OrnaRPG Codex
          </var-link>
          ,
          <var-link text-color="#aaa" href="https://github.com/yukixz/orna-tools" target="_blank">
            套套@yukixz
          </var-link>
          ,
          <var-link text-color="#aaa" href="https://orna.guide" target="_blank">
            OrnaGuide
          </var-link>
        </div>
      </template>
    </var-cell>
    <var-cell class="mini-cell line-height-normal" title="License">
      <template #icon>
        <div class="i-mdi-license text-size-3xl mr-2"></div>
      </template>
      <template #description>
        <div class="cell-description">
          <var-link text-color="#aaa" href="https://github.com/67au/OrnaCodex/raw/main/LICENSE" target="_blank">
            MIT License
          </var-link>
        </div>
      </template>
    </var-cell>
  </var-dialog>
</template>

<script lang="ts">

export default {
  props: {
    dataCreated: {
      type: Object as PropType<Date>,
    },
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