<!--
 * @Date: 2023-04-19 16:18:21
 * @LastEditTime: 2023-08-02 15:22:50
-->
<template>
  <div
    :class="['category', { category_scroll: scrollTop >= 24 }]"
    ref="categoryRef"
    @scroll="onScroll"
  >
    <div class="anchors" ref="anchorsRef">
      <p class="title">课程类别：</p>

      <div
        v-for="course in courses"
        :class="['anchor', { anchor_active: activeCourseId == course.ccId }]"
        :key="course.ccId"
        @click="clickAnchor(course)"
      >
        <img :src="course.ccIcon" class="pic" />
        <p class="name">{{ course.ccName }}</p>
      </div>
    </div>

    <div class="courses">
      <template v-if="loading">
        <a-skeleton
          v-for="item in 3"
          class="course"
          :key="item"
          :paragraph="{ rows: 6 }"
          :active="true"
        />
      </template>
      <template v-else>
        <div
          v-for="course in courses"
          class="course"
          :ref="course.ccName"
          :key="course.ccId"
        >
          <div class="left">
            <div class="course_info">
              <div class="img_box">
                <img :src="course.ccIcon" class="course_img" />
              </div>
              <div class="text_box">
                <p class="name">{{ course.ccName }}</p>
                <p class="num">共{{ course.courseInfoVoList.length }}门课程</p>
              </div>
            </div>

            <template v-if="course.courseInfoVoList.length > 0">
              <p class="course_desc">{{ course.ccIntro }}</p>

              <a-button
                class="more_btn"
                type="ghost"
                shape="round"
                @click="openIntro(course)"
              >
                <span>了解更多</span>
                <img
                  src="@/assets/classification/arrowBlue.png"
                  class="arrow"
                />
              </a-button>
            </template>
          </div>

          <div class="right" ref="rightRef">
            <template v-if="course.courseInfoVoList.length > 0">
              <div
                class="units"
                v-for="(courseInfo, index) in course.courseInfoVoList"
                :key="courseInfo.courseId"
                :style="{
                  'margin-left': index % 3 === 0 ? '0' : marginLeft + 'px',
                }"
                ref="unitRef"
              >
                <img class="unit_bg" :src="courseInfo.courseCover" />

                <div class="unit_info" @click="courseAction(0, courseInfo)">
                  <div class="unit_title">{{ courseInfo.courseName }}</div>
                  <p class="unit_desc">{{ courseInfo.courseIntro }}</p>
                </div>

                <div class="unit_bottom">
                  <template v-if="courseInfo.isUserBuy">
                    <p class="process">
                      学习进度：{{ courseInfo.learnProgress }}
                    </p>
                  </template>
                  <div class="price_container" v-else>
                    <div class="price_box">
                      <p class="unit price_unit">￥</p>
                      <p class="price">{{ courseInfo.sellingPrice }}</p>
                    </div>
                    <p class="prev_price">￥{{ courseInfo.originalPrice }}</p>
                  </div>

                  <a-button
                    :class="courseInfo.isUserBuy ? 'enter_btn' : 'buy_btn'"
                    shape="round"
                    @click="courseAction(1, courseInfo)"
                  >
                    <template v-if="courseInfo.isUserBuy">
                      <span>进入学习</span>
                      <img
                        src="@/assets/classification/arrowDownWhite.png"
                        class="arrow_img"
                      />
                    </template>
                    <template v-else>
                      <!-- <img
                        src="@/assets/classification/cart.png"
                        class="cart_img"
                      /> -->
                      <span>课程介绍</span>
                    </template>
                  </a-button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="blank_box">
                <img src="@/assets/classification/blank.png" class="blank" />
                <p class="tips">课程完善中 敬请期待</p>
              </div>
            </template>
          </div>
        </div>
      </template>
      <CategoryIntro ref="categoryIntroRef" />
    </div>

<!--    <div class="footer">{{ VUE_APP_COPYRIGHT }} {{ VUE_APP_ICP }}</div>-->
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  getCurrentInstance,
  watchEffect,
  onUnmounted,
} from 'vue';
import { useCommonStore, useUserStore } from '@/store';
import { CategoryIntro } from '@/components';

const { VUE_APP_COPYRIGHT, VUE_APP_ICP } = process.env;

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();

