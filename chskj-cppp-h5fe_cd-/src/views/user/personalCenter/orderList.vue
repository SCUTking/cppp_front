<template>
  <div class="order_list">
    <div class="tab_box">
      <div class="tabs">
        <div
          v-for="tab in tabs"
          :class="['tab', { tab_active: tab.id == activeTabId }]"
          :key="tab.id"
          @click="clickTab(tab.id)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <div class="content_box">
      <div class="empty_box" v-if="orderList.length == 0">
        <a-empty></a-empty>
      </div>

      <template v-else>
        <div class="order_item" v-for="item in orderList">
          <img
            :src="item.courseInfo.courseCover"
            alt="courseCover"
            class="cover"
          />

          <div class="info_box">
            <div class="row">
              <p class="order_no">订单编号：{{ item.orderNo }}</p>

              <div class="box">
                <img
                  src="@/assets/header/updatePass.png"
                  alt="clock"
                  class="clock"
                />
                <p class="create_time">
                  {{ dayjs(item.createTime).format('YYYY/MM/DD HH:mm') }}
                </p>
              </div>
            </div>

            <div class="row">
              <p class="title">{{ item.courseInfo.courseName }}</p>
            </div>

            <div class="row">
              <div class="box">
                <p class="price">￥{{ item.actualTotal }}</p>
                <p class="pay_type">{{ '支付方式：微信支付' }}</p>
              </div>
            </div>

            <div class="row">
              <span class="status">{{ stateMap[activeTabId] }}</span>
              <a-button class="btn">
                <span>学习课程</span>
                <img
                  src="@/assets/personalCenter/arrow_right.png"
                  alt="arrow"
                  class="arrow"
                />
              </a-button>
            </div>
          </div>
        </div>
      </template>

      <div class="pagination_box">
        <a-pagination
          v-model:current="pagination.current"
          v-model:pageSize="pagination.pageSize"
          :pageSizeOptions="pagination.pageSizeOptions"
          :showTotal="() => `共 ${pagination.total} 项数据`"
          :total="pagination.total"
          showQuickJumper
          showSizeChanger
          @change="handlePageChange"
          @showSizeChange="showSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, watch, onMounted } from 'vue';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '订单中心' },
  { label: '我的订单' },
]);

onMounted(() => {
  clickTab(1);
});

const tabs = reactive([
    { id: 1, label: '全部订单' },
    { id: 2, label: '待支付' },
    { id: 3, label: '已完成' },
  ]),
  activeTabId = ref(-1),
  clickTab = (tabId) => {
    activeTabId.value = tabId;
    tabId > 1 ? queryOrder() : queryAllOrder();
  };

const stateMap = { 1: '未支付', 2: '已支付', 3: '已取消' };

const orderList = reactive([]),
  queryAllOrder = () => {
    orderList.length = 0;

    const { stuId } = userStore.userInfo;
    proxy.$api.queryAllOrder({ stuId }).then((res) => {
      if (res && res.resultCode == 200) {
        res.data.forEach((item) => {
          const courseInfo = JSON.parse(item.courseInfo);
          item.courseInfo = courseInfo;
          orderList.push(item);
        });

        // pagination.total = res.length;
      }
    });
  },
  queryOrder = () => {
    orderList.length = 0;

    const { stuId } = userStore.userInfo;
    const orderState = activeTabId.value;
    proxy.$api.queryOrder({ stuId, orderState }).then((res) => {
      if (res && res.resultCode == 200) {
        orderList.value = res.data;
      }
    });
  };

const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  }),
  // 翻页
  handlePageChange = (page, pageSize) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
    getStudentWork();
  },
  // 更换每页显示
  showSizeChange = (current, size) => {
    pagination.current = current;
    pagination.pageSize = size;
    getStudentWork();
  };

watch(
  activeTabId,
  (data) => {
    if (data != -1) queryOrder();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.order_list {
  width: 100%;
  height: 100%;

  .tab_box {
    width: 100%;
    height: 64px;
    background: #f9f6d0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .tabs {
      width: fit-content;
      height: 40px;
      background: #ffffff;
      border-radius: 6px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      padding: 4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .tab {
        width: fit-content;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
        padding: 5px 11px;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;

        &.tab_active {
          background: #00a870;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        &:not(:first-of-type) {
          margin-left: 4px;
        }
      }
    }
  }

  .content_box {
    width: 100%;
    height: calc(100% - 64px);
    overflow-y: auto;
    padding-top: 16px;

    &::-webkit-scrollbar {
      width: 0;
    }

    .empty_box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border-radius: 16px;
    }

    .order_item {
      height: 197px;
      background: #ffffff;
      border-radius: 16px;
      display: flex;
      padding: 16px 32px;
      box-sizing: border-box;

      &:not(:first-of-type) {
        margin-top: 16px;
      }

      .cover {
        width: 293px;
        height: 100%;
      }

      .info_box {
        flex: 1;
        height: 100%;
        margin-left: 24px;

        .row {
          width: 100%;
          height: fit-content;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:nth-of-type(2),
          &:nth-of-type(3) {
            margin-top: 16px;
          }

          .box {
            display: flex;
          }

          .order_no {
            height: 28px;
            font-size: 13px;
            color: #000000;
            line-height: 28px;
            margin-top: 8px;
          }

          .clock {
            width: 28px;
            height: 28px;
          }

          .create_time {
            height: 28px;
            font-size: 13px;
            color: #000000;
            line-height: 28px;
            margin-left: 8px;
          }

          .title {
            height: 32px;
            font-size: 24px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
            line-height: 32px;
          }

          .price {
            height: 28px;
            font-size: 20px;
            font-weight: 600;
            color: #d54941;
            line-height: 28px;
          }

          .pay_type {
            height: 28px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 28px;
            margin-left: 24px;
          }

          .status {
            height: 26px;
            font-size: 18px;
            font-weight: 600;
            color: #2ba471;
            line-height: 26px;
          }

          .btn {
            width: fit-content;
            height: fit-content;
            background: #f2f3ff;
            border-radius: 3px;
            border: 1px solid #0052d9;
            padding: 8px 24px;

            span {
              height: 24px;
              font-size: 16px;
              color: #0052d9;
              line-height: 24px;
            }

            .arrow {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    .pagination_box {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
