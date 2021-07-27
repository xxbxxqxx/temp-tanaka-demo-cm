;(function(global, $, undefined) {


  function drawerMenu() {
    $('.drawer').drawer();
  }


  function colorSchemeText() {
    var $colorText = $('.aigis-colorPalette__label');
    $colorText.each(function(){
      var $target = $(this);
      var code =  $target.text().replace(/#/g, '');
      if(code.length == 3) {
        var cR = code.substring(0,1);
        var cG = code.substring(1,2);
        var cB = code.substring(2,3);
        code = '' + cR + cR + cG + cG + cB + cB;
      }
      var red   = parseInt(code.substring(0,2), 16);
      var green = parseInt(code.substring(2,4), 16);
      var blue  = parseInt(code.substring(4,6), 16);
      // console.log(red + green + blue);
      if( red + green + blue < 381 ) {
        $target.addClass('white');
      }
    });
  }

  function headingIcons() {
    var $iconHeading = $('.sg-module h5');
    $iconHeading.each(function(){
      var $target = $(this);
      var targetText = $target.text();
      if(targetText.indexOf('Example') !== -1) {
        $target.prepend($('<i class="fa fa-code"></i> '));
      } else if(targetText.indexOf('Fixes') !== -1) {
        $target.prepend($('<i class="fa fa-edit"></i> '));
      }
    });
  }

  function wrapContent() {
    var $wrapHeading = $('.sg-module_body > h2');
    $wrapHeading.each(function(){
      $(this).nextUntil('.sg-module_body > h2').wrapAll('<div class="sg-module_inner"></div>');
    });
  }

  function sidemenuFilter(){
    $.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };

    $filter = $('.sg-sidemenu_filterInput');
    $filter.keyup(function() {
      var val = $(this).val();
      if(val.length) {
        $('.sg-sidemenu_inner li').hide();
        $('.sg-sidemenu_inner li:Contains('+ val +')').show();
      } else {
        $('.sg-sidemenu_inner li').show();
      }
    });
  }

  function sourceAccordion() {
    var $preview = $('.sg-preview');
    var $previewCode = $preview.next('pre');
    $previewCode.each( function(){
      var isHTML = $(this).children('code').hasClass('language-html');
      if( isHTML ) {
        $(this).after('<button class="sg-previewSwitch"> code</button>');
        $(this).next('.sg-previewSwitch').on('click', function(){
          $(this).toggleClass('-opened').prev('pre').slideToggle('fast');
        });
      }
    });
  }

  function disabledComponent() {
    // コンテンツエリアのモジュールタイトルを取得
    var $moduleTitle = $(".sg-module_heading");
    // サイドメニューの各コンポーネントのリストを取得
    var $categoryList = $(".sg-categoryList").find("li[data-path-depth='0']");

    // JSONデータの中身を取り出す
    $.getJSON(
      '/_styleguide/styleguide_assets/js/disabledList.json',
      null,
      function (data) {
        var disabledList = data.disabledList;
        var disabledClass = "is-disabled";

        // カテゴリをチェック
        $.each($categoryList, function (i, elem) {
          var $category = $(elem);
          var $categoryAnchor = $category.children("a");
          var $componentList = $category.find("li[data-path-depth='1']");
          var componentLengh = $componentList.length;
          var disabledCnt = 0;

          $.each(disabledList, function (k, val) {
            // カテゴリリストに完全一致するものがあればクラスを付与
            // （Iconなど子コンポーネントを持たないタイプに対応）
            if (elem.innerText === val) {
              $categoryAnchor.addClass(disabledClass);
              $categoryAnchor.attr("tabindex", "-1");
            }
            $.each($componentList, function (j, el) {
              // コンポーネントリストに前方一致するものがあればクラスを付与
              if (!el.innerText.indexOf(val)) {
                var $component = $(el).children("a");
                $component.addClass(disabledClass);
                $component.attr("tabindex", "-1");
                ++disabledCnt;
                // 一致するものを見つけたらループを抜ける
                return false;
              }
            });
          });

          // カテゴリ内のコンポーネントリストすべてがdisabledであれば、親のカテゴリを非活性化
          if (disabledCnt >= componentLengh && componentLengh > 0) {
            $categoryAnchor.addClass(disabledClass);
            $categoryAnchor.attr("tabindex", "-1");
          }
        });

        // コンテンツエリアのモジュールタイトルをチェック
        $.each($moduleTitle, function (i, elem) {
          var $title = $(elem);
          $.each(disabledList, function (k, val) {
            // モジュールのIDと一致したら親ブロックごと非表示
            if (!$title.attr("id").indexOf(val)) {
              $title.parent(".sg-module").css("display", "none");
              return false;
            }
          });
        });

      }
    );
  }

  $(function() {
    drawerMenu();
    colorSchemeText();
    headingIcons();
    wrapContent();
    sidemenuFilter();
    sourceAccordion();
    disabledComponent();
  });


})(typeof window !== 'undefined' ? window : this, jQuery);
