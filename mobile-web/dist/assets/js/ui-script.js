// ui-script.js

(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge|Edg/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android (\d+(?:\.\d+){0,2})/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();
  window.userAgentCheck = userAgentCheck;

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // common
  var $win = $(window);
  var $doc = $(document);

  // tempus-dominus
  // https://getdatepicker.com/
  // init ex: $(element).datetimepicker({/* customOptions */});
  // method ex: $(element).data('datetimepicker').dates.clear();
  $.fn.datetimepicker = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('datetimepicker') || !(tempusDominus instanceof Object) || !$.isFunction(tempusDominus.TempusDominus)) return;

      var datetimepicker = new tempusDominus.TempusDominus($this.get(0), option);
      $this.data('datetimepicker', datetimepicker);
    });

    return $(this);
  };
  if (tempusDominus instanceof Object) {
    tempusDominus.extend(window.tempusDominus.plugins.customDateFormat);
  }

  // swiperSet
  // https://github.com/nolimits4web/swiper/tree/Swiper8
  // init ex: $(element).swiperSet({/* customOptions */});
  // method ex: $(element).data('swiper').update();
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      wrapTagName: 'div',
      containerTagName: 'div',
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      playControl: false,
      pauseControl: false,
      togglePlayControl: false,
      scrollbarControl: false,
      observer: true,
      observeParents: true,
      a11yHidden: false,
      a11y: {
        firstSlideMessage: '첫번째 슬라이드',
        lastSlideMessage: '마지막 슬라이드',
        nextSlideMessage: '다음 슬라이드',
        prevSlideMessage: '이전 슬라이드',
        paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
      },
      on: {},
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);

      if (!(typeof customOption.a11y === 'object')) {
        customOption.a11y = {};
      }

      $.extend(option.a11y, defaultOption.a11y, customOption.a11y);

      var $this = $(this);
      var isA11y = !(typeof option.a11y.enabled === 'boolean' && !option.a11y.enabled);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();
      var length = $items.length;

      if (!$this.parent('.swiper').length) {
        $this.wrap('<' + option.wrapTagName + ' class="swiper-object"><' + option.containerTagName + ' class="swiper"></' + option.containerTagName + '></' + option.wrapTagName + '>');
      }
      $this.addClass('swiper-wrapper');

      $items.addClass('swiper-slide').each(function (i) {
        var $this = $(this);

        $this.attr('data-swiper-set-slide-index', i);

        if (isA11y && userAgentCheck.isAndroid) {
          $this.attr('title', i + 1 + '/' + length);
        }
      });

      var $container = $this.parent('.swiper');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">이전 슬라이드</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">다음 슬라이드</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<span class="swiper-scrollbar"></span>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">자동 슬라이드 재생</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">자동 슬라이드 정지</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.togglePlayControl) {
        $appendController.append('<button type="button" class="swiper-button-toggle-play"><span class="swiper-button-toggle-play-text">자동 슬라이드 재생</span></button>');
        option.togglePlayButton = $appendController.find('.swiper-button-toggle-play').get(0);
      }
      if (option.pageControl) {
        $appendController.append('<span class="swiper-pagination"></span>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
      }
      if (option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
      } else if (!option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
      }

      var on = $.extend({}, option.on);
      var isInit = false;

      function callEvent(name, swiper, args1, args2, args3) {
        if (typeof on[name] === 'function') {
          on[name](swiper, args1, args2, args3);
        }
      }

      var bulletClick = false;

      if (option.a11yHidden && option.pagination.clickable) {
        $(option.pagination.el).on('click.swiperSet', '.swiper-pagination-bullet', function () {
          bulletClick = true;
        });
      }

      function setA11yHidden(swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden) {
          $activeItem.removeAttr('aria-hidden');
          $slides.not($activeItem).attr('aria-hidden', 'true');
        }
      }

      function init(swiper) {
        var $slides = $(swiper.slides);

        if (!isInit && $slides.length) {
          isInit = true;

          if (isA11y && userAgentCheck.isAndroid) {
            $slides.removeAttr('aria-label role');
          }

          if (option.a11yHidden) {
            $slides.attr('tabindex', '0');
          }

          setA11yHidden(swiper);
        }
      }

      option.on.init = function (swiper) {
        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid && $slides.length) {
          $slides.removeAttr('aria-label role');
        }

        init(swiper);
        callEvent('init', swiper);
      };

      option.on.observerUpdate = function (swiper) {
        init(swiper);
        callEvent('observerUpdate', swiper);
      };

      option.on.slideChange = function (swiper) {
        setA11yHidden(swiper);

        $container.scrollTop(0).scrollLeft(0);

        callEvent('slideChange', swiper);
      };

      option.on.slideChangeTransitionEnd = function (swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden && bulletClick) {
          $activeItem.focus();
        }

        bulletClick = false;

        callEvent('slideChangeTransitionEnd', swiper);
      };

      option.on.autoplayStart = function (swiper) {
        if (option.playControl) {
          $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.pauseControl) {
          $(option.pauseButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
        }

        if (isA11y) {
          $this.attr('aria-live', 'off');
        }

        callEvent('autoplayStart', swiper);
      };

      option.on.autoplayStop = function (swiper) {
        if (option.playControl) {
          $(option.playButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.pauseControl) {
          $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
        }

        if (isA11y) {
          $this.attr('aria-live', 'polite');
        }

        callEvent('autoplayStop', swiper);
      };

      option.on.resize = function (swiper) {
        $this.trigger('swiperResize');
        callEvent('resize', swiper);
      };

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).on('click.swiperSet', function () {
            var $this = $(this);

            if ($this.hasClass('is-play')) {
              swiper.autoplay.start();
            } else if ($this.hasClass('is-pause')) {
              swiper.autoplay.stop();
            }
          });
        }

        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid) {
          $slides.removeAttr('aria-label role');
        }
      }
    });
  };

  // file-view
  function fileViewInt($root) {
    if (!$root) {
      $root = $doc;
    }
    $root.find('.file-view').each(function () {
      var $wrap = $(this);
      var $list = $wrap.find('.file-view__list');

      $list.swiperSet({
        nextControl: true,
        prevControl: true,
      });
    });
  }

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.closeTimer = null;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.off();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    off: function () {
      var _ = this;

      if (_.options.event === 'click') {
        _.opener.off('click.uiDropDown' + _.hashCode);
        $doc.off('click.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      } else if (_.options.event === 'hover') {
        _.wrap.off('mouseenter.uiDropDown' + _.hashCode).off('mouseleave.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      }
      $win.off('resize.uiDropDown' + _.hashCode);
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var wrapH = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowH = 0;
      var overflowT = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };
      var isTopAlign = _.options.defaultVertical === 'top';
      var isOverflow = false;
      var isTopOverflow = false;
      var isBottomOverflow = false;

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
          marginRight: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        if (_.options.align === 'right') {
          style.marginLeft = 0;
          style.marginRight = _.options.marginRight;
          _.layer.css({
            left: 'auto',
            right: '0',
          });
        } else if (_.options.align === 'center') {
          _.layer.css({
            left: '50%',
          });
        }

        function setTopPosition() {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        }
        function setBottomPosition() {
          _.wrap.removeClass(_.className.top).addClass(_.className.bottom);
          _.layer.css({
            top: '',
            bottom: '',
          });
          style.marginTop = _.options.marginTop;
          style.marginBottom = 0;
        }

        if (isTopAlign) {
          setTopPosition();
        }

        wrapT = _.wrap.offset().top;
        wrapH = _.wrap.outerHeight();
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        trueLayerW = _.layer.outerWidth();
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = trueLayerW + _.options.marginLeft + _.options.marginRight;

        if (_.options.align === 'center') {
          layerL -= Math.ceil(trueLayerW / 2);
          style.marginLeft = -Math.ceil(trueLayerW / 2);
        }

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        isOverflow = $overflow !== null && $overflow.length;

        if (isOverflow) {
          overflowH = $overflow.height();
          overflowT = $overflow.offset().top;
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        isTopOverflow = wrapT - layerH < (isOverflow ? overflowT : scrollTop);
        isBottomOverflow = isOverflow ? (isTopAlign ? wrapT + wrapH : layerT) + layerH > overflowT + overflowH : (isTopAlign ? wrapT + wrapH : layerT) + layerH - scrollTop > winH;

        if (isTopAlign) {
          if (isTopOverflow && !isBottomOverflow) {
            setBottomPosition();
          } else {
            _.wrap.addClass(_.className.top);
          }
        } else {
          if (isBottomOverflow && !isTopOverflow) {
            setTopPosition();
          } else {
            _.wrap.addClass(_.className.bottom);
          }
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          if (_.options.align === 'right') {
            style.marginRight = Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft -= Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else {
            style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          }
        } else if (overflowL > layerL || (_.options.align === 'center' && overflowL < layerL && layerL - overflowL < _.options.marginLeft)) {
          if (_.options.align === 'right') {
            style.marginRight = -Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft += Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else {
            style.marginLeft = Math.ceil(overflowL - layerL + _.options.marginLeft);
          }
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
    btnClose: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);

        if (userAgentCheck.isAndroid) {
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide);

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.opener.focus();
            _.layer.trigger('uiDropDownClosed');
          }, 10);
        } else if (userAgentCheck.isIos) {
          _.opener.focus();

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
            _.layer.css(_.css.hide).trigger('uiDropDownClosed');
          }, 100);
        } else {
          _.opener.focus();
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide).trigger('uiDropDownClosed');
        }
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      align: 'left',
      defaultVertical: 'bottom',
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'btnClose':
            uiDropDown.btnClose();
            break;
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          case 'on':
            uiDropDown.on();
            break;
          case 'off':
            uiDropDown.off();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $body = $('body');
      $html.css('overflow', 'hidden');
      var beforeW = $body.width();
      $html.css('overflow', 'scroll');
      var afterW = $body.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width) && !$html.hasClass('is-scrollbars-width')) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if (!$html.hasClass(_.className.block)) {
        scrollBlock.scrollTop = $win.scrollTop();
        scrollBlock.scrollLeft = $win.scrollLeft();

        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var hasScrollBlock = true;
      var isFocus = true;
      var isCycleFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $preOpenLayers = $layers.filter('.js-layer-opened').not($layer);
      var notOhterElements = 'script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *, [data-ui-js]';
      var $ohterElements = $('body')
        .find('*')
        .not('[data-layer], [data-layer] *, ' + notOhterElements);
      var $preLayersElements = $preOpenLayers.find('*').not(notOhterElements);

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
        hasScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          return typeof val === 'boolean' ? val : true;
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          return typeof val === 'boolean' ? val : true;
        })();
        isCycleFocus = (function () {
          var val = $layer.data('cycle-focus');
          return typeof val === 'boolean' ? val : true;
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preLayersElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preOpenLayers.attr('aria-hidden', 'true').attr('inert', '').removeAttr('aria-modal');

        if (isCycleFocus && !$layer.children('.js-loop-focus').length) {
          $('<div class="js-loop-focus" tabindex="0"></div>')
            .on('focusin.uiLayer', function () {
              $layer.focus();
            })
            .appendTo($layer);
        }

        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              if (isFocus) {
                $layer.focus();
              }
              $layer.removeClass('js-layer-animated').trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .attr('aria-hidden', 'false')
          .attr('aria-modal', 'true')
          .css('visibility', 'visible')
          .removeAttr('hidden')
          .data('layerIndex', $('.js-layer-opened').length);

        if (hasScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened js-layer-animated').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var $opener = $layer.data('layerOpener');
      var $allOpener = $('[data-layer-open="' + target + '"]');
      var isScrollBlock = $html.hasClass(scrollBlock.className.block);
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        if ($allOpener && $allOpener.length) {
          $allOpener.removeClass('js-layer-opener-active');
        }

        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed js-layer-animated')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
          .removeAttr('aria-modal')
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              var $ohterElements = $('body').find('[data-ui-js="hidden"]');
              var $preOpenLayers = $('[data-layer].js-layer-opened').not($layer);
              var $preOpenLayerHasScrollBlock = $preOpenLayers.not(function () {
                var val = $(this).data('scroll-block');
                return typeof val === 'boolean' ? val : false;
              });
              var preOpenLayersHigherZIndex = (function () {
                var array = [];
                $preOpenLayers.each(function () {
                  var zIndex = $(this).css('z-index');
                  array.push(zIndex);
                });
                array.sort();
                return array[array.length - 1];
              })();
              var $preOpenLayer = $preOpenLayers.filter(function () {
                var zIndex = $(this).css('z-index');

                return zIndex === preOpenLayersHigherZIndex;
              });
              var $preOpenLayerOhterElements = $preOpenLayer.find('[data-ui-js="hidden"]');
              var $openerClosest = null;

              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if ($preOpenLayer.length) {
                $preOpenLayerOhterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
                $preOpenLayer.attr('aria-hidden', 'false').removeAttr('inert').attr('aria-modal', 'true');
              }

              if (!$preOpenLayers.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
              }

              if (!$preOpenLayerHasScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                if ($preOpenLayers.length) {
                  $openerClosest = $opener.closest($preOpenLayers);
                  if ($openerClosest.length && $openerClosest.hasClass('js-layer-opened')) {
                    $opener.focus();
                  }
                } else {
                  $opener.focus();
                }
                $layer.data('layerOpener', null);
              } else {
                $html.attr('tabindex', '0').focus().removeAttr('tabindex');
              }

              $layer.removeClass('js-layer-animated').trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var val = $(this).data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer = $layer.length && !($target.is($layer) && $target.data('layerIndex') === lastIndex) && !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      var isToggle = (function () {
        var val = $this.data('toggle');
        return typeof val === 'boolean' ? val : false;
      })();

      if ($layer.length) {
        if (isToggle && $layer.hasClass('js-layer-opened')) {
          uiLayer.close(layer);
        } else {
          if (isToggle) {
            $this.addClass('js-layer-opener-active');
          }
          uiLayer.open(layer);
          $layer.data('layerOpener', $this);
        }
      }

      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // input disabled class
  function checkDisabledClass($root) {
    if (!$root) {
      $root = $doc;
    }

    var $inputs = $root.find('.ui-input, .ui-select');

    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block, .ui-select-block');
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

  // fixBarSet
  function fixBarSet() {
    var $layoutWrap = $('.layout-wrap');
    var $top = $('.fix-top-wrap');
    var $fakeTop = $('.js-fake-top');
    var $bottom = $('.fix-bottom-wrap');
    var $fakeBottom = $('.js-fake-bottom');
    var topH = 0;
    var bottomH = 0;
    var fakeTopH = 0;
    var fakeBottomH = 0;

    if ($top.length && !$top.is(':hidden')) {
      topH = $top.outerHeight();
      if (!$fakeTop.length) {
        $layoutWrap.prepend('<div class="js-fake-top"></div>');
        $fakeTop = $('.js-fake-top');
      }
      fakeTopH = $fakeTop.height();
      if (!(topH === fakeTopH)) {
        $fakeTop.height(topH);
      }
    } else {
      $('.js-fake-top').css('height', 0);
    }

    if ($bottom.length && !$bottom.is(':hidden')) {
      bottomH = $bottom.outerHeight();
      if (!$fakeBottom.length) {
        $layoutWrap.append('<div class="js-fake-bottom"></div>');
        $fakeBottom = $('.js-fake-bottom');
      }
      fakeBottomH = $fakeBottom.height();
      if (!(bottomH === fakeBottomH)) {
        $fakeBottom.height(bottomH);
      }
    } else {
      $('.js-fake-bottom').css('height', 0);
    }
  }

  // fixBarScroll
  function fixBarScroll() {
    var $fixBar = $('.fix-top-wrap, .fix-bottom-wrap');
    var scrollX = $('#wrap').scrollLeft() || $win.scrollLeft();

    $fixBar.css('margin-left', -scrollX);
  }

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    checkScrollbars();
    fixBarSet();
    checkDisabledClass($root);
    fileViewInt($root);

    $root.find('.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });
    $root.find('.js-ui-dropdown-hover').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
    });

    $root.find('.js-datepicker').each(function () {
      var $this = $(this);

      $this.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });

      var picker = $this.data('datetimepicker');

      $this.off('show.td.uiJSDatepicker').on('show.td.uiJSDatepicker', function () {
        $(picker.display.widget).addClass('ui-datetimepicker-widget');
      });
    });

    $root.find('.js-datepicker-range').each(function () {
      var $this = $(this);
      var $min = $this.find('.js-datepicker-range__min');
      var $max = $this.find('.js-datepicker-range__max');

      if ($min.data('datetimepicker')) return;

      $min.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });
      $max.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });

      var min = $min.data('datetimepicker');
      var max = $max.data('datetimepicker');

      if (max.dates._dates[0]) {
        min.updateOptions({
          restrictions: {
            maxDate: max.dates._dates[0],
          },
        });
        max.updateOptions({
          viewDate: max.dates._dates[0],
        });
      }
      if (min.dates._dates[0]) {
        min.updateOptions({
          viewDate: min.dates._dates[0],
        });
        max.updateOptions({
          restrictions: {
            minDate: min.dates._dates[0],
          },
        });
      }

      $min
        .off('change.td.uiJSDatepickerRange')
        .on('change.td.uiJSDatepickerRange', function (e) {
          if (e.date) {
            max.updateOptions({
              restrictions: {
                minDate: e.date,
              },
            });
          }
        })
        .off('show.td.uiJSDatepickerRange')
        .on('show.td.uiJSDatepickerRange', function () {
          $(min.display.widget).addClass('ui-datetimepicker-widget');
        });
      $max
        .off('change.td.uiJSDatepickerRange')
        .on('change.td.uiJSDatepickerRange', function (e) {
          if (e.date) {
            min.updateOptions({
              restrictions: {
                maxDate: e.date,
              },
            });
          }
        })
        .off('show.td.uiJSDatepickerRange')
        .on('show.td.uiJSDatepickerRange', function () {
          $(max.display.widget).addClass('ui-datetimepicker-widget');
        });
    });

    $root.find('.js-timepicker').each(function () {
      var $this = $(this);

      $this.datetimepicker({
        localization: {
          format: 'HH:mm',
        },
        display: {
          viewMode: 'clock',
          components: {
            decades: false,
            year: false,
            month: false,
            date: false,
            useTwentyfourHour: true,
          },
          theme: 'light',
        },
      });

      var picker = $this.data('datetimepicker');

      $this.off('show.td.uiJSTimepicker').on('show.td.uiJSTimepicker', function () {
        $(picker.display.widget).addClass('ui-datetimepicker-widget ui-datetimepicker-widget--time-only');
      });
    });
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    fixBarSet();
  }
  window.uiJSResize = uiJSResize;

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus').trigger('areaFocusIn');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus').trigger('areaFocusOut');
          }, 100)
        );
      });
  }
  areaFocus('.ui-input-block');
  areaFocus('.js-ui-dropdown');
  areaFocus('.ui-table__input-cell');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc
    .on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.ui-input', function () {
      inputedCheck($(this), '.ui-input-block');
    })
    .on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.header__search-input .ui-input', function () {
      inputedCheck($(this), '.layout-wrap');
    });

  // input delete
  $doc
    .on('focus.inputDelete', 'input.ui-input, textarea.ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block');
      var isNoDelete = $wrap.is('.ui-input-block--no-delete, .ui-input-block--date, .ui-input-block--time, .ui-input-block--cell');
      var type = $this.attr('type') || '';
      var isText = Boolean(type.match(/text|password|search|email|url|number|tel|date|time/)) || $this.is('textarea');
      var $delete = $wrap.find('.ui-input-delete');
      var isDisabled = $this.is('[readonly]') || $this.is('[disabled]');

      if (isText && !isNoDelete) {
        if (!$delete.length && !isDisabled) {
          $wrap.addClass('is-use-delete').append('<button type="button" class="ui-button ui-input-delete"><span class="for-a11y">입력 내용 지우기</span></button>');
          $delete = $wrap.find('.ui-input-delete');
        }

        if (isDisabled) {
          $delete.prop('disabled', true).attr('disabled', '');
        } else {
          $delete.prop('disabled', false).removeAttr('disabled', '');
        }
      }
    })
    .on('click.inputDelete', '.ui-input-delete', function () {
      var $this = $(this);
      var $input = $this.closest('.ui-input-block').find('.ui-input');

      $input.val('').trigger('focus');
    });

  // dropdown
  $doc
    .on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');

      $wrap.uiDropDown('btnClose');
    })
    .on('click.uiJSDropdown', '[data-dropdown-option]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');
      var $watch = $wrap.find('.js-ui-dropdown__watch');
      var text = $this.attr('data-dropdown-option');

      $watch.text(text);

      e.preventDefault();
    });

  // layer opened scroll to start
  function layerOpenedScrollToStart($wrap, target) {
    var $scroller = $wrap.find(target);

    if ($scroller.length) {
      $scroller.scrollTop(0).scrollLeft(0);
    }
  }
  $doc
    .on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
      layerOpenedScrollToStart($(this), '.ui-layer__body');
    })
    .on('uiDropDownOpened.layerOpenedScrollToStart', '.js-ui-dropdown', function () {
      layerOpenedScrollToStart($(this), '.ui-dropdown__contents');
    });

  // replace date value
  $doc
    .on('keyup.replaceDatetimeValue', '.js-datepicker, .js-datepicker-range__min, .js-datepicker-range__max', function () {
      var $this = $(this);
      var val = $this.val();
      var sum = val.replace(/\D/g, '');
      var length = sum.length;
      var picker = $this.data('datetimepicker');
      var isAction = false;

      if (!picker || length < 6) return;

      if (length === 6 && !sum.match(/^20/)) {
        isAction = true;
        sum = sum.replace(/^(\d{2})(\d{2})(\d{2})/, '20$1.$2.$3');
      } else if (length > 6) {
        isAction = true;
        sum = sum.replace(/^(\d{4})(\d{2})(\d{2}).*/, '$1.$2.$3');
      }

      if (val === sum) {
        isAction = false;
      }

      if (!isAction) return;

      var min = picker.optionsStore.options.restrictions.minDate;
      var max = picker.optionsStore.options.restrictions.maxDate;
      var sumDate = picker.dates.parseInput(sum);

      if (max && max < sumDate) {
        sumDate = max;
      } else if (min && min > sumDate) {
        sumDate = min;
      }

      picker.dates.setValue(sumDate);
    })
    .on('keyup.replaceDatetimeValue', '.js-timepicker', function () {
      var $this = $(this);
      var val = $this.val();
      var sum = val.replace(/\D/g, '');
      var length = sum.length;
      var picker = $this.data('datetimepicker');
      var isAction = false;

      if (!picker || length < 4) return;

      if (length >= 4) {
        isAction = true;
        sum = sum.replace(/^(\d{2})(\d{2}).*/, '$1:$2');
      }

      if (val === sum) {
        isAction = false;
      }

      if (!isAction) return;

      var sumTime = picker.dates.parseInput(sum);

      picker.dates.setValue(sumTime);
    });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    scrollbarsWidth.set();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-top-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-bottom-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }

    // init
    uiJSCommon();
    fixBarScroll();

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      uiJSResize();
    })
    .on('scroll.uiJS', function () {
      fixBarScroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      fixBarScroll();
    })
    .on('orientationchange.uiJS', function () {
      uiJSResize();
      fixBarScroll();
    });
})(jQuery);
