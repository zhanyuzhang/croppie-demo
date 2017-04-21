(function(global, undefined) {
  global.App = {
    init: function () {
      this.$postImg = $('.show-area .post');
      this.$msgBox = $('.msg-box .msg');
      this.getPostData();
    },
    getPostData: function () {
      var self = this;
      var yogakey = /yogakey=(\w+)/.exec(location.search);
      $.ajax({
        url: 'http://xz-yixin.gameyw.netease.com/xzyoga_data',
        data: {
          yogakey: yogakey
        },
        success: function (res) {
          if(res.status) {
            self.renderPage(res.data.img, res.data.resume);
          }
        },
        failure: function () {
          alert('表单提交异常！');
        }
      });
    },
    renderPage: function(img, resume) {
      this.$postImg.attr('src', img);
      this.$msgBox.text(resume);
    }
  };
  $(function () {
    global.App.init();
  })
}(window));