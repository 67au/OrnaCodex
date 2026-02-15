<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import SettingDialog from './SettingDialog.vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { getOptionValueName, getIcon } from '@/utils'
import { isUndefined } from 'es-toolkit'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

const debuffSkills = computed(() => props.entry.debuffSkills)
const buffSkills = computed(() => props.entry.buffSkills)

const defaults: DefaultsOptions = {
  VChip: {
    size: 'small',
    rounded: 'lg',
    color: 'white',
    variant: 'outlined',
  },
  VListItem: {
    class: 'pa-2',
  },
}
</script>

<template>
  <SettingDialog :title="$t('enemy.viewBuff')">
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :props="activator"></slot>
    </template>

    <v-container class="pa-2 pb-8 mx-auto overflow-y-auto" max-width="900">
      <div class="d-flex flex-column ga-2">
        <v-card variant="flat" class="border-md">
          <v-list-item density="compact" slim class="px-2">
            <v-list-item-title>
              <span>
                {{ props.entry.name }}
              </span>
            </v-list-item-title>
            <template v-slot:prepend>
              <v-avatar size="36" :rounded="false" class="mr-1">
                <v-img :src="props.entry.iconUrl" :class="props.entry.iconClass" />
              </v-avatar>
            </template>

            <div class="d-flex flex-wrap ga-1 py-1">
              <v-chip
                size="x-small"
                rounded="sm"
                variant="tonal"
                color="amber-darken-2"
                :text="props.entry.tierName"
              />
              <v-chip
                v-if="props.entry.category"
                size="x-small"
                rounded="sm"
                variant="tonal"
                color="amber-darken-2"
                :text="getOptionValueName('category', props.entry.category)"
              />
            </div>
          </v-list-item>
        </v-card>
        <v-defaults-provider :defaults="defaults">
          <v-card v-if="debuffSkills" variant="flat" border="md" :title="$t('meta.causes')">
            <v-card-text v-if="debuffSkills.size === 0">
              {{ $t('helper.notFound') }}
            </v-card-text>
            <div v-else class="d-flex flex-column ga-1 pa-2">
              <template v-for="[debuff, skills] in Array.from(debuffSkills)" :key="debuff">
                <v-card variant="tonal">
                  <v-list-item density="compact" slim>
                    <template v-slot:title>
                      {{ $t('status.' + debuff) }}
                    </template>
                    <template v-slot:prepend>
                      <v-avatar size="24" :rounded="false" class="mr-1">
                        <v-img :src="getIcon('status', debuff)" class="image-render-pixel" />
                      </v-avatar>
                    </template>
                  </v-list-item>
                  <div class="d-flex flex-wrap ga-1 px-2 pb-2">
                    <v-chip v-for="skill in skills" :text="skill.entry.name" :key="skill.entry.key">
                      <template v-slot:prepend>
                        <v-avatar :rounded="false" class="mr-1">
                          <v-img :src="skill.entry.iconUrl" class="image-render-pixel" />
                        </v-avatar>
                      </template>
                      <template v-slot:append v-if="skill.chance">
                        <span class="ml-1">
                          {{ `(${skill.chance}%)` }}
                        </span>
                      </template>
                    </v-chip>
                  </div>
                </v-card>
              </template>
            </div>
          </v-card>

          <v-card
            v-if="entry.category === 'followers' && !isUndefined(buffSkills)"
            variant="flat"
            border="md"
            :title="$t('meta.gives')"
          >
            <v-card-text v-if="buffSkills.size === 0">
              {{ $t('helper.notFound') }}
            </v-card-text>
            <div v-else class="d-flex flex-column ga-1 pa-2">
              <template v-for="[buff, skills] in Array.from(buffSkills)" :key="buff">
                <v-card variant="tonal">
                  <v-list-item density="compact" slim :title="$t('status.' + buff)">
                    <template v-slot:prepend>
                      <v-avatar size="24" :rounded="false" class="mr-1">
                        <v-img :src="getIcon('status', buff)" class="image-render-pixel" />
                      </v-avatar>
                    </template>
                  </v-list-item>
                  <div class="d-flex flex-wrap ga-1 px-2 pb-2">
                    <v-chip v-for="skill in skills" :text="skill.entry.name" :key="skill.entry.key">
                      <template v-slot:prepend>
                        <v-avatar :rounded="false" class="mr-1">
                          <v-img :src="skill.entry.iconUrl" class="image-render-pixel" />
                        </v-avatar>
                      </template>
                      <template v-slot:append v-if="skill.chance">
                        <span class="ml-1">
                          {{ `(${skill.chance}%)` }}
                        </span>
                      </template>
                    </v-chip>
                  </div>
                </v-card>
              </template>
            </div>
          </v-card>
        </v-defaults-provider>
      </div>
    </v-container>
  </SettingDialog>
</template>
