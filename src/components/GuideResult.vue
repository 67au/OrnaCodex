<script setup lang="ts">
import { store } from '@/store';
import { defineComponent } from 'vue';
</script>

<template>
  <var-result class="result" :type="resultType" :title="$t(title)">
    <template #description>
      <template v-if="isSuccess">
        <br>
        <var-link type="primary" :href="href" target="_blank" text-size="16">
          {{ $t('clickHere') }}
        </var-link>
      </template>
    </template>
    <template #footer>
      <var-button :color="resultButtonColor" text-color="#fff" @click="click()">
        {{ $t('close') }}
      </var-button>
    </template>
  </var-result>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      store,
    }
  },
  props: {
    href: {
      type: String,
      default: '',
    },
    click: {
      type: Function,
      default: () => {},
    },
    failed: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isSuccess() {
      return (store.guide.cache !== undefined) && !this.failed;
    },
    title() {
      return this.isSuccess ? 'found' : 'notfound';
    },
    resultType() {
      return this.isSuccess ? 'success' : 'question';
    },
    resultButtonColor() {
      return this.isSuccess ? 'var(--result-success-color)' : 'var(--result-question-color)';
    }
  }
})
</script>

<style>
.result {
  width: 75vw !important;
}
</style>