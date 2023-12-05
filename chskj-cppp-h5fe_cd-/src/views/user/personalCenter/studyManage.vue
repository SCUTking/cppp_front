<template>
  <div class="study_manage">
    <div class="notice">
      <img
        src="@/assets/personalCenter/notice.png"
        alt="notice"
        class="notice_img"
      />
      <p class="text">欢迎加入华园科创AI智慧教学平台，祝您学习愉快～</p>
    </div>

    <div class="ability_courses">
      <div class="ability">
        <p class="title">总体能力</p>

        <div class="info_box">
          <div class="radar_box" ref="radarChartRef"></div>
          <div class="info">
            <p>{{ '基础知识 4.0' }}</p>
            <li>{{ '能力解析文本，建议或其他文案' }}</li>
            <p>{{ '题目理解能力 2.5' }}</p>
            <li>{{ '能力解析文本，建议或其他文案' }}</li>
            <p>{{ '编程能力 2.0' }}</p>
            <li>{{ '能力解析文本，建议或其他文案' }}</li>
            <p>{{ '算法能力 4.5' }}</p>
            <li>{{ '能力解析文本，建议或其他文案' }}</li>
            <p>{{ '数学能力 2.0' }}</p>
            <li>{{ '能力解析文本，建议或其他文案' }}</li>
          </div>
        </div>
      </div>

      <div class="courses">
        <p class="title">我的课程</p>

        <div class="info">
          <div>
            已购课程
            <span class="value">{{ courseChapter.已购课程 ?? 0 }}</span>
          </div>
          <div>
            已完成课程
            <span class="value">{{ courseChapter.已完成课程 ?? 0 }}</span>
          </div>
          <div>
            累计学时
            <span class="value">{{
              courseChapter?.累计学时
                ? Number(courseChapter?.累计学时).toFixed(3)
                : 0
            }}</span>
          </div>
        </div>

        <p class="title">刷题统计</p>

        <div class="statistic">
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

        <a-button class="more_btn" @click="$router.push({ name: 'database' })">
          <span>查看更多习题</span>
          <img
            src="@/assets/personalCenter/arrow_right.png"
            alt="arrow"
            class="icon"
          />
        </a-button>
      </div>
    </div>

    <div class="progress">
      <div class="card" v-for="item in courseList">
        <div class="content">
          <img
            class="cover"
            :src="item.currentChapter?.chapterCover"
            alt="cover"
          />

          <p class="title">{{ item.currentChapter?.courseName }}</p>
          <p class="tips">{{ item.currentChapter?.courseIntro }}</p>

          <div class="progress_data">
            <p class="current">当前进度：{{ item.currentSchedule }}</p>
          </div>
        </div>
        <div class="footer">
          <p class="study_progress">学习进度：{{ item.studySchedule }}</p>
          <a-button
            class="btn"
            @click="clickBtn(item)"
            :disabled="item.ifComplete"
            >{{ item.ifComplete ? '学情报告' : '继续学习' }}</a-button
          >
        </div>
      </div>
      <div class="card more_card">
        <div class="content">
          <p class="title">更多课程</p>
          <p class="tips">选择适合您的课程进行学习</p>
        </div>
        <div class="footer">
          <div></div>
          <a-button
            class="more_course_btn"
            @click="$router.push({ name: 'category' })"
          >
            <span>查看更多课程</span>
            <img
              src="@/assets/personalCenter/icon_right_w.png"
              alt="arrow"
              class="icon"
            />
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  render,
  h,
  onUnmounted,
} from 'vue';
import * as echarts from 'echarts';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '我的学习' },
  { label: '学习管理' },
]);

