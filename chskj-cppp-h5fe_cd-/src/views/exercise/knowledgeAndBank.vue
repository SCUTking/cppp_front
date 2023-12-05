<!--
 * @Date: 2023-05-16 11:57:22
 * @LastEditTime: 2023-05-16 14:09:43
-->
<template>
  <div class="knowledge_main">
    <div class="class_box">
      <div class="title">
        <img src="@/assets/course/in_unit.png" class="icon" />
        <span>课类/知识点</span>
      </div>
      <div class="classes">
        <div
          :class="['class', { active: ccId == -10 }]"
          @click="clickClass(-10)"
        >
          <AppstoreOutlined class="pic" />
          <p class="name">全部题目</p>
        </div>
        <div
          v-for="course in courses"
          :class="['class', { active: ccId == course.ccId }]"
          :key="course.ccId"
          @click="clickClass(course.ccId)"
        >
          <img :src="course.ccIcon" class="pic" />
          <p class="name">{{ course.ccName }}</p>
        </div>
      </div>
    </div>
    <div class="classification_box" v-if="ccId != -10">
      <p class="title2">知识点分类</p>
      <!-- 一级分类 -->
      <a-tabs v-model:activeKey="fkId" @change="clickClassification">
        <a-tab-pane
          v-for="classification in classifications"
          :key="classification.fkId"
          :tab="classification.fkName"
        ></a-tab-pane>
      </a-tabs>
      <!-- 二级分类 -->
      <div class="classification_items">
        <div
          :class="[
            'classification_item',
            {
              active: skId == classification2.skId,
            },
          ]"
          v-for="classification2 in classification2s"
          @click="clickClassification2(classification2.skId)"
        >
          {{ classification2.skName }}
        </div>
      </div>
    </div>
    <div class="knowledge_box">
      <p class="title2">知识点</p>
      <div
        class="knowledges"
        :class="isFlod ? 'fold' : ''"
        v-if="knowledges.length"
      >
        <div
          :class="[
            'knowledge',
            { active: knowledgeId == knowledge.knowledgeId },
          ]"
          v-for="knowledge in knowledges"
          @click="clickKnowledge(knowledge.knowledgeId)"
        >
          {{ knowledge.knowledge }}
          <span class="knowledge_num">{{ knowledge.paperNum }}</span>
        </div>
      </div>
      <p class="text1" v-else>暂无所属知识点</p>
      <div v-if="isShowChange" @click="changeFlod" class="changeFlod">
        {{ isFlod ? '展开' : '收起' }}
        <DoubleRightOutlined :rotate="isFlod ? 90 : -90" />
      </div>
    </div>
  </div>
  <div class="questionBank">
    <div class="title">
      <MenuOutlined class="icon" />
      <span>练习题库</span>
    </div>
    <div class="select_box">
      <a-select
        v-model:value="paperState"
        :options="paperStateOptions"
        @change="getPageListWithAllCondition"
        class="m_select"
      >
      </a-select>
      <a-select
        v-model:value="difficulty"
        :options="difficultyOptions"
        @change="getPageListWithAllCondition"
        class="m_select"
      >
      </a-select>
      <a-select
        v-model:value="paperType"
        :options="paperTypeOptions"
        @change="getPageListWithAllCondition"
        class="m_select"
      >
      </a-select>
    </div>
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
          <template v-if="column.key === 'paperState'">
            <span class="font_size_16" :class="'state' + record.paperState">{{
              paperStateMap[record.paperState]
            }}</span>
          </template>
          <template v-if="column.key === 'ccName'">
            <img
              :src="record?.courseClass?.ccIcon"
              alt="ccIcon"
              class="ccIcon"
            />
            {{ record?.courseClass?.ccName }}
          </template>
          <template v-if="column.key === 'paperName'">
            <span @click="clickPaper(record)" style="cursor: pointer">{{
              record.paperName
            }}</span>
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
        </template>
      </a-table>
    </div>
  </div>
  <buyModal />
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  nextTick,
  computed,
  toRef,
} from 'vue';
import { get, set, toReactive } from '@vueuse/core';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { MenuOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import { useCommonStore, useUserStore } from '@/store';
import buyModal from '../courses/introAndBuy/buy/buyModal.vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

const isFlod = ref(true);

onMounted(() => {
  getAllCourseClassAndCourseInfo();
  getKnowledgeClassifyInfo();
  getPageListWithAllCondition();
  window.addEventListener('resize', onResize);
});
const isShowChange = computed(() => {
  return get(knowledgesScrollHeight) > 2 * get(knowledgeHeight);
});
const paramsKeys = reactive({
  ccId: -10,
  fkId: -10,
  skId: -10,
  knowledgeId: -10,
  paperState: -10,
  difficulty: -10,
  paperType: -10,
});
// 科类
const courses = ref([]);
const ccId = toRef(paramsKeys, 'ccId');
// 知识点一级分类
const classifications = ref([]);
const fkId = toRef(paramsKeys, 'fkId');
// 知识点二级分类
const classification2s = ref([]);
const skId = toRef(paramsKeys, 'skId');
// 知识点
const knowledges = ref([]);
const knowledgeId = toRef(paramsKeys, 'knowledgeId');

// 获取科类
const getAllCourseClassAndCourseInfo = async () => {
  const res = await proxy.$api.getAllCourseClassAndCourseInfo();
  if (res.resultCode == 200) {
    set(courses, res.data);
  }
};
// 获取一级知识点
const getFKByCcId = async () => {
  const params = {
    ccId: get(ccId),
  };
  const res = await proxy.$api.getFKByCcId(params);
  if (res.resultCode == 200) {
    set(classifications, res.data);
  }
};
// 获取二级知识点
const getSKByFkId = async () => {
  const params = {
    fkId: get(fkId),
  };
  const res = await proxy.$api.getSKByFkId(params);
  if (res.resultCode == 200) {
    set(classification2s, res.data);
  }
};
// 获取知识点
const knowledgesScrollHeight = ref(0);
const knowledgeHeight = ref(0);
const getKnowledgeClassifyInfo = async (type) => {
  const courseClassId = get(ccId);
  const firstKnowledgeId = get(fkId);
  const secondKnowledgeId = get(skId);
  set(knowledges, []);
  const params = {};
  if (courseClassId != -10) params.courseClassId = courseClassId;
  if (firstKnowledgeId != -10) params.firstKnowledgeId = firstKnowledgeId;
  if (secondKnowledgeId != -10) params.secondKnowledgeId = secondKnowledgeId;
  const res = await proxy.$api.getKnowledgeClassifyInfo(params);
  if (res.resultCode == 200) {
    set(knowledges, res.data.knowledgeInfoList);
    nextTick(() => {
      if (get(knowledgeHeight) == 0) {
        const knowledge = document.querySelector('.knowledge');
        set(knowledgeHeight, knowledge?.clientHeight || 0);
      }
      const knowledges = document.querySelector('.knowledges');
      set(knowledgesScrollHeight, knowledges?.scrollHeight || 0);
    });
  }
};
// 点击切换科类
const clickClass = (id) => {
  set(ccId, id);
  set(fkId, -10);
  set(skId, -10);
  set(knowledgeId, -10);
  set(classification2s, []);
  getKnowledgeClassifyInfo();
  if (id != -10) getFKByCcId();
  getPageListWithAllCondition();
};
// 点击切换一级分类
const clickClassification = (id) => {
  set(fkId, id);
  getKnowledgeClassifyInfo();
  getSKByFkId();
  getPageListWithAllCondition();
};
// 点击切换二级分类
const clickClassification2 = (id) => {
  set(skId, id);
  getKnowledgeClassifyInfo();
  getPageListWithAllCondition();
};
// 点击切换知识点
const clickKnowledge = (id) => {
  set(knowledgeId, id);
  getPageListWithAllCondition();
};

// 点击展开/收起知识点
const changeFlod = () => {
  set(isFlod, !get(isFlod));
};
// 试卷状态
const paperState = toRef(paramsKeys, 'paperState');
const paperStateOptions = [
  {
    value: -10,
    label: '全部状态',
  },
  {
    value: -1,
    label: '待解锁',
  },
  {
    value: 0,
    label: '未开始',
  },
  {
    value: 1,
    label: '待完成',
  },
  {
    value: 2,
    label: '已解答',
  },
];
const paperStateMap = {
  '-1': '待解锁',
  0: '未开始',
  1: '待完成',
  2: '已解答',
};

// 试卷难度
const difficulty = toRef(paramsKeys, 'difficulty');
const difficultyOptions = [
  {
    value: -10,
    label: '全部难度',
  },
  {
    value: 1,
    label: '容易',
  },
  {
    value: 2,
    label: '较易',
  },
  {
    value: 3,
    label: '中等',
  },
  {
    value: 4,
    label: '较难',
  },
  {
    value: 5,
    label: '困难',
  },
];

// 试卷题型
const paperType = toRef(paramsKeys, 'paperType');
const paperTypeOptions = [
  {
    value: -10,
    label: '全部题型',
  },
  {
    value: '主观题',
    label: '主观题',
  },
  {
    value: '客观题',
    label: '客观题',
  },
  {
    value: '主观题、客观题',
    label: '主观题、客观题',
  },
];

const difficultMap = { 1: '简单', 2: '较易', 3: '中等', 4: '较难', 5: '困难' };

const columns = reactive([
    {
      title: '状态',
      dataIndex: 'paperState',
      key: 'paperState',
      width: '5.77%',
      ellipsis: true,
    },

    {
      title: '题集名称',
      dataIndex: 'paperName',
      key: 'paperName',
      width: '22.53%',
      ellipsis: true,
    },
    {
      title: '所属课类',
      dataIndex: 'ccName',
      key: 'ccName',
      width: '9.29%',
      ellipsis: true,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '16.12%',
      ellipsis: true,
    },
    {
      title: '题型',
      dataIndex: 'paperType',
      key: 'paperType',
      width: '10.21%',
      ellipsis: true,
    },
    {
      title: '相关知识点',
      dataIndex: 'knowledgeList',
      key: 'knowledgeList',
      width: '28.45%',
      ellipsis: true,
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      width: '7.67%',
      ellipsis: true,
    },
  ]),
  dataSource = ref([]),
  loading = ref(false),
  pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 5,
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
    getPageListWithAllCondition();
  },
  // 更换每页显示
  showSizeChange = (current, size) => {
    pagination.current = current;
    pagination.pageSize = size;
    getPageListWithAllCondition();
  };

