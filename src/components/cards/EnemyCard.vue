<script setup lang="ts">
import DetailCard from '@/components/shared/DetailCard.vue'
import { getEnemyStateByKey } from '@/utils/codex'
import { isEmptyObject } from 'es-toolkit'

import colors from '@/styles/colors.module.scss'
import { getIcon } from '@/utils'
import type { EnemyData } from '@/types/extra'
import { mdiCheckDecagramOutline } from '@mdi/js'

const enemyState: ShallowRef<EnemyData | undefined> = shallowRef(undefined)

onBeforeRouteUpdate(async (to) => {
  enemyState.value = await getEnemyStateByKey(
    (to.params.category as string) + '/' + (to.params.id as string),
  )
})

const route = useRoute()
watch(
  () => route.path,
  async () => {
    enemyState.value = await getEnemyStateByKey(
      (route.params.category as string) + '/' + (route.params.id as string),
    )
  },
  { immediate: true, once: true },
)
</script>

<template>
  <DetailCard v-if="enemyState" :title="$t('enemy.stats')">
    <template v-slot:actions>
      <v-tooltip :text="$t('helper.tooltip.provider')">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" :icon="mdiCheckDecagramOutline" size="small" color="success" />
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default>
      <v-card-text v-if="isEmptyObject(enemyState)">
        {{ $t('helper.notFound') }}
      </v-card-text>
      <div class="pb-2" v-else>
        <template v-for="(state, key) in enemyState" :key="key">
          <v-list-item>
            <v-list-item-title>
              {{ $t('enemy.' + key) }}
            </v-list-item-title>
            <div class="d-flex flex-wrap ga-1 pt-1">
              <template v-if="key.startsWith('element')">
                <v-chip
                  v-for="s in state"
                  :text="$t('stats_text.' + s)"
                  :color="colors[s]"
                  size="small"
                  rounded="lg"
                  :key="s"
                />
              </template>

              <template v-else-if="key.startsWith('status')">
                <v-chip
                  v-for="s in state"
                  :text="$t('status.' + s)"
                  size="small"
                  rounded="lg"
                  :key="s"
                >
                  <template v-slot:prepend>
                    <v-avatar :rounded="false" class="mr-1">
                      <v-img :src="getIcon('status', s)" class="image-render-pixel" />
                    </v-avatar>
                  </template>
                </v-chip>
              </template>
            </div>
          </v-list-item>
          <v-divider class="mx-2" />
        </template>
      </div>
    </template>
  </DetailCard>
</template>
