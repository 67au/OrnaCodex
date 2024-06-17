<template>
  <div id="main" class="w-full min-h-screen mx-auto my-0 py-16 px-2 hack-card">
    <slot></slot>
  </div>
</template>

<style lang="less">
/* Hack Card */
.hack-card > .var-card,
.hack-card > .hack-warp {
  break-inside: avoid;
  margin: 0 auto 4px;
  min-width: var(--card-min-width);
  max-width: var(--card-max-width);
}

@media screen and (min-width: 768px) {
  .hack-card {
    columns: 45vw 2;
    column-fill: balance;
    column-gap: 8px;
  }
}

@media screen and (min-width: 768px) {
  .hack-card {
    columns: 0 2;
    column-fill: balance;
    column-gap: 8px;
    max-width: 768px;
  }
}
</style>
