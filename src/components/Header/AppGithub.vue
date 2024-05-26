<template>
  <var-button text-color="#fff" text round @click="show = true">
    <div class="i-mdi-github text-xl" />
  </var-button>
  <var-dialog :title="$t('about')" v-model:show="show" :cancel-button="false">
    <var-cell class="text-cell" title="Data Last Updated At:">
      <template #icon>
        <div class="i-mdi-update text-size-3xl mr-2"></div>
      </template>
      <template #description>
        <div class="cell-description">
          {{ dataCreated?.toLocaleString() }}
        </div>
      </template>
    </var-cell>
    <var-cell class="text-cell" title="Repo:">
      <template #icon>
        <div class="i-mdi-github text-size-3xl mr-2"></div>
      </template>
      <template #description>
        <div class="cell-description">
          <var-link :href="link" target="_blank">
            GitHub
          </var-link>
        </div>
      </template>
    </var-cell>
    <var-cell class="text-cell" title="Author:">
      <template #icon>
        <div class="i-mdi-account-circle text-size-3xl mr-2"></div>
      </template>
      <template #description>
        <div class="cell-description">
          {{ author }}
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
    link: {
      type: String,
    },
    author: {
      type: String,
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