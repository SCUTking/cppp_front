<template>
  <div class="result">
    <div class="card">
      <div class="to_pay" v-if="type == 0">
        <p class="title">Scratch课程初级</p>
        <div class="course_price">
          <p class="label">实付金额</p>
          <p class="unit">￥</p>
          <p class="value">{{ course.sellingPrice ?? 0 }}</p>
        </div>
        <p class="tips">* 请在30分钟内完成支付，否则可能导致购买失败</p>
        <img src="@/assets/course/Alipay.png" alt="code" />
        <p class="scan_tips">请使用微信扫描 二维码以完成支付</p>
      </div>

      <div class="fail_pay" v-else-if="[1, 2].includes(type)">
        <img
          :src="
            require(`@/assets/course/${type == 1 ? 'error' : 'success'}.png`)
          "
          alt="icon"
          class="error_img"
        />
        <p class="title">
          {{ type == 1 ? '支付失败，请重新支付' : '支付成功' }}
        </p>
        <p class="tips">
          {{ type == 1 ? '您将购买以下课程' : '您已购买以下课程' }}
        </p>
        <p class="course">Scratch课程初级</p>

        <div class="btn_group">
          <a-button class="repay" ghost v-if="type == 1">重新支付</a-button>
          <a-button class="study" v-else>立即学习</a-button>
          <a-button :class="type == 1 ? 'error_check' : 'success_check'" ghost
            >查看订单</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const course = ref({
  courseId: 16,
  ccId: 8,
  courseCover: 'http://cdn.codedancing.cn/cover/96bdf202308081714171366.png',
  courseName: 'Scratch高级',
  courseIntro:
    '初级篇是这个课类的入门篇，通过让同学们编写有趣的故事和小游戏来熟悉Scratch编程平台。',
  courseDescribe:
    '<p><img src="http://cdn.codedancing.cn/cover/61000202308101604134594.png" alt="" data-href="" style=""/></p><p><img src="http://cdn.codedancing.cn/cover/b6109202308101604173111.png" alt="" data-href="" style=""/></p><p><img src="http://cdn.codedancing.cn/cover/ae851202308101604222562.png" alt="" data-href="" style=""/></p>',
  originalPrice: 368,
  sellingPrice: 299.2,
  sales: 0,
  createTime: '2023-08-08T17:14:48',
  updateTime: '2023-08-10T16:04:23',
  isUserBuy: false,
  learnProgress: '0%',
  courseClassName: 'Scratch',
  unitInfoVoList: [
    {
      unitId: 32,
      courseId: 16,
      unitName: '第一单元',
      createTime: '2023-08-14T15:22:24',
      updateTime: '2023-08-14T16:00:21',
      unitType: 0,
      courseChapterVoList: [
        {
          chapterId: 14,
          chapterCover:
            'http://cdn.codedancing.cn/cover/97d61202308141523002653.png',
          chapterName: '什么是Scratch',
          chapterType: 1,
          unitId: 32,
          unitName: '第一单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T15:23:44',
          updateTime: '2023-08-14T16:01:35',
        },
        {
          chapterId: 17,
          chapterCover:
            'http://cdn.codedancing.cn/cover/732da202308141602009748.png',
          chapterName: '组件',
          chapterType: 1,
          unitId: 32,
          unitName: '第一单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:02:11',
          updateTime: '2023-08-14T16:02:11',
        },
        {
          chapterId: 19,
          chapterCover:
            'http://cdn.codedancing.cn/cover/e9b80202308141607313511.png',
          chapterName: '程序',
          chapterType: 1,
          unitId: 32,
          unitName: '第一单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:07:43',
          updateTime: '2023-08-14T16:07:43',
        },
        {
          chapterId: 20,
          chapterCover:
            'http://cdn.codedancing.cn/cover/100fd20230814160758800.png',
          chapterName: 'Scratch FlappyBird 游戏实践教学',
          chapterType: 1,
          unitId: 32,
          unitName: '第一单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:08:01',
          updateTime: '2023-08-14T16:08:01',
        },
        {
          chapterId: 21,
          chapterCover:
            'http://cdn.codedancing.cn/cover/1fc9b202308141608285995.png',
          chapterName: '单元测试',
          chapterType: 2,
          unitId: 32,
          unitName: '第一单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:08:37',
          updateTime: '2023-08-14T16:08:37',
        },
      ],
      unitKnowledgeList: [
        {
          ckId: 44,
          knowledgeId: 22,
          knowledge: '运动',
          chapterId: 17,
          unitId: 32,
          courseId: 16,
          ccId: 8,
        },
        {
          ckId: 46,
          knowledgeId: 22,
          knowledge: '运动',
          chapterId: 14,
          unitId: 32,
          courseId: 16,
          ccId: 8,
        },
      ],
    },
    {
      unitId: 33,
      courseId: 16,
      unitName: '第二单元',
      createTime: '2023-08-14T15:22:33',
      updateTime: '2023-08-14T15:22:33',
      unitType: 0,
      courseChapterVoList: [
        {
          chapterId: 15,
          chapterCover:
            'http://cdn.codedancing.cn/cover/c9f4a202308141525239642.png',
          chapterName: '什么是Scratch',
          chapterType: 1,
          unitId: 33,
          unitName: '第二单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T15:25:44',
          updateTime: '2023-08-14T15:25:44',
        },
        {
          chapterId: 16,
          chapterCover:
            'http://cdn.codedancing.cn/cover/4f4be202308141532256779.png',
          chapterName: '单元测试名称',
          chapterType: 2,
          unitId: 33,
          unitName: '第二单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T15:32:43',
          updateTime: '2023-08-14T15:32:43',
        },
      ],
      unitKnowledgeList: [
        {
          ckId: 45,
          knowledgeId: 22,
          knowledge: '运动',
          chapterId: 15,
          unitId: 33,
          courseId: 16,
          ccId: 8,
        },
      ],
    },
    {
      unitId: 34,
      courseId: 16,
      unitName: '期中考试',
      createTime: '2023-08-14T15:22:39',
      updateTime: '2023-08-14T16:00:32',
      unitType: 1,
      courseChapterVoList: [
        {
          chapterId: 18,
          chapterCover:
            'http://cdn.codedancing.cn/cover/e1a77202308141602374072.png',
          chapterName: '期中考试',
          chapterType: 3,
          unitId: 34,
          unitName: '期中考试',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:03:21',
          updateTime: '2023-08-14T16:03:21',
        },
      ],
      unitKnowledgeList: null,
    },
    {
      unitId: 35,
      courseId: 16,
      unitName: '第四单元',
      createTime: '2023-08-14T16:09:34',
      updateTime: '2023-08-14T16:09:34',
      unitType: 0,
      courseChapterVoList: [
        {
          chapterId: 22,
          chapterCover:
            'http://cdn.codedancing.cn/cover/cce7e202308141609417589.png',
          chapterName: '课次',
          chapterType: 1,
          unitId: 35,
          unitName: '第四单元',
          courseId: 16,
          courseName: 'Scratch高级',
          ccId: 8,
          ccName: 'Scratch',
          createTime: '2023-08-14T16:09:56',
          updateTime: '2023-08-14T16:09:56',
        },
      ],
      unitKnowledgeList: null,
    },
  ],
  courseKnowledgeList: [
    {
      ckId: 44,
      knowledgeId: 22,
      knowledge: '运动',
      chapterId: 17,
      unitId: 32,
      courseId: 16,
      ccId: 8,
    },
    {
      ckId: 45,
      knowledgeId: 22,
      knowledge: '运动',
      chapterId: 15,
      unitId: 33,
      courseId: 16,
      ccId: 8,
    },
    {
      ckId: 46,
      knowledgeId: 22,
      knowledge: '运动',
      chapterId: 14,
      unitId: 32,
      courseId: 16,
      ccId: 8,
    },
  ],
});

