<script setup lang="ts"></script>

<template>
  <PopupPaper :show="show" @update:show="$emit('update:show', $event)" max-width="xs">
    <template #title>
      <var-button text disabled></var-button>
    </template>
    <var-result :type="resultType" :title="$t(title)">
      <template #footer>
        <template v-if="result">
          <var-link type="primary" :href="href" target="_blank" underline="none" text-size="16">
            <var-button :color="resultButtonColor" text-color="#fff">
              {{ $t('clickHere') }}
            </var-button>
          </var-link>
        </template>
      </template>
    </var-result>
  </PopupPaper>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    href: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      required: true
    },
    result: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title() {
      return this.result ? 'found' : 'notfound'
    },
    resultType() {
      return this.result ? 'success' : 'question'
    },
    resultButtonColor() {
      return this.result ? 'var(--result-success-color)' : 'var(--result-question-color)'
    }
  }
})
</script>