const scrollTop = ref(0),
  scrollMap = reactive({}),
  onScroll = (e) => {
    scrollTop.value = proxy.$refs.categoryRef.scrollTop;
    for (let item of courses)
      if (scrollTop.value < scrollMap[item.ccId])
        return (activeCourseId.value = item.ccId);
  };

onMounted(() => {
  getAllCourseClassAndCourseInfo();

  window.addEventListener('resize', resizeAction);
});
onUnmounted(() => {
  window.removeEventListener('resize', resizeAction);
});

const courses = reactive([]),
  activeCourseId = ref(1),
  loading = ref(true),
  maxCourseLen = ref(0),
  marginLeft = ref(''),
  getAllCourseClassAndCourseInfo = () => {
    const stuId = userStore?.userInfo?.stuId;

    const params = {};
    if (stuId) params.stuId = stuId;

    proxy.$api
      .getAllCourseClassAndCourseInfo(params)
      .then((res) => {
        if (res.resultCode == 200) {
          res.data.forEach((item, index) => {
            courses.push(item);
            maxCourseLen.value = Math.max(
              maxCourseLen.value,
              item.courseInfoVoList.length
            );
          });
        }
      })
      .finally(() => {
        loading.value = false;
        setTimeout(() => {
          let course;
          course = Object.keys(commonStore.courseInfo).length
            ? commonStore.courseInfo
            : courses[0];
          course && clickAnchor(course);

          resizeAction();
        }, 0);
      });
  },
  resizeAction = () => {
    getScrollMap();
    getStyle();
  },
  getStyle = () => {
    marginLeft.value =
      maxCourseLen.value > 3
        ? (proxy.$refs.rightRef[0].offsetWidth -
            proxy.$refs.unitRef[0].offsetWidth * 3) /
            2 -
          1
        : 24;
  },
  getScrollMap = () => {
    courses.length &&
      courses.forEach((item) => {
        const { ccName, ccId } = item;
        const dom = proxy.$refs[ccName][0];
        const { offsetHeight, offsetTop } = dom;
        let { marginBottom } = getComputedStyle(dom);
        marginBottom = marginBottom.split('px')[0];
        scrollMap[ccId] = offsetTop + offsetHeight - marginBottom - 10;
      });
  },
  clickAnchor = (course) => {
    activeCourseId.value = course.ccId;

    const { categoryRef: container, anchorsRef: anchorsDom } = proxy.$refs,
      dom = proxy.$refs[course.ccName][0];

    const getNum = (str, hex, start) => {
      return Number(str.substring(start, str.indexOf(hex)));
    };

    let { height } = getComputedStyle(anchorsDom);
    height = getNum(height, 'px', 0);

    container.scrollTo({
      top: dom.offsetTop - height,
      left: 0,
      behavior: 'smooth',
    });
  },
  courseAction = (type, { isUserBuy, ccId, courseId }) => {
    let path = '/classification/content';
    if (!type || (type && !isUserBuy)) path = '/courses/intro';
    proxy.$router.push({ path, query: { ccId, courseId } });
  };

const categoryIntroRef = ref(),
  openIntro = (course) => {
    categoryIntroRef.value.content = course;
    categoryIntroRef.value.visible = true;
  };
</script>

