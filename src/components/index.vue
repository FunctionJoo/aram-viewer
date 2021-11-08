<template>
  <div class="index-box">
    <div class="index-inner w-set">
      <form class="index-form">
        <input type="text" class="form-sch">
        <button class="form-submit">보내기</button>
      </form>
    </div>
  </div>
  <div class="sample">
    <button @click="axiosTest">Axios Test</button>
    <div id="rune-box" class="clear">
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
  </div>
</template>

<script>
import * as cheerio from 'cheerio';

// https://www.op.gg/aram/ajax/statistics/skillList/championId=86&modeType=450&
// 스킬 URL 찾음 ㅋㅋㅋ

export default {
  data() {
    return {
      // 칼바람 기본 모드 별 의미 없음
      modeType: 450,
      // 챔피언 키값
      champKey: 86,
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
      let that = this;
      that.axios({
        method: 'get',
        //url: '/aram/ajax/statistics/runeList/championId=79&modeType=450&primaryPerkId=8229&subPerkStyleId=8100&'
        url: '/aram/garen/statistics/450/rune',
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
      if (targetBox.classList.contains('active')) {
        return;
      }
      let targetAll = document.querySelectorAll('.rund-data-in');
      for (let idx = 0; idx < targetAll.length; idx++) {
        targetAll[idx].classList.remove('active');
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
    }
  }
}
</script>

<style>
.sample {
  font-size: 20px;
  font-weight: 700;
}

.index-box {
  width: 100%;
  height: 100%;
  background: #ccc;
  box-sizing: border-box;
}

#rune-box {
  background: #fff;
}
#rund-hand {
  float: left;
  width: 20%;
}
#rund-data {
  float: right;
  width: 75%;
}
.rund-data-in {
  display: none;
}
.rund-data-in.active {
  display: block;
}

.perk-page,
.fragment__detail {
  display: table;
  width: 100%;
}
.perk-page__row,
.fragment__row {
  display: table-row;
}
.perk-page__item,
.fragment {
  display: table-cell;
}
.perk-page__item img {
  width: 50px;
}
.perk-page__item--keystone img {
  width: 50px;
}
.fragment img {
  width: 30px;
}
</style>