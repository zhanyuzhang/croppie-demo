(function(global) {
  global.App = {
    // 初始化必要的属性
    init: function() {
      this.imgBase64 = null; // 裁剪后的图片的base64编码
      this.$fileInput = $('input[type=file]'); // 文件选择框
      this.$croppieModal = $('.croppie-modal'); // 裁剪图片时的遮罩容器
      this.maxWord = 50;
      this.currentWord = 0;

      this.initCroppie();
      this.remResize();
      this.bindEvents();

      // 如果是在易信里面打开，则调用接口获取用户信息，并将其填写到表单里面
      if(this.isYiXin()) {
        var code = (/code=(\w+)/.exec(location.search) || [])[1];
        if(code) this.getUserInfo(code);
      }
    },

    // 初始化croppie插件
    initCroppie: function() {
      this.uploadCrop = new Croppie(document.querySelector('.croppie-container'), {
        viewport: {
          width: 200,
          height: 143,
          type: 'rectangle'
        },
        boundary: {
          width: 300,
          height: 300
        },
        mouseWheelZoom: false
      });
      // 添加工具条！
      $('.cr-slider-wrap').append($('.toolbar'));
    },

    // 判断是是否为易信
    isYiXin: function () {
      return /Yixin/i.test(window.navigator.userAgent);
    },

    // rem布局方法
    remResize: function(originWidth) {
      originWidth = originWidth || 750;
      var screenWidth = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = ((screenWidth / originWidth) * 100) + 'px';
    },

    // 获取截取的图片
    getCroppieImg: function() {
      var self = this;
      this.uploadCrop.result().then(function (result) {
        self.$croppieModal.addClass('hidden');
        self.imgBase64 = result;
        $('.add').attr('src', result);
      })
    },

    // 压缩图片
    minimiseImg: function(src, callback) {
      var self = this;
      var image = new Image(),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d');
      image.src = src;
      image.onload = function() {
        var w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w / 4;
        canvas.height = h / 4;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w / 4, h / 4);
        var data = canvas.toDataURL("image/jpeg", 0.5);
        callback && callback(data);
      };
    },

    // 获取用户信息
    getUserInfo: function (code) {
      var self = this;
      $.ajax({
        url: '//xz-yixin.gameyw.netease.com/bindinfo',
        data: {
          code: code
        },
        dataType: 'json',
        success: function (res) {
          if(res.status && res.data) {
            self.initForm(res.data);
          }
        },
        failure: function () {
          alert('表单提交异常！');
        }
      });
    },

    // 初始化表单
    initForm: function(data) {
      var form = $('#post-form')[0];
      form.name.value = data.name;
      form.unum.value = data.unum;
    },

    // 提交表单
    submitForm: function() {
      var form = $('#post-form')[0];
      var data = {
        name: form['name'].value.trim(),
        unum: form['unum'].value.trim(),
        mobile: form['mobile'].value.trim(),
        resume: form['resume'].value.trim(),
        img: this.imgBase64
      };
      if(!data.name || !data.unum || !data.mobile || !data.resume || !data.img) {
        alert('请正确填写表单！');
        return 0;
      }
      $.ajax({
        url: '//xz-yixin.gameyw.netease.com/xzyoga_upload',
        data: data,
        dataType: 'json',
        method: 'post',
        success: function (res) {
          if(!res.status) {
            alert('表单提交异常！');
            return 0;
          }
          location.href = './post.html?yogakey=' + res.data.yogakey;
        },
        failure: function () {
          alert('表单提交异常！');
        }
      });
    },

    // 绑定事件
    bindEvents: function () {
      var self = this;
      $(window).on('resize', function (event) {
        self.remResize();
      });
      $('.wrapper').on('click', function (e) {
        var target = e.target;
        var classList = target.classList;
        switch(true) {
          case classList.contains('btn-save'):
            self.getCroppieImg();
            break;
          case classList.contains('btn-cancel'):
            self.$croppieModal.addClass('hidden');
            break;
          case classList.contains('add'):
            self.$fileInput.click();
            break;
          case classList.contains('btn-submit'):
            self.submitForm();
          default:
            break;
        }
      });

      self.$fileInput.on('change', function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          self.minimiseImg(reader.result, function (data) {
            self.$croppieModal.removeClass('hidden');
            self.uploadCrop.bind({
              url: data
            });
          });
        };
      });

      $('#resume').on('input', function () {
        if(this.value.length > self.maxWord) {
          this.value = this.value.slice(0, self.maxWord);
        }
        $('#remain-num').text(self.maxWord - this.value.length);
      });
    }
  };

  $(function() {
    global.App.init();
  });
}(window));