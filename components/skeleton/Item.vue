<template>
  <div class="card h-full p-ripple">
    <div class="top">
      <Skeleton height="150px" width="100%" />
    </div>
    <div class="bottom flex flex-column gap-4 justify-content-between">
      <div class="flex flex-column gap-3">
        <Skeleton height="20px" width="100%" borderRadius="9px" />
        <Skeleton height="60px" width="100%" borderRadius="9px" />
      </div>
      <div class="flex justify-content-between align-items-center">
        <Skeleton height="28px" width="75px" borderRadius="20px" />
        <Skeleton height="28px" width="28px" borderRadius="20px" />
      </div>
    </div>
  </div>
</template>
