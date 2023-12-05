<template>
  <div class="wrong_question">
    <p class="title">错题集</p>

    <div class="table">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :row-class-name="
          (_record, index) => (index % 2 === 1 ? 'table_striped' : null)
        "
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'ccName'">
            <img
              :src="record?.courseClass?.ccIcon"
              alt="ccIcon"
              class="ccIcon"
            />
            {{ record?.courseClass?.ccName }}
          </template>

          <template v-if="column.key === 'difficulty'">
            <span>{{ difficultMap[record.difficulty] }}</span>
            <a-rate v-model:value="record.difficulty" disabled />
          </template>

          <template v-if="column.key === 'knowledgeList'">
            <div class="tag_box">
              <template v-for="item in getKnowledgeList(record.knowledgeList)">
                <a-tag>{{ item }}</a-tag>
                <a-tag
                  v-if="getKnowledgeList(record.knowledgeList).length == 1"
                >
                  <span>暂无</span>
                </a-tag>
              </template>
            </div>
          </template>

          <template v-if="column.key === 'paperPassRate'">
            <span class="pass_rate">{{
              (record.paperPassRate * 100).toFixed(2) + '%'
            }}</span>
          </template>

          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              class="detail_btn"
              @click="getDetails(record)"
            >
              <span>查看详情</span>
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from 'vue';

const { VUE_APP_BASE_URL } = process.env;

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '我的学习' },
  { label: '我的错题' },
]);

onMounted(() => {
  getWrongPaperList();

  window.addEventListener('resize', onResize);
});

const difficultMap = { 1: '简单', 2: '较易', 3: '中等', 4: '较难', 5: '困难' };

const columns = reactive([
    {
      title: '题集名称',
      dataIndex: 'paperName',
      key: 'paperName',
      width: '22%',
      ellipsis: true,
    },
    {
      title: '所属课类',
      dataIndex: 'ccName',
      key: 'ccName',
      width: '9%',
      ellipsis: true,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '16%',
      ellipsis: true,
    },
    {
      title: '题型',
      dataIndex: 'paperType',
      key: 'paperType',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '相关知识点',
      dataIndex: 'knowledgeList',
      key: 'knowledgeList',
      width: '28%',
      ellipsis: true,
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      width: '7%',
      ellipsis: true,
    },
    { title: '操作', dataIndex: 'action', key: 'action' },
  ]),
  dataSource = ref([]),
  loading = ref(false),
  pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: false,
    pageSizeOptions: [5, 10, 20, 50],
    showTotal: (total) => `共 ${total} 项数据`,
    onChange: (page, pageSize) => handlePageChange(page, pageSize),
    onShowSizeChange: (current, size) => showSizeChange(current, size),
  }),
  // 翻页
  handlePageChange = (page, pageSize) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
    getWrongPaperList();
  },
  // 更换每页显示
  showSizeChange = (current, size) => {
    pagination.current = current;
    pagination.pageSize = size;
    getWrongPaperList();
  };

