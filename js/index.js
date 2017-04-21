(function(global) {
  global.App = {
    // 初始化必要的属性
    init: function() {
      this.imgBase64 = null;
      this.$fileInput = $('input[type=file]');
      this.$croppieModal = $('.croppie-modal');
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
        // enableOrientation: true
      });
      // 添加工具条！
      $('.cr-slider-wrap').append($('.toolbar'));
      this.remResize();
      this.bindEvents();
    },
    remResize: function(originWidth) {
      originWidth = originWidth || 750;
      var screenWidth = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = ((screenWidth / originWidth) * 100) + 'px';
    },
    getBase64: function() {
      var self = this;
      this.uploadCrop.result().then(function (result) {
        self.$croppieModal.addClass('hidden');
        self.imgBase64 = result;
        $('.add').attr('src', result);
      })
    },
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
        url: 'http://xz-yixin.gameyw.netease.com/xzyoga_upload',
        data: data,
        dataType: 'json',
        method: 'post',
        success: function (res) {
          if(!res.status) {
            alert('表单提交异常！');
            return 0;
          }
          console.log(res);
          // window.location.href = './post.html?yogakey=' + res.data.yogakey;
        },
        failure: function () {
          alert('表单提交异常！');
        }
      });
      // window.location.href='./post.html?yogakey=20170411_xzyoga_08eccbb01eaa11e7acbd0015c5e873ce';
    },
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
            self.getBase64();
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
          self.$croppieModal.removeClass('hidden');
          self.uploadCrop.bind({
            url: reader.result
          });
        };
      });
    }
  };

  $(function() {
    global.App.init();
  });
}(window));