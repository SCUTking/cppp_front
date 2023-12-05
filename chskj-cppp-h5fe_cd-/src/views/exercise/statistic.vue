<template>
  <div class="statistic_box">
    <p class="title">刷题统计</p>
    <div class="content" v-if="isLogin && statisticData?.统计百分比">
      <div class="pie_chart" ref="pieChartRef">
        <p class="lock_title">已解锁题集数</p>
      </div>
      <div class="data">
        <div class="row">
          已通过
          <p class="value pass">
            {{ doneObj?.统计百分比?.已通过数目 ?? 0 }}
          </p>
          &nbsp;占比
          <p class="value pass">
            {{ doneObj?.统计百分比?.已通过百分比 ?? 0 }}
          </p>
        </div>
        <div class="row">
          未通过
          <p class="value fail">
            {{ doneObj?.统计百分比?.未通过数目 ?? 0 }}
          </p>
          &nbsp;占比
          <p class="value fail">
            {{ doneObj?.统计百分比?.未通过百分比 ?? 0 }}
          </p>
        </div>
        <div class="row">
          未提交
          <p class="value not_submit">
            {{ doneObj?.统计百分比?.未提交数目 ?? 0 }}
          </p>
          &nbsp;占比
          <p class="value not_submit">
            {{ doneObj?.统计百分比?.未提交百分比 ?? 0 }}
          </p>
        </div>
      </div>
    </div>
    <div class="content2" v-else>
      <img src="@/assets/practice/empty.png" class="img" />
      <p class="text1">请登录已有账号</p>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  onMounted,
  computed,
  onUnmounted,
  nextTick,
} from 'vue';
import { get, set } from '@vueuse/core';
import { useUserStore } from '@/store';
import * as echarts from 'echarts';

const props = defineProps({
  statisticData: { type: Object },
});

const isLogin = computed(() => {
  return userStore?.userInfo?.stuId;
});
const { proxy } = getCurrentInstance(),
  userStore = useUserStore();
// 刷题统计
let pieChart;
const doneObj = ref({}),
  pieChartRef = ref(null);
onMounted(() => {
  if (get(isLogin)) {
    set(doneObj, props.statisticData);
    const data = [
      { value: get(doneObj)?.统计百分比?.未提交数目, name: '未提交' },
      { value: get(doneObj)?.统计百分比?.未通过数目, name: '未通过' },
      { value: get(doneObj)?.统计百分比?.已通过数目, name: '已通过' },
    ];
    initPieChart(data);
    window.addEventListener('resize', resize);
  }
});
onUnmounted(() => {
  if (get(isLogin)) {
    window.removeEventListener('resize', resize);
  }
});

const resize = () => {
  pieChart.resize();
};
const initPieChart = (data) => {
  innerWidth = window.innerWidth;
  let chartDom = get(pieChartRef);
  pieChart = chartDom && echarts.init(chartDom);
  let option;
  let num = get(doneObj).已解锁题目,
    title = '已解锁题目';

  option = {
    title: [
      {
        text: title,
        left: 'center',
        top: innerWidth > 1600 ? '31%' : '32%',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: innerWidth > 1600 ? 12 : 9,
          fontWeight: 'bold',
        },
      },
      {
        text: '\n{num|' + num + '}', // 使用富文本标记，将数字部分用 {num} 标记
        left: 'center',
        top: innerWidth > 1600 ? '32%' : '25%',
        textStyle: {
          rich: {
            num: {
              color: '#366EF4',
              fontSize: innerWidth > 1600 ? 24 : 18,
              fontWeight: 'bold',
            },
          },
        },
      },
    ],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        width: '130%',
        height: '130%',
        left: '-15%',
        top: '-15%',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { disabled: true },
        labelLine: { show: false },
        data,
        color: ['#FA9550', '#F6685D', '#56C08D'],
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
      },
    ],
  };

  chartDom && option && pieChart.setOption(option);
};
</script>
<style lang="less" scoped>
.statistic_box {
  padding: 16px;
  margin-bottom: 20px;
  width: 332px;
  background: #ffffff;
  border-radius: 8px;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
    margin-bottom: 16px;
  }
  .pie_chart {
    width: 128px;
    height: 128px;
  }

  .content {
    display: flex;
  }
  .content2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 128px;
    }
    .text1 {
      margin-top: 8px;
      font-size: 14px;
      color: #3d3d3d;
      line-height: 22px;
    }
  }
  .data {
    flex: 1;
    padding-top: 16px;

    .row {
      display: flex;
      height: 24px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;

      &:not(:first-of-type) {
        margin-top: 16px;
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        // margin-left: 5px;
        // margin-right: 5px;

        &.pass {
          color: #2ba471;
        }

        &.fail {
          color: #d54941;
        }

        &.not_submit {
          color: #e37318;
        }
      }
    }
  }
}
</style>
