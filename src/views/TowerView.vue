<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import TowerTable from '@/components/TowerTable.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { CodexEntryFactory } from '@/plugins/codex'
import { getTowerFloors, getTowerFloorsInNextDays } from '@/plugins/tower'
import { mdiCalendarOutline, mdiInformationOutline } from '@mdi/js'

const now = new Date()
const floors = getTowerFloors(now)
const titans = floors.map((v) => {
  return {
    entry: CodexEntryFactory.getEntry('bosses', 'titan-' + v.kind),
    progress: v.floor - 15,
    floor: v.floor,
  }
})
const floorsInWeek = getTowerFloorsInNextDays(now, 7)
</script>

<template>
  <DefaultLayout :title="$t('tools.tower')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <v-container fluid class="px-4 mx-auto" :max-width="1050">
      <v-row dense>
        <template v-for="(titan, index) in titans" :key="titan.id">
          <v-col cols="12" sm="6" lg="4">
            <v-card>
              <TowerTable :name="titan.entry.name">
                <template v-slot:actions>
                  <v-btn :icon="mdiInformationOutline" variant="text" :to="titan.entry.url"></v-btn>
                </template>
                <template v-slot:activator="{ activator }">
                  <v-card-item v-bind="activator">
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <div>
                        <div class="text-overline d-flex ga-2 align-center">
                          <v-icon :icon="mdiCalendarOutline"></v-icon>
                          {{ 'Tower' }}
                        </div>
                        <v-card-title class="text-h6">
                          {{ titan.entry.name }}
                        </v-card-title>
                      </div>

                      <v-avatar size="60" :rounded="false">
                        <v-img :src="titan.entry.iconUrl" :class="titan.entry.iconClass"></v-img>
                      </v-avatar>
                    </div>
                  </v-card-item>
                </template>

                <v-card-text class="pa-2">
                  <v-table density="compact" class="h-100">
                    <thead>
                      <tr>
                        <th>{{ $t('tower.localTime') }}</th>
                        <th>{{ $t('tower.floors') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-surface-light">
                        <th>{{ now.toLocaleString() }}</th>
                        <th>{{ floors[index]!.floor }}</th>
                      </tr>
                      <template v-for="(towerDay, day) in floorsInWeek" :key="day">
                        <tr>
                          <th>{{ towerDay.time.toLocaleString() }}</th>
                          <th>{{ towerDay.floors[index]!.floor }}</th>
                        </tr>
                      </template>
                    </tbody>
                  </v-table>
                </v-card-text>
              </TowerTable>

              <v-divider></v-divider>
              <v-list-item density="compact" class="bg-surface-light">
                <div class="d-flex ga-2 align-center w-100">
                  <v-progress-linear
                    :color="titan.floor > 44 ? 'error' : 'secondary'"
                    max="35"
                    stream
                    :model-value="titan.progress"
                    rounded="pill"
                    height="8"
                  ></v-progress-linear>
                  <span class="text-h6 pl-2">{{ titan.floor }}</span>
                </div>
              </v-list-item>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>