onMounted(() => {
  getMyCourseChapter();

  getDoneObjStatisticInfo();

  getAllCourseStudySchedule();

  initRadarChart([2.5, 4.0, 4.5, 2.0, 2.0]);

  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

// 我的课程
const courseChapter = ref({}),
  getMyCourseChapter = () => {
    const { stuId } = userStore.userInfo;
    proxy.$api.getMyCourseChapter({ stuId }).then((res) => {
      if (res && res.resultCode == 200) {
        courseChapter.value = res.data;
      }
    });
  },
  clickBtn = (item) => {
    const { ifComplete } = item;
    if (ifComplete) {
      // TODO
    } else {
      const { chapterId, courseId, ccId, unitId } = item.currentChapter;
      proxy.$router.push({
        name: 'learn',
        query: { chapterId, courseId, ccId, unitId },
      });
    }
  };

let radarChart, pieChart, innerWidth;
const resize = () => {
  radarChart?.resize();
  pieChart?.resize();
};

// 刷题统计
const doneObj = ref({}),
  getDoneObjStatisticInfo = () => {
    const { stuId } = userStore.userInfo;
    proxy.$api.getDoneObjStatisticInfo({ stuId }).then((res) => {
      if (res?.resultCode == 200) {
        doneObj.value = res.data;

        const data = [
          { value: doneObj.value?.统计百分比?.未提交数目, name: '未提交' },
          { value: doneObj.value?.统计百分比?.未通过数目, name: '未通过' },
          { value: doneObj.value?.统计百分比?.已通过数目, name: '已通过' },
        ];
        initPieChart(data);
      }
    });
  },
  pieChartRef = ref(null),
  initPieChart = (data) => {
    innerWidth = window.innerWidth;

    let chartDom = pieChartRef.value;
    pieChart = chartDom && echarts.init(chartDom);
    let option;
    let num = doneObj.value.已解锁题目,
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

// 总体能力
const radarChartRef = ref(null),
  initRadarChart = (data) => {
    let chartDom = radarChartRef.value;
    radarChart = chartDom && echarts.init(chartDom);
    let option;

    option = {
      radar: {
        indicator: [
          { name: '题目理解能力_0', max: 10 },
          { name: '基础知识_1', max: 10 },
          { name: '算法能力_2', max: 10 },
          { name: '数学能力_3', max: 10 },
          { name: '编程能力_4', max: 10 },
        ],
        axisLine: { lineStyle: { color: '#E7E7E7' } },
        splitLine: { lineStyle: { color: '#E7E7E7' } },
        axisName: {
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: 12,
          formatter: function (value, indicator) {
            const arr = value.split('_');
            const val = arr[0];
            const index = arr[1];
            return val + ' ' + data[index].toFixed(1);
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            { value: data, symbol: 'none', itemStyle: { color: '#2BA471' } },
          ],
          itemStyle: {
            normal: {
              lineStyle: { color: '#2BA471' },
              areaStyle: { color: '#E3F9E9' },
            },
          },
        },
      ],
    };

    chartDom && option && radarChart.setOption(option);
  };

const courseList = ref([]),
  getAllCourseStudySchedule = () => {
    const { stuId } = userStore.userInfo;
    proxy.$api.getAllCourseStudySchedule({ stuId }).then((res) => {
      if (res?.resultCode == 200) {
        courseList.value = res.data;
      }
    });
  };
</script>

<style lang="less" scoped>
.study_manage {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0;
  }

  .notice {
    width: 100%;
    height: 56px;
    background: #f9f6d0;
    border-radius: 8px;
    padding: 14px 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .notice_img {
      width: 28px;
      height: 28px;
    }

    .text {
      height: 28px;
      font-size: 16px;
      color: #be5a00;
      line-height: 28px;
      margin-left: 8px;
    }
  }

  .ability_courses {
    width: 100%;
    height: 444px;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;

    .title {
      width: 100%;
      height: 44px;
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      line-height: 44px;
    }

    .ability {
      width: 1108px;
      height: 100%;
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 28px 42px 32px;
      box-sizing: border-box;

      .info_box {
        width: 100%;
        height: 344px;
        display: flex;

        .radar_box {
          width: 583px;
          height: 100%;
        }

        .info {
          p {
            width: fit-content;
            min-height: 24px;
            font-size: 16px;
            font-weight: 600;
            color: #3d3d3d;
            line-height: 24px;

            &:not(:first-of-type) {
              margin-top: 24px;
            }
          }

          li {
            width: fit-content;
            min-height: 22px;
            font-size: 14px;
            color: #3d3d3d;
            line-height: 22px;
          }
        }
      }
    }

    .courses {
      width: 353px;
      height: 100%;
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 0 20px 16px;
      box-sizing: border-box;

      .info {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-wrap: wrap;
        padding-right: 24px;
        box-sizing: border-box;
        margin-top: 16px;

        div {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 24px;

          &:nth-of-type(2) {
            margin-left: 56px;
          }

          &:nth-of-type(3) {
            margin-top: 24px;
          }

          .value {
            font-size: 24px;
            font-weight: 600;
          }
        }
      }

      .title:nth-of-type(2) {
        margin-top: 24px;
      }

      .statistic {
        width: 100%;
        height: 128px;
        display: flex;
        margin-top: 8px;

        .pie_chart {
          width: 128px;
          height: 128px;
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

      .more_btn {
        width: fit-content;
        height: fit-content;
        font-size: 14px;
        color: #0052d9;
        line-height: 22px;
        border-radius: 3px;
        border: 1px solid #0052d9;
        padding: 5px 16px;
        box-sizing: border-box;
        margin-top: 24px;
        margin-right: 24px;
        float: right;
      }
    }
  }

  .progress {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;

    .card {
      width: 353px;
      height: 262px;
      background: rgba(255, 255, 255);
      border-radius: 16px;
      overflow: auto;

      .content {
        width: 100%;
        height: calc(100% - 64px);
        padding: 32px 25px 0 24px;
        box-sizing: border-box;
        position: relative;

        .cover {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .title {
          width: 100%;
          height: fit-content;
          font-size: 28px;
          font-weight: 600;
          line-height: 36px;
          position: relative;
          color: #ffffff;
        }

        .tips {
          width: 100%;
          height: fit-content;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 20px;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.9);
          position: relative;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .progress_data {
          width: 100%;
          height: 56px;
          background: rgba(0, 0, 0, 0.26);
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 18px 25px 18px 24px;
          box-sizing: border-box;

          .current {
            width: 100%;
            height: 20px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }

      .footer {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px 0 24px;
        box-sizing: border-box;

        .study_progress {
          height: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #008858;
          line-height: 20px;
        }

        .more_course_btn {
          width: fit-content;
          height: fit-content;
          background: #2ba471;
          border-radius: 16px 16px 16px 16px;
          opacity: 1;
          border: 1px solid #2ba471;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 22px;
          padding: 8px 16px;
          box-sizing: border-box;
        }

        .btn {
          width: fit-content;
          height: fit-content;
          background: #2ba471;
          border-radius: 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 22px;
          padding: 5px 16px;
          box-sizing: border-box;
        }
      }

      &.more_card {
        opacity: 0.55;
        border: 1px solid rgba(255, 255, 255, 0.9);

        .title {
          color: #2ba471;
        }

        .tips {
          color: #2ba471;
        }
      }

      &:not(:nth-of-type(4n)) {
        margin-right: 24px;
      }

      &:nth-of-type(n + 5) {
        margin-top: 24px;
      }
    }
  }
}

.icon {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}
</style>
