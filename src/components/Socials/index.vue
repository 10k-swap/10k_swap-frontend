<template>
  <div class="l0k-swap-socials">
    <a class="l0k-swap-social" v-for="(item, i) in socials" :key="i" :href="item.link" target="_blank">
      <img :src="item.icon" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DiscordIcon from './discord.png'
import GithubIcon from './github.png'
// import DocIcon from './doc.png'
// import MediumIcon from './medium.png'
import MirrorIcon from './mirror.png'
import TwitterIcon from './twitter.png'

const socials = [
  { link: 'https://twitter.com/10KX_Global', icon: TwitterIcon },
  { link: 'https://github.com/10k-swap', icon: GithubIcon },
  { link: 'https://mirror.xyz/0xbf5808047D1e968D6A68580C3f61262A95eCb7Ae', icon: MirrorIcon },
  { link: 'https://discord.gg/T77yphUPB6', icon: DiscordIcon },
  // { link: '#', icon: DocIcon },
]

export default defineComponent({
  setup() {
    return {
      socials,
    }
  },
})
</script>

<style lang="scss">
.l0k-swap-socials {
  display: flex;
  align-items: center;
  .l0k-swap-social {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