const type = ref(2);
</script>

<style lang="less" scoped>
.result {
  width: 100%;
  height: 100%;
  padding: 32px 244px 153px 244px;
  box-sizing: border-box;
  overflow-y: auto;
  background: transparent;
  background-image: url('@/assets/bg.png');
  background-size: 100% 866px;
  background-repeat: no-repeat;

  &::-webkit-scrollbar {
    width: 0;
  }

  .card {
    width: 100%;
    height: 880px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .to_pay {
      width: fit-content;
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .title {
        height: 44px;
        font-size: 36px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 44px;
      }

      .course_price {
        height: 36px;
        font-size: 16px;
        font-weight: 600;
        line-height: 36px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 28px;
        display: flex;
        align-items: baseline;
        margin-top: 24px;

        .unit {
          font-size: 14px;
          color: #e34d59;
          margin-left: 8px;
        }

        .value {
          color: #e34d59;
          line-height: 36px;
          font-size: 28px;
          margin-left: 8px;
        }
      }

      .tips {
        height: 24px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 24px;
        margin-top: 24px;
      }

      img {
        width: 256px;
        height: 256px;
        background: #ffffff;
        margin-top: 24px;
      }

      .scan_tips {
        height: 24px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 24px;
        margin-top: 24px;
      }
    }

    .fail_pay {
      width: fit-content;
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .error_img {
        width: 128px;
        height: 128px;
      }

      .title {
        height: 44px;
        font-size: 36px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 44px;
        margin-top: 28px;
      }

      .tips {
        height: 24px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 24px;
        margin-top: 16px;
      }

      .course {
        height: 44px;
        font-size: 36px;
        font-weight: 600;
        color: #0052d9;
        line-height: 44px;
        margin-top: 24px;
      }

      .btn_group {
        width: fit-content;
        height: fit-content;
        margin-top: 24px;

        .repay,
        .study,
        .error_check,
        .success_check {
          width: fit-content;
          height: fit-content;
          background: #ffffff;
          border-radius: 3px;
          border: 1px solid;
          font-size: 16px;
          line-height: 24px;
          padding: 8px 24px;
          box-sizing: border-box;

          &.repay {
            color: #d54941;
            border-color: #d54941;
          }

          &.study {
            background: #0052d9;
            border-color: #0052d9;
            color: rgba(255, 255, 255, 0.9);
          }

          &.error_check {
            color: rgba(0, 0, 0, 0.9);
            border-color: rgba(61, 61, 61, 0.25);
            margin-left: 24px;
          }

          &.success_check {
            color: #0052d9;
            border-color: #0052d9;
            margin-left: 24px;
          }
        }
      }
    }
  }
}
</style>
