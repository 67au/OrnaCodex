<script setup lang="ts">
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-result class="popup-guide result" :type="resultType" :title="$t(title)">
      <template #description>
        <template v-if="result">
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
    result: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    title() {
      return this.result ? 'found' : 'notfound';
    },
    resultType() {
      return this.result ? 'success' : 'question';
    },
    resultButtonColor() {
      return this.result ? 'var(--result-success-color)' : 'var(--result-question-color)';
    },

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