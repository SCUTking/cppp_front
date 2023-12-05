<template>
  <div class="homework_summary_box">
    <div class="title_level1">
      <img src="@/assets/course/in_data.png" class="title_icon" />
      <p class="title_text">作业总结</p>
    </div>
    <div class="summray_content">
      <p class="title_level2">一、总结概况</p>
      <div class="summary_box">
        <div class="echarts_box" ref="pieChartRef"></div>
        <div class="message_box">
          <div class="message_box1" v-if="isLoad">
            <div class="item">
              <p class="text1">作答总耗时</p>
              <p class="text2">
                <span class="text_height">{{ homeworkData?.myTestTime }}</span
                >分钟
              </p>
            </div>
            <div class="item">
              <p class="text1">整体正确率</p>
              <p class="text2" style="color: #2ba471">
                <span class="text_height">
                  {{ homeworkData?.myAnalyseInfo?.globalAccuracy }}</span
                >%
                <!-- <span class="text_height">72</span>.85% -->
              </p>
            </div>
          </div>
          <div class="message_box2" v-if="isLoad">
            <div class="item">
              <span class="text2">答对题数</span>
              <span class="text3" style="color: #366ef4">{{
                homeworkData?.myAnalyseInfo?.correctNum
              }}</span>
            </div>
            <div class="item">
              <span class="text2">答错题数</span>
              <span class="text3" style="color: #d54941">{{
                homeworkData?.myAnalyseInfo?.errorNum
              }}</span>
            </div>
            <div class="item">
              <span class="text2">未答题数</span>
              <span class="text3" style="color: #e37318">{{
                homeworkData?.myAnalyseInfo?.notDoneNum
              }}</span>
            </div>
          </div>
          <p class="text4">恭喜您已完成本次课堂作业，距离通过考试更近一步了</p>
        </div>
      </div>
      <p class="title_level2">二、总结概况</p>
      <div class="question_type">
        <p class="text4">以下为错题统计，Scratch编程题请查看参考答案自行判断</p>
        <div class="type_items" v-if="isLoad">
          <div class="item">
            <p class="text2">
              <span class="text_height">{{
                homeworkData?.myAnalyseInfo?.singleChoice
              }}</span>
            </p>
            <p class="text1">单选题</p>
          </div>
          <div class="item">
            <p class="text2">
              <span class="text_height">{{
                homeworkData?.myAnalyseInfo?.multiChoice
              }}</span>
            </p>
            <p class="text1">多选题</p>
          </div>
          <div class="item">
            <p class="text2">
              <span class="text_height">{{
                homeworkData?.myAnalyseInfo?.judge
              }}</span>
            </p>
            <p class="text1">判断题</p>
          </div>
          <div class="item">
            <p class="text2">
              <span class="text_height">{{
                homeworkData?.myAnalyseInfo?.programRead
              }}</span>
            </p>
            <p class="text1">程序阅读题</p>
          </div>
          <div class="item">
            <p class="text2">
              <span class="text_height">{{
                homeworkData?.myAnalyseInfo?.program
              }}</span>
            </p>
            <p class="text1">编程题</p>
          </div>
        </div>
      </div>
      <p class="title_level2">三、知识点掌握情况</p>
      <p class="text4">以下为需加强的知识点</p>
      <Tags class="tags" :tags="tags" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useUserStore } from '@/store';
import { get, set } from '@vueuse/core';
import { Tags } from '@/components';
import * as echarts from 'echarts';
const { proxy } = getCurrentInstance(),
  userStore = useUserStore();
const props = defineProps({ paperId: Number, tags: Array });

const pieChartRef = ref(null);
let pieChart;
const initPieChart = (data) => {
  let chartDom = get(pieChartRef);
  pieChart = chartDom && echarts.init(chartDom);
  let option;
  option = {
    title: [
      {
        left: 'center',
        top: '32%',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: 9,
          fontWeight: 'bold',
        },
      },
      {
        // text: '\n{num|' + num + '}', // 使用富文本标记，将数字部分用 {num} 标记
        left: 'center',
        top: '25%',
        textStyle: {
          rich: {
            num: {
              color: '#366EF4',
              fontSize: 18,
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
const data = [];
const homeworkData = ref({});
const isLoad = ref(false);

onMounted(() => {
  getExamResult();
});

const getExamResult = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId: props.paperId || proxy.$route.query.paperId,
  };
  const res = await proxy.$api.getExamResult(params);
  res.data.myAnalyseInfo = JSON.parse(res.data.analyseInfo);
  res.data.myTestTime = Math.ceil(
    (new Date(res.data.examEndTime).getTime() -
      new Date(res.data.examBeginTime)) /
      1000 /
      60
  );
  set(isLoad, true);
  set(homeworkData, res.data);
  initPieChart([
    { value: res.data.myAnalyseInfo.notDoneNum, name: '未提交' },
    { value: res.data.myAnalyseInfo.errorNum, name: '未通过' },
    { value: res.data.myAnalyseInfo.correctNum, name: '已通过' },
  ]);
};
</script>

<style lang="less" scoped>
.homework_summary_box {
  padding: 8px 48px;
  .title_level1 {
    padding: 8px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dcdcdc;
    .title_icon {
      margin-right: 8px;
      width: 28px;
    }
    .title_text {
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
    }
  }
  .summray_content {
    .title_level2 {
      margin: 24px 0 8px 0;
      padding: 9px 0;
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
    }
    .text1 {
      margin-bottom: 8px;
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      line-height: 28px;
    }
    .text2 {
      font-size: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      line-height: 56px;
    }
    .text3 {
      margin-left: 8px;
      font-size: 36px;
      font-weight: 600;
      line-height: 0;
    }
    .text4 {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 24px;
    }

    .text_height {
      font-size: 48px;
      line-height: 0;
    }
  }
  .summary_box {
    display: flex;
    .echarts_box {
      margin-right: 40px;
      width: 199px;
      height: 200px;
      opacity: 1;
    }
    .message_box {
      flex: 1;
      .message_box1 {
        display: flex;
        margin-bottom: 24px;
        .item {
          margin-right: 80px;
        }
      }
      .message_box2 {
        display: flex;
        margin-bottom: 16px;
        .item {
          margin-right: 65px;
          &:nth-last-of-type(1) {
            margin-right: 0;
          }
        }
        .text2 {
          line-height: 44px;
        }
      }
    }
  }
  .question_type {
    .text4 {
      margin-bottom: 16px;
    }
    .type_items {
      display: flex;
      margin-top: 16px;
      .item {
        margin-right: 72px;
        margin-right: 65px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
    }
  }
  .tags {
    margin-top: 16px;
    // padding-bottom: 300px;
  }
}
</style>
