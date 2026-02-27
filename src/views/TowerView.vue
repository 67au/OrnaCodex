<script setup lang="ts">
import SettingDialog from '@/components/shared/SettingDialog.vue'
import { getCodexEntryByKey } from '@/utils/codex'
import { getTowerFloors, getTowerFloorsInNextDays } from '@/utils/tower'
import { mdiCalendarOutline, mdiClock, mdiInformationOutline, mdiRefresh } from '@mdi/js'

const now = ref(new Date())

const titans = computed(() => {
  const floors = getTowerFloors(now.value)
  return floors.map((v) => {
    return {
      entry: getCodexEntryByKey('bosses/titan-' + v.kind)!,
      progress: v.floor - 15,
      floor: v.floor,
    }
  })
})
const floorsInWeek = computed(() => getTowerFloorsInNextDays(now.value, 7))
</script>

<template>
  <v-container fluid class="pa-2 mx-auto" :max-width="900">
    <v-card class="mb-2 border-md border-secondary">
      <v-list-item class="pa-2" slim>
        <template v-slot:title>
          <v-list-item-title>
            {{ now.toLocaleString() }}
          </v-list-item-title>
        </template>
        <template v-slot:prepend>
          <v-icon :icon="mdiClock" />
        </template>
        <template v-slot:append>
          <v-btn
            variant="tonal"
            rounded="lg"
            :icon="mdiRefresh"
            color="secondary"
            size="small"
            @click="now = new Date()"
          />
        </template>
      </v-list-item>
    </v-card>
    <v-row gaps="8">
      <template v-for="(titan, index) in titans" :key="index">
        <v-col cols="12" sm="6">
          <SettingDialog :title="titan.entry.name">
            <template v-slot:actions>
              <v-btn :icon="mdiInformationOutline" :to="titan.entry.url"></v-btn>
            </template>

            <template v-slot:activator="{ props: activator }">
              <v-card v-bind="activator">
                <v-card-item>
                  <div
                    class="text-label-medium text-letter-spacing-2 text-medium-emphasis text-uppercase d-flex ga-2 align-center"
                  >
                    <v-icon :icon="mdiCalendarOutline"></v-icon>
                    <span>Tower</span>
                  </div>
                  <v-card-title class="text-title-large pt-2">
                    {{ titan.entry.name }}
                  </v-card-title>
                  <template v-slot:append>
                    <v-avatar size="64" :rounded="false">
                      <v-img :src="titan.entry.iconUrl" :class="titan.entry.iconClass"></v-img>
                    </v-avatar>
                  </template>
                </v-card-item>

                <v-divider></v-divider>
                <v-list-item density="compact" class="bg-surface-light">
                  <div class="w-100 d-flex ga-4 align-center">
                    <v-progress-linear
                      :color="titan.floor > 44 ? 'error' : 'secondary'"
                      max="35"
                      stream
                      :model-value="titan.progress"
                      rounded="pill"
                      height="8"
                    />
                    <span class="text-title-large">{{ titan.floor }}</span>
                  </div>
                </v-list-item>
              </v-card>
            </template>
            <template v-slot:default>
              <v-card-text class="pa-0">
                <v-table density="compact" fixed-header class="h-100 mx-auto">
                  <thead>
                    <tr class="elevation-1">
                      <th>{{ $t('tower.localTime') }}</th>
                      <th>{{ $t('tower.floors') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-surface-light">
                      <td>{{ now.toLocaleString() }}</td>
                      <td>{{ titan.floor }}</td>
                    </tr>
                    <template v-for="(towerDay, day) in floorsInWeek" :key="day">
                      <tr>
                        <td>{{ towerDay.time.toLocaleString() }}</td>
                        <td>{{ towerDay.floors[index]?.floor }}</td>
                      </tr>
                    </template>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </template>
          </SettingDialog>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
