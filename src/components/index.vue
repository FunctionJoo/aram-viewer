<template>
  <div>
    <!-- <div class="index-box">
      <div class="index-inner w-set">
        <form class="index-form">
          <input type="text" class="form-sch">
          <button class="form-submit">보내기</button>
        </form>
      </div>
    </div> -->
    <button @click="axiosTest">Axios Test</button>
    <div class="sample w-set">
      <div id="rune-box">
        <div id="rund-hand"></div>
        <div id="rund-data">
          <div class="rund-data-in active" data-key="0"></div>
          <div class="rund-data-in" data-key="1"></div>
          <div class="rund-data-in" data-key="2"></div>
          <div class="rund-data-in" data-key="3"></div>
          <div class="rund-data-in" data-key="4"></div>
          <div class="rund-data-in" data-key="5"></div>
        </div>
      </div>
      <div id="skill-box" class="clear">
      </div>
    </div>
  </div>
</template>

<script>
import * as cheerio from 'cheerio';

// https://www.op.gg/aram/ajax/statistics/skillList/championId=86&modeType=450&
// 스킬 URL

export default {
  data() {
    return {
      // 칼바람 기본 모드 별 의미 없음
      modeType: 450,
      // 챔피언 키값
      champKey: 37,
      champName: 'sona',
      champRuneArr: []
    }
  },
  methods: {
    axiosTest() {
      // const optionAxios = {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      //     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
      //   }
      // };

      //this.axios.defaults.baseURL = 'http://www.op.gg/';
      const that = this;
      that.axios({
        method: 'get',
        //url: '/aram/ajax/statistics/runeList/championId=79&modeType=450&primaryPerkId=8229&subPerkStyleId=8100&'
        url: `/aram/${this.champName}/statistics/450/rune`,
        //url: 'https://cors-anywhere.herokuapp.com/'+'http://www.op.gg/aram/ajax/statistics/runeList/championId=79&modeType=450&primaryPerkId=8229&subPerkStyleId=8100&', optionAxios
      }).then((response) => {
        let resdata = response.data;
        let $ = cheerio.load(resdata);
        $ = cheerio.load($.html('.l-champion-statistics-content__main'));

        document.querySelector('#rund-hand').innerHTML = $.html();

        let runeListHand = document.querySelectorAll('.champion-stats__filter__item.tabHeader');
        for(let idx = 0; idx < runeListHand.length - 1; idx++ ) {
          let runKey = runeListHand[idx].querySelector('.champion-stats-summary-rune__image--keystone').attributes.src.value.split('/')[6].substr(0,4);
          let subKey = runeListHand[idx].querySelector('.champion-stats-summary-rune__image--substyle').attributes.src.value.split('/')[6].substr(0,4);
          runeListHand[idx].setAttribute('handler', idx);
          runeListHand[idx].setAttribute('runkey', runKey);
          runeListHand[idx].setAttribute('subkey', subKey);
          runeListHand[idx].addEventListener("click", () => {that.runePageOpen(idx, runKey, subKey)});
          this.champRuneArr.push( {
            runeKey: runKey,
            SubRuneKey: subKey
          } );
        }
        runeListHand[5].addEventListener("click", () => {that.runePageOpen(5)});
        
        that.axios({
          method: 'get',
          url: `/aram/ajax/statistics/runeList/championId=${that.champKey}&modeType=${that.modeType}&primaryPerkId=${that.champRuneArr[0].runeKey}&subPerkStyleId=${that.champRuneArr[0].SubRuneKey}&`
        }).then((response) => {
          document.querySelector('.rund-data-in').innerHTML = response.data;
        });
      });
    },
    runePageOpen(idx, mainKey, SubKey) {
      let targetBox = document.querySelector(`.rund-data-in[data-key="${idx}"]`);
      let targetBtn;
      if (idx == 5) {
        targetBtn = document.querySelector(`.champion-stats__filter__item--all`);
      } else {
        targetBtn = document.querySelector(`.champion-stats__filter__item[handler="${idx}"]`);
      }
      if (targetBox.classList.contains('active')) {
        return;
      }
      let targetAll = document.querySelectorAll('.rund-data-in');
      let targetBtnAll = document.querySelectorAll('.champion-stats__filter__item');
      for (let idx = 0; idx < targetAll.length; idx++) {
        targetAll[idx].classList.remove('active');
        targetBtnAll[idx].classList.remove('active');
      }

      if (targetBox.innerHTML == '') {
        let targetUrl = '';
        if (mainKey == undefined) {
          targetUrl = `/aram/ajax/statistics/runeList/championId=${this.champKey}&modeType=${this.modeType}&`
        } else {
          targetUrl = `/aram/ajax/statistics/runeList/championId=${this.champKey}&modeType=${this.modeType}&primaryPerkId=${mainKey}&subPerkStyleId=${SubKey}&`
        }
        this.axios({
          method: 'get',
          url: targetUrl,
        }).then((response) => {
          targetBox.innerHTML = response.data;
          console.log(targetUrl);
        });
      }
      targetBox.classList.add('active');
      targetBtn.classList.add('active');
    }
  }
}
</script>