<style lang="less" scoped>
.category {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  position: relative;
  background: transparent;
  background-image: url('@/assets/bg.png');
  background-size: 100% 866px;
  background-repeat: no-repeat;

  &.category_scroll {
    .anchors {
      width: 100%;
      position: fixed;
      top: 64px;
      margin-top: 0;
      justify-content: center;
      border-radius: 0;
    }
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  .anchors {
    width: fit-content;
    height: fit-content;
    padding: 6px 24px 6px 32px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 48px;
    display: flex;
    align-items: center;
    margin-top: 24px;
    z-index: 5;

    .title {
      height: 28px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      line-height: 28px;
      margin-right: 16px;
    }

    .anchor {
      height: 44px;
      display: flex;
      align-items: center;
      padding: 6px 24px;
      box-sizing: border-box;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: 22px;
      transition: all 0.5s ease;

      &:not(:last-of-type) {
        margin-right: 16px;
      }

      &:hover {
        background: #ecf2fe;
        border-color: #bbd3fb;

        .name {
          color: #0052d9;
        }
      }

      &.anchor_active {
        background: #4787f0;
        border-color: #4787f0;

        .name {
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .pic {
        width: 32px;
        height: 32px;
      }

      .name {
        height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 28px;
        margin-left: 8px;
      }
    }
  }

  .courses {
    width: 100%;
    height: fit-content;
    padding: 24px 244px 48px 244px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;

    .course {
      width: 100%;
      min-height: 300px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 24px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 24px;
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 24px;
      }

      .left {
        width: 256px;
        height: fit-content;

        .course_info {
          display: flex;

          .img_box {
            width: 96px;
            height: 96px;
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid #dcdcdc;
            display: flex;
            align-items: center;
            justify-content: center;

            .course_img {
              width: 80px;
              height: 80px;
            }
          }

          .text_box {
            flex: 1;
            height: 100%;
            margin-left: 16px;
            padding: 8px 0;
            box-sizing: border-box;

            .name {
              height: 44px;
              font-size: 36px;
              font-weight: 600;
              color: rgba(0, 0, 0, 0.9);
              line-height: 44px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }

            .num {
              height: 28px;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.9);
              line-height: 28px;
              margin-top: 8px;
            }
          }
        }

        .course_desc {
          width: 100%;
          height: fit-content;
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.4);
          line-height: 22px;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          margin-top: 16px;
        }

        .more_btn {
          width: 142px;
          height: 40px;
          background: #ffffff;
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
          border-radius: 40px;
          border: 1px solid #0052d9;
          font-size: 16px;
          color: #0052d9;
          text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
          margin-top: 16px;

          span {
            margin-right: 8px;
          }

          .arrow {
            width: 18px;
            height: 18px;
          }
        }
      }

      .right {
        width: 1104px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 24px;
        flex-shrink: 0;

        .units {
          width: 352px;
          height: 262px;
          background: #ffffff;
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          position: relative;
          overflow: hidden;

          // &:not(:nth-child(3n-2)) {
          //   margin-left: 24px;
          // }

          &:nth-child(3n-2) {
            margin-bottom: 24px;
          }

          .unit_bg {
            width: 100%;
            height: 198px;
            position: absolute;
            top: 0;
            left: 0;
          }

          .unit_info {
            width: 100%;
            height: 198px;
            padding: 32px 24px 82px 24px;
            box-sizing: border-box;
            position: relative;
            cursor: pointer;

            .unit_title {
              width: 100%;
              height: fit-content;
              font-size: 28px;
              font-weight: 600;
              color: #ffffff;
              line-height: 36px;
            }

            .unit_desc {
              width: 100%;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.9);
              line-height: 20px;
              margin-top: 8px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
          }

          .unit_bottom {
            width: 100%;
            height: 64px;
            padding: 16px 13px 16px 24px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .process {
              height: 22px;
              font-size: 14px;
              color: #0052d9;
              line-height: 22px;
            }

            .price_container {
              width: fit-content;
              height: 100%;
              display: flex;
              align-items: center;

              .price_box {
                height: 100%;
                color: #e34d59;
                display: flex;
                align-items: center;

                .unit {
                  width: 9px;
                  height: 22px;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  line-height: 22px;
                }

                .price {
                  height: 100%;
                  font-size: 20px;
                  font-weight: 600;
                  line-height: 28px;
                  margin-left: 4px;
                }
              }

              .prev_price {
                height: 22px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.4);
                line-height: 22px;
                text-decoration: line-through;
                margin-left: 8px;
              }
            }

            .enter_btn {
              min-width: 112px;
              height: 32px;
              background: #4787f0;
              border-radius: 40px;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9);
              line-height: 22px;
              border: unset;
              padding: 5px 16px;
              box-sizing: border-box;
              display: flex;
              align-items: center;

              span {
                margin-right: 8px;
              }

              .arrow_img {
                width: 16px;
                height: 16px;
                transform: rotate(-90deg);
              }
            }

            .buy_btn {
              min-width: 112px;
              height: 32px;
              background: #e34d59;
              border-radius: 40px;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9);
              line-height: 22px;
              border: unset;
              padding: 5px 16px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;

              .cart_img {
                width: 16px;
                height: 16px;
                margin-right: 8px;
              }
            }
          }
        }

        .blank_box {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .blank {
            width: 192px;
            height: 192px;
          }

          .tips {
            height: 28px;
            font-size: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.6);
            line-height: 28px;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 80px;
    // background: #ffffff;
    position: relative;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 80px;
    text-align: center;
  }
}
</style>