const getPageListWithAllCondition = async () => {
    set(loading, true);
    let stuId;
    const { current: pageNum, pageSize } = pagination;
    stuId = userStore?.userInfo?.stuId;
    const params = { pageNum, pageSize };
    if (stuId) params.stuId = stuId;
    Object.keys(paramsKeys).forEach((item) => {
      const key = paramsKeys[item];
      if (key != -10) params[item] = key;
    });
    const res = await proxy.$api.getPageListWithAllCondition(params);
    if (res?.resultCode == 200) {
      const { records, total, current } = res.data;

      pagination.total = total;
      pagination.current = current;
      set(dataSource, records);
      set(loading, false);
      nextTick(() => {
        onListenDom();
      });
    }
  },
  onResize = () => {
    get(dataSource).forEach((item) => {
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

const clickPaper = (data) => {
  const { paperState, paperId, courseId, paperCcId, chapterType } = data;
  switch (paperState) {
    case -1:
      if (courseId) {
        proxy.$router.push({
          name: 'intro',
          query: {
            ccId: paperCcId,
            courseId,
          },
        });
      } else {
        commonStore.s_set_buyLoading(true);
      }
      break;
    default:
      let name = chapterType == 1 ? 'learn' : 'reminder';
      if (chapterType == 1) {
        name = 'learn';
        const obj = { btn_val: 1, chapterId };
        commonStore.s_set_btn_value(JSON.stringify(obj));
      } else {
        name = paperState == 2 ? 'summary' : 'reminder';
      }
      const query =
        chapterType == 1
          ? {
              paperId,
              courseId,
              ccId: paperCcId,
              chapterId,
              unitId,
            }
          : { paperId, courseId, ccId: paperCcId };
      proxy.$router.push({
        name,
        query,
      });
      break;
  }
};
</script>

<style lang="less" scoped>
.knowledge_main,
.questionBank {
  border-radius: 16px;
  padding: 16px 32px 24px 32px;
  background: #ffffff;
}
.knowledge_main {
  margin-bottom: 24px;
}
.title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  line-height: 28px;
  .icon {
    margin-right: 8px;
    width: 28px;
  }
}
.classes {
  display: flex;
  .class {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    cursor: pointer;
    border-radius: 100px;
    transition: all 0.5s ease;
    background: #eeeeee;
    &:not(:last-of-type) {
      margin-right: 16px;
    }
    &:hover {
      color: #0052d9;
      background: #ecf2fe;
      .name {
        color: #0052d9;
      }
    }
    &.active {
      background: #2ba471;
      color: rgba(255, 255, 255, 0.9);
      .name {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .pic {
      font-size: 32px;
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
.classification_items {
  display: flex;
  flex-wrap: wrap;
  .classification_item {
    margin: 0 16px 16px 0;
    padding: 5px 16px;
    background: #f3f3f3;
    border-radius: 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
    border: 1px solid #f3f3f3;
    cursor: pointer;

    &.active {
      color: #0052d9;
      border: 1px solid #0052d9;
    }
  }
}
.knowledge_box {
  position: relative;
}
.knowledges {
  display: flex;
  flex-wrap: wrap;
  transition: all 1s ease;
  .knowledge {
    height: 38px;
    font-size: 14px;
    font-weight: 600;
    color: #3d3d3d;
    line-height: 22px;
    cursor: pointer;
    &.active {
      color: #0052d9;
      .knowledge_num {
        color: #0052d9;
        background: #d9e1ff;
      }
    }
  }
  .knowledge_num {
    margin: 0 24px 0 4px;
    padding: 2px 8px;
    background: #e7e7e7;
    border-radius: 9999px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 20px;
  }
}
.fold {
  max-height: 76px;
  overflow: hidden;
}
.title2 {
  margin-bottom: 8px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #3d3d3d;
  line-height: 24px;
}
.changeFlod {
  position: absolute;
  right: 20px;
  bottom: -10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 20px;
}

.m_select {
  width: 200px;
  margin-right: 24px;
}

.table {
  width: 100%;
  height: calc(100% - 44px);
  padding-top: 16px;
  .font_size_16 {
    font-size: 16px;
  }
  .state-1 {
    color: #f6685d;
  }
  .state0 {
    color: #fa9550;
  }
  .state1 {
    color: #366ef4;
  }
  .state2 {
    color: #2ba471;
  }
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
:deep(.ant-pagination) {
  margin: 40px 0 20px 0;

  .ant-pagination-total-text {
    position: absolute;
    left: 0;
  }

  .ant-select-selector {
    width: 96px;
  }

  .ant-pagination-item-active {
    font-weight: 500;
    background: #0052d9;

    a {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  .ant-pagination-options-quick-jumper {
    margin-left: 16px;
    background: #f3f3f3;
    border-radius: 3px;
    padding: 2px 8px;
    box-sizing: unset;
  }
}
</style>