<style>
#app {
  background: var(--gery2);
}

.sample {
  font-size: 20px;
  font-weight: 700;
}

.index-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#rune-box {
  border: 1px solid var(--grey1);
  float: left;
  background:var(--gery3);
}
#rund-hand {
  float: left;
  width: 170px;
  position: relative;
  z-index: 1;
}
.champion-box-header {
  display: none;
}
.champion-stats__filter {
  text-align: left;
}
.champion-stats__filter__item {
  border-left: 3px solid var(--gery3);
  /* border-right: 1px solid var(--grey1); */
  border-bottom: 1px solid var(--grey1);
  padding: 10px 0 10px 20px;
  font-size: 12px;
  font-weight: 300;
  line-height: 120%;
}
.champion-stats__filter__item.active {
  border-left-color: var(--point);
  border-right-color: var(--white);
  background: var(--white);
}
.champion-stats__filter__item.champion-stats__filter__item--all {
  padding: 15px 0 15px 20px;
  font-size: 15px;
  line-height: 100%;
}
.champion-stats__filter__item__value b {
  font-weight: 500;
  padding-left: 5px;
}


#rund-data {
  float: left;
}
.rund-data-in {
  display: none;
  /* width:calc(100% + 1);
  margin-left: -1px; */
  border-left: 1px solid var(--grey1);
  background: var(--white);
}
.rund-data-in.active {
  display: block;
}

.tabHeader {
  cursor:pointer;
}

.champion-stats__table th {
  display: none;
}
.perk-page-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.perk-page,
.fragment__detail {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
}
.fragment__detail {
  padding-bottom: 4px;
}
.perk-page {
  width: 150px;
}
.perk-page__row,
.fragment__row {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.fragment__row {
  width: 96px;
}
.perk-page__row:first-of-type .perk-page__item {
  width: 100%;
}
.perk-page__item {
  padding: 4px 0;
}
.fragment {
  padding: 16px 0 0;
}
.perk-page__image {
  display: inline-block;
  border-radius: 100%;
  overflow: hidden;
  font-size: 0px;
}
.perk-page__item--active.perk-page__item--keystone .perk-page__image {
  background: #000;
}
.perk-page__item img {
  width: 32px;
}
/* .perk-page__item--mark img {
  width: 40px;
} */
.fragment img {
  width: 22px;
}
.page-divider {
  width: 1px;
  height: 200px;
  background: var(--grey1);
  margin: 0 8px;
}
.champion-stats__table--rune > tbody > tr {
  display: block;
  border-bottom: 1px solid var(--grey1);
  padding: 10px 20px;
}
.champion-stats__table__cell {
  vertical-align: middle;
  padding: 0 0 1px;
}
.champion-stats__table__cell--data {
  display: block;
}
.champion-stats__table__cell--pickrate,
.champion-stats__table__cell--winrate {
  position: relative;
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  text-decoration: none;
  padding: 0 0 0 0;
}
.champion-stats__table__cell--pickrate {
  padding: 0 30px 0 0;
}
.champion-stats__table__cell--pickrate:before,
.champion-stats__table__cell--winrate:before {
  content:'픽률';
  display: block;
  position: absolute;
  top: 0;
  right: 100%;
  text-align: right;
  width: 50px;
  padding: 0 5px 0 0;
}
.champion-stats__table__cell--winrate:before {
  content:'승률';
}
.champion-stats__table__cell--pickrate em {
  color: #aaa;
  font-style: normal;
}
.champion-stats__table__cell--pickrate em:before {
  content: '(';
}
.champion-stats__table__cell--pickrate em:after {
  content: ')';
}
</style>