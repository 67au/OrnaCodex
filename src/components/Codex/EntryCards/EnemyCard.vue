<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import type { Enemy } from '@/types/extra'
import { isNull, isUndefined } from 'es-toolkit'
import { size } from 'es-toolkit/compat'
import colors from '@/styles/colors.module.scss'
import { getIcon, getOptionValueName } from '@/plugins'

const entry: ComputedRef<CodexEntry> = inject('entry')!
const enemy = computed(() => entry.value.enemyStats)
</script>

<template>
  <v-card v-if="!isNull(enemy) && !isUndefined(enemy)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ 'YACO Extra' }}
        </v-list-item-title>
      </template>
    </v-list-item>
    <template v-if="size(enemy) === 0">
      <v-list-item density="compact">
        <template v-slot:title>
          <v-list-item-title>
            {{ $t('help.notFound') }}
          </v-list-item-title>
        </template>
      </v-list-item>
    </template>
    <template v-else>
      <template v-for="(value, key) in enemy as Enemy" :key="key">
        <v-divider class="mx-4"></v-divider>
        <v-list-item density="compact">
          <template v-slot:title>
            <v-list-item-title>
              {{ $t('enemy.stats.' + key) }}
            </v-list-item-title>
          </template>
          <template v-slot:subtitle>
            <template v-if="key.startsWith('element')">
              <div class="d-flex ga-1 py-1">
                <template v-for="k in value" :key="key + k">
                  <v-chip
                    rounded="lg"
                    size="small"
                    :color="colors[k]"
                    :value="k"
                    variant="outlined"
                  >
                    {{ getOptionValueName('element', k) }}
                  </v-chip>
                </template>
              </div>
            </template>
            <template v-if="key.startsWith('status')">
              <div class="d-flex flex-wrap ga-1 pt-1">
                <template v-for="k in value" :key="k">
                  <v-chip rounded="lg" size="small" color="default" :value="k">
                    <template v-slot:prepend>
                      <v-avatar :rounded="false" class="mr-1">
                        <v-img :src="getIcon('status', k)" class="image-render-pixel"></v-img>
                      </v-avatar>
                    </template>
                    {{ getOptionValueName('status', k) }}
                  </v-chip>
                </template>
              </div>
            </template>
          </template>
        </v-list-item>
      </template>
    </template>
  </v-card>
</template>
