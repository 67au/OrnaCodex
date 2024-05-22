<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import { getStaticUrl } from '@/plugins/utils';
import { global } from '@/plugins/global';

</script>

<template>
  <template v-if="ce.meta[name] !== undefined || ce.lang[name] !== undefined">
    <var-card class="card" :title="$t(name)">
      <template #description>
        <div class="card-description">
          <template v-if="text">
            <TextLists v-if="ce.meta[name] !== undefined" :entries="ce.meta[name]" />
            <TextLists v-else :entries="ce.lang[name]" />
          </template>
          <template v-else-if="chance">
            <ChanceLists :entries="ce.meta[name]" :summons="name === 'summons'" />
          </template>
          <template v-else>
            <template v-for="entry in entries">
              <!-- check exist -->
              <template v-if="entry.meta !== undefined">
                <ListEntry :entry="entry" :key="entry.id" />
              </template>
              <template v-else-if="entry.miss !== undefined">
                <var-cell class="text-cell" border :key="entry.id">
                  <template #icon>
                    <var-icon class="append-icon" :size="36" :name="getStaticUrl(entry.miss.icon)" />
                  </template>
                  <var-link type="primary" :href="`${global.ornaUrl}${entry.url}`" target="_blank">
                    {{ entry.miss.name }}
                  </var-link>
                  <br>
                  <var-chip type="danger" size="mini" :round="false" plain>
                    <template #left>
                      <div class="i-mdi-alert-circle-outline text-sm"></div>
                    </template>
                    {{ $t('notfound') }}
                  </var-chip>
                </var-cell>
              </template>
            </template>
          </template>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  props: {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: Boolean,
      default: false
    },
    chance: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    entries(): Array<CodexEntry> {
      return this.ce.meta[this.name]?.map((entry: [string, string]) => new CodexEntry(entry[0], entry[1]))
    }
  }
})
</script>
