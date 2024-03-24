<script setup lang="ts">
import { useGuideState } from '@/store';
import { defineComponent } from 'vue';
</script>

<template>
  <var-popup :default-style="false" v-model:show="show" @update:show="$emit('update:show', $event)">
    <var-result class="popup-guide result" :type="resultType" :title="$t(title)">
      <template #description>
        <template v-if="isSuccess">
          <br>
          <var-link type="primary" :href="href" target="_blank" text-size="16">
            {{ $t('clickHere') }}
          </var-link>
        </template>
      </template>
      <template #footer>
        <var-button :color="resultButtonColor" text-color="#fff" @click="$emit('update:show', false)">
          {{ $t('close') }}
        </var-button>
      </template>
    </var-result>
  </var-popup>
</template>

<script lang="ts">
const guideState = useGuideState();

export default defineComponent({
  props: {
    href: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      required: true,
    },
    failed: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isSuccess() {
      return (guideState.cache !== undefined) && !this.failed;
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

<style lang="less">
.popup-guide {
  padding: 24px;
  max-width: 375px;
  border-radius: 28px;
}

.result {
  width: 75vw !important;
}
</style>