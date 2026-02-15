<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { VNumberInput } from 'vuetify/components'

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
})

const jump = ref(props.page)
const input = useTemplateRef<InstanceType<typeof VNumberInput>>('input')

function resetJump() {
  jump.value = props.page
}

const emit = defineEmits(['update:page'])

function jumpPage() {
  if (jump.value < 1) {
    emit('update:page', 1)
    return
  }
  if (jump.value > props.pages) {
    emit('update:page', props.pages)
    return
  }
  emit('update:page', jump.value)
}
</script>

<template>
  <v-defaults-provider
    :defaults="{
      VBtn: {
        variant: 'tonal',
        rounded: 'lg',
        color: 'secondary',
      },
    }"
  >
    <v-sheet
      class="d-flex ga-1 justify-center align-center pa-1 border-secondary"
      width="fit-content"
      rounded="pill"
      border="md"
      elevation="2"
    >
      <v-btn
        :disabled="props.page === 1"
        rounded="pill"
        :prepend-icon="mdiChevronLeft"
        :text="$t('helper.page.pervious')"
        class="text-uppercase"
        @click="emit('update:page', props.page - 1)"
      />

      <v-menu :close-on-content-click="false" location="top center" :offset="[16, 0]">
        <template v-slot:activator="{ props: activator }">
          <v-btn
            v-bind="activator"
            variant="text"
            rounded="pill"
            color="default"
            @click="resetJump"
          >
            <span>{{ props.page }} / {{ props.pages }}</span>
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-sheet class="pa-2">
            <v-number-input
              variant="underlined"
              control-variant="hidden"
              v-model="jump"
              hide-details
              single-line
              ref="input"
              autofocus
              density="compact"
              @keydown.enter="
                () => {
                  jumpPage()
                  isActive.value = false
                }
              "
            >
              <template v-slot:append>
                <v-btn
                  variant="tonal"
                  :text="$t('helper.page.goto')"
                  @click="
                    () => {
                      jumpPage()
                      isActive.value = false
                    }
                  "
                ></v-btn>
              </template>
            </v-number-input>
          </v-sheet>
        </template>
      </v-menu>

      <v-btn
        :disabled="props.page === props.pages"
        :append-icon="mdiChevronRight"
        rounded="pill"
        :text="$t('helper.page.next')"
        class="text-uppercase"
        @click="emit('update:page', props.page + 1)"
      />
    </v-sheet>
  </v-defaults-provider>
</template>
