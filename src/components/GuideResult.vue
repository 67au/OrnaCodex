<script setup>
import { store } from '@/store';
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
      <var-button :color="resultButtonColor" text-color="#fff" @click="click">
        {{ $t('close') }}
      </var-button>
    </template>
  </var-result>
</template>

<script>
export default {
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
}
</script>

<style>
.result {
  width: 75vw !important;
}
</style>