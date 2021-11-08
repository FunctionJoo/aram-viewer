<template>
  <header>
    <div class="w-set clear">
      <a href="#" class="logo">ARAM VIEWER</a>
      <div class="head-search">
        <form class="hs-form">
          <input type="text" class="form-sch">
          <button class="form-submit">보내기</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
header {
  background: #333;
  text-align: left;
  padding: 20px 0;
  top: 0;
  left: 0;
  width: 100%;
}
.logo {
  display: inline-block;
  color: #fff;
  font-weight: 700;
  font-size: 40px;
  letter-spacing: -0.03em;
}
</style>