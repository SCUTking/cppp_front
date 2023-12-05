<template>
  <div class="code_set">
    <p class="title">我的作品&代码集</p>

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
          <template v-if="column.key === 'workName'">{{
            record.workName.split('.')[0]
          }}</template>
          <template v-if="column.key === 'updateTime'">{{
            dayjs(record.updateTime).format('YYYY年MM月DD日 HH:mm')
          }}</template>
          <template v-if="column.key === 'ccName'">
            <img :src="record.ccIcon" alt="ccIcon" class="ccIcon" />
            {{ record.ccName }}
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              class="detail_btn"
              @click="
                $router.push({
                  name: 'codeSetDetails',
                  query: { swid: record.swid },
                })
              "
            >
              <span>查看详情</span>
            </a-button>
            <a-button
              type="link"
              class="download_btn"
              @click="downloadWork(record)"
            >
              <span>下载文件</span>
            </a-button>
            <a-button type="link" class="del_btn" @click="delWork(record.swid)">
              <span>删除</span>
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '我的学习' },
  { label: '我的作品&代码集' },
]);

onMounted(() => {
  getStudentWork();
});

const columns = reactive([
    {
      title: '作品/代码集 名称',
      dataIndex: 'workName',
      key: 'workName',
      width: '48%',
      ellipsis: true,
    },
    {
      title: '所属课类',
      dataIndex: 'ccName',
      key: 'ccName',
      width: '12%',
      ellipsis: true,
    },
    {
      title: '创建/修改 时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '16%',
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
    getStudentWork();
  },
  // 更换每页显示
  showSizeChange = (current, size) => {
    pagination.current = current;
    pagination.pageSize = size;
    getStudentWork();
  };

const getStudentWork = () => {
    loading.value = true;
    const { current: pageIndex, pageSize } = pagination;
    const { stuId } = userStore.userInfo;
    const params = { pageIndex, pageSize, stuId };
    proxy.$api.getStudentWork(params).then((res) => {
      if (res && res.resultCode == 200) {
        const { records, total, current } = res.data.data;

        pagination.total = total;
        pagination.current = current;

        dataSource.value = records;
        loading.value = false;
      }
    });
  },
  downloadWork = ({ workName, ccName, swid: swId }) => {
    const base64ToBlob = (code) => {
      const parts = code.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uint8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; i++) {
        uint8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uint8Array], { type: contentType });
    };

    proxy.$api.downloadStudentWork({ swId }).then((res) => {
      function downloadFile(filename, text) {
        // 创建一个Blob对象
        let blob = new Blob([text], { type: 'text/plain' });

        if (ccName.toLowerCase() == 'scratch') blob = base64ToBlob(text);

        // 创建一个下载链接
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.style.display = 'none';

        // 将下载链接添加到页面中
        document.body.appendChild(downloadLink);

        // 模拟点击下载链接
        downloadLink.click();

        // 清理资源
        URL.revokeObjectURL(downloadLink.href);
        document.body.removeChild(downloadLink);
      }

      // 调用函数生成并下载文件
      const filename = `${workName}`;
      downloadFile(filename, res.data);
    });
  },
  delWork = (swId) => {
    proxy.$modal.confirm({
      title: '警告',
      content: '确定删除？',
      onOk() {
        proxy.$api.deleteStudentWork({ swId }).then((res) => {
          if (res && res.resultCode == 200) {
            proxy.$message.info('删除成功');
            getStudentWork();
          }
        });
      },
    });
  };
</script>

<style lang="less" scoped>
.code_set {
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

      .detail_btn,
      .download_btn {
        color: #0052d9;
      }

      .del_btn {
        color: #d54941;
      }
    }
  }
}
</style>