const getWrongPaperList = () => {
    loading.value = true;
    const { current: pageIndex, pageSize } = pagination;
    const { stuId } = userStore.userInfo;
    const params = { pageIndex, pageSize, stuId };

    proxy.$api.getWrongPaperList(params).then((res) => {
      if (res?.resultCode == 200) {
        const { records, total, current } = res.data;

        pagination.total = total;
        pagination.current = current;

        dataSource.value = records;
        loading.value = false;

        nextTick(() => {
          onListenDom();
        });
      }
    });
  },
  onResize = () => {
    dataSource.value.forEach((item) => {
      getKnowledgeList(item.knowledgeList);
    });
    onListenDom();
  },
  // 监听dom展示长度
  onListenDom = () => {
    // 重置所有tag的样式
    const elem = document.querySelectorAll('.ant-tag');
    Array.from(elem).forEach((item) => {
      item.style.display = '';
    });

    // 第一层循环：table行数据的循环
    Array.from(document.querySelectorAll('.tag_box')).forEach((tagBoxElem) => {
      // 获取tag_box的动态宽度
      const tagBoxClientWidth = tagBoxElem.clientWidth;

      let // tag累加宽度，用于判断是否需要隐藏tag并添加x+的tag
        childTotalWidth = 0,
        // 每个tag宽度累加的结果数组
        totalWidthArr = [],
        // 累加宽度>tag_box宽度的第一个数组下标
        childIndex = -1,
        // 用于判断是否结束当前行数据的循环
        flag = false;

      const // tag_box的子元素tags
        tags = tagBoxElem.children,
        // tag_box的子元素的个数
        tagsLen = tags.length,
        // x+标签的宽度 1920:47px
        lastClientWidth = tags[tagsLen - 1].clientWidth;

      // 第二层循环：tab_box的子元素tag的循环，
      // 计算出tag的总宽度，判断总宽度是否超过tab_box宽度
      Array.from(tags).forEach((child) => {
        const childClientWidth = child.clientWidth,
          childMarginRight = Number(
            getComputedStyle(child).marginRight.split('px')[0]
          );

        childTotalWidth += childClientWidth + childMarginRight;
        totalWidthArr.push(childTotalWidth);

        if (childTotalWidth > tagBoxClientWidth) {
          if (!flag) {
            childIndex = totalWidthArr.findIndex((item) => {
              return item + lastClientWidth > tagBoxClientWidth;
            });

            flag = true;
          }

          Array.from(tags).forEach((child, index) => {
            if (index >= childIndex && index != tagsLen - 1)
              child.style.display = 'none';
            if (index == tagsLen - 1) {
              child.innerText = tagsLen - 1 - childIndex + '+';
            }
          });
        }
      });

      Array.from(tags).forEach((child, index) => {
        if (child.innerText == '0+') child.style.display = 'none';
      });
    });
  },
  getKnowledgeList = (list) => {
    let tempList = [...list];
    let hiddenCount = 0;
    tempList.push('0+');

    return tempList;
  };

const getDetails = (record) => {
  const {
    paperId,
    chapterId,
    courseChapterId: ccId,
    courseId,
    unitId,
    chapterType,
    ifBindChapter,
  } = record;
  // 是否绑定课次：练习题库还是课次的练习、考试
  // 课次类型：1学习课次2单元测试3课程考试
  if (!ifBindChapter || chapterType != 1) {
    const url = `${VUE_APP_BASE_URL}/courses/summary?paperId=${paperId}&courseId=${courseId}&ccId=${ccId}`;
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  } else {
    if (!chapterId || !ccId || !courseId || !unitId)
      return proxy.$message.warning('参数缺失!');
    const obj = { btn_val: 1, chapterId };
    commonStore.s_set_btn_value(JSON.stringify(obj));

    const url = `${VUE_APP_BASE_URL}/courses/learn?chapterId=${chapterId}&ccId=${ccId}&courseId=${courseId}&unitId=${unitId}&btnValue=1`;
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  }
};
</script>

<style lang="less" scoped>
.wrong_question {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 32px;
  box-sizing: border-box;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  .title {
    width: 100%;
    height: 44px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 44px;
  }

  .table {
    width: 100%;
    height: calc(100% - 44px);
    padding-top: 16px;

    :deep(.ant-table) {
      .table_striped {
        background: #f7f8fa;
      }

      .ant-table-tbody > tr > td {
        /* height: 56px; */
        padding: 14px 16px;
        line-height: 28px;
      }

      .ccIcon {
        width: 28px;
        height: 28px;
        margin-right: 4px;
      }

      .ant-rate.ant-rate-disabled {
        margin-left: 8px;
      }

      .ant-tag {
        background: #e3f9e9;
        border-radius: 9999px;
        border: 1px solid #2ba471;
        font-size: 12px;
        font-weight: 600;
        color: #2ba471;
        line-height: 20px;
        padding: 4px 16px;

        &:last-of-type {
          background: #f3f3f3;
          border-color: #f3f3f3;
          color: rgba(0, 0, 0, 0.4);
        }
      }

      .pass_rate {
        font-size: 16px;
        font-weight: 600;
        color: #3d3d3d;
        line-height: 28px;
      }

      .detail_btn {
        color: #0052d9;
      }
    }
  }
}
</style>
