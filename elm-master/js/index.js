$(function(){
$.ajax({
    type:"GET",
    url:"data.json",
    success:function(msg){
      $(".logo").attr("src",msg.seller.avatar);
      $(".text h3 span").html(msg.seller.name);
      $(".timer").html(msg.seller.description+"/"+msg.seller.deliveryTime+"分钟送达");
      $(".discount span").html(msg.seller.supports[0].description);
      $(".notice p").html(msg.seller.bulletin);
      //商品页面的数据导入
      //左边的分类数据导入
      var oli="";
      var divs="";
      for(var i =0;i<msg.goods.length;i++){
        if(i==1){
          oli+="<li class='swiper-slide'><span><a>"+"<img src='img/special_3@2x.png'>"+msg.goods[i].name+"</a></span></li>"
        }else if(i==0){
           oli+="<li class='swiper-slide on'><span>"+msg.goods[i].name+"</span></li>"
        }
        else{
          oli+="<li class='swiper-slide'><span>"+msg.goods[i].name+"</span></li>"
        }
        //  if (i==1) {
        //   oli += "<li class='swiper-slide'><span><a>" +"<img src='images/special_3@2x.png'>" + msg.goods[i].name + "</a></span></li>";
        // }else{
        //   oli += "<li class='swiper-slide'><span>" + msg.goods[i].name + "</span><>";
        // }

         //右边的数据导入
         divs+="<div class='swiper-slide'>"
         divs+="<h4>"+msg.goods[i].name+"</h4>"
         for(var j = 0;j<msg.goods[i].foods.length;j++){
           divs+="<div class='preserved_egg'>";
           divs+="<img src="+msg.goods[i].foods[j].image+">";
           divs+="<div class='mx'>";
           divs+="<p class='txt_one'>"+msg.goods[i].foods[j].name+"</p>";
           divs+="<p class='txt_two'>"+msg.goods[i].foods[j].description+"</p>";
           divs+="<p class='txt_three'>"+"月售"+msg.goods[i].foods[j].sellCount+"份"+"&nbsp;"+"好评率"+msg.goods[i].foods[j].rating+"%"+"</p>";
           divs+="<p class='txt_four'>";
           divs+="<span class='price1'>"+"￥"+msg.goods[i].foods[j].price+"</span>";
           divs+="<span class='price2'>"+"￥"+msg.goods[i].foods[j].oldPrice+"</span>";
           divs+="</p>";
           divs+="</div>";
           divs+="<p class='subtract'>"+"-"+"</p>";
            divs+="<p class='add'>"+"+"+"</p>"
           divs+="</div>"
         }
         divs+="</div>"
      }
      $(".gallery-left ul").append(oli);
      $(".menu").append(divs);

      //评价页面的数据导入
      var users="";
      //星星函数
      function star(score){
        var arr=[];
        var score1 = Math.floor(score*2)/2;
        var zhengshu = Math.floor(score1);
        var xiaoshu = score1 % 1 ==0;
        for(var i=0;i<zhengshu;i++){
          arr.push("star24_on@2x");
        }
        if(xiaoshu == false){
          arr.push("star24_half@2x");
        }
        while(arr.length<5){
          arr.push("star24_off@2x");
        }
        return arr;
      }
      var y=0;

      for(var i=0;i<msg.ratings.length;i++){
        users+="<div class='user-slide'>";
        users+="<div class='user'>";
        users+="<img src="+msg.ratings[i].avatar+">";
        users+="</div>";
        users+="<div class='user_name'>";
        users+="<p class='ju'>"+msg.ratings[i].username+"</p>";
        users+="<a>"+"2016-07-13 20:33"+"</a>"
        var scoreStar = star(msg.ratings[i].score);
        // console.log(scoreStar)
        var a="";
        for(var j=0;j<scoreStar.length;j++){
          a +=("<img src='img/"+scoreStar[j]+".png'>")

        }
        users+="<p class='xin_img'>";
        users+="<img/"+a;

        if(msg.ratings[i].deliveryTime != ""){
          users+="<b>"+msg.ratings[i].deliveryTime+"分钟送达"+"</b>";
        }

        users+="</p>";

        users+="<p class='user_name_txt'>"+msg.ratings[i].text+"</p>";
        users+="<p class='user_name_icon'>";
        if(msg.ratings[i].score<=3){
          users+="<span class='iconfont icon-cai'>"+"</span>";
        }else{
          users+="<span class='iconfont icon-dianzan1'>"+"</span>";
        }
        if(msg.ratings[i].recommend != ""){
          for(var k=0;k<msg.ratings[i].recommend.length;k++){
            users+="<span class='wang'>"+msg.ratings[i].recommend[k]+"</span>";
          }
        }
        users+="</p>";
        users+="</div>"
        users+="</div>";
      }
      $(".user-slide_fu").append(users);
      $(".grade_left h3").html(msg.seller.score);
      $(".grade_left .gao").html("高于周边商家"+msg.seller.rankRate+"%");
      var f=star(4.1);
      console.log(f);
      var a_img="";
      for(var x=0;x<f.length;x++){
         a_img+=("<img src='img/"+f[x]+".png'>");
      }
      $(".herd a").prepend(a_img);
      var g=star(4.3);
      console.log(g);
      var a_img2="";
      for(var y=0;y<g.length;y++){
         a_img2+=("<img src='img/"+g[y]+".png'>");
      }
      $(".herd2 a").prepend(a_img2);
      $(".herd span").html(msg.seller.serviceScore);
      $(".herd2 span").html(msg.seller.foodScore);
      $(".arrive span").html(msg.seller.deliveryTime+"分钟");
       //评价页面的评价分类点击
      $(".appraise .title .all b").html(msg.ratings.length);
      $(".appraise .title .satisfaction").click(function(){
        $(this).addClass('title_color').siblings().removeClass("title_color");
        var satisfaction="";
        var x=0;
        for(var i=0;i<msg.ratings.length;i++){
          if (msg.ratings[i].rateType==0) {
            x++;
            satisfaction+="<div class='user-slide'>";
            satisfaction+="<div class='user'>";
            satisfaction+="<img src="+msg.ratings[i].avatar+">";
            satisfaction+="</div>";
            satisfaction+="<div class='user_name'>";
            satisfaction+="<p class='ju'>"+msg.ratings[i].username+"</p>";
            satisfaction+="<a>"+"2016-07-13 20:33"+"</a>"
            var scoreStar = star(msg.ratings[i].score);
            // console.log(scoreStar)
            var a="";
            for(var j=0;j<scoreStar.length;j++){
              a +=("<img src='img/"+scoreStar[j]+".png'>")

            }
            satisfaction+="<p class='xin_img'>";
            satisfaction+="<img/"+a;

            if(msg.ratings[i].deliveryTime != ""){
              satisfaction+="<b>"+msg.ratings[i].deliveryTime+"分钟送达"+"</b>";
            }

            satisfaction+="</p>";

            satisfaction+="<p class='user_name_txt'>"+msg.ratings[i].text+"</p>";
            satisfaction+="<p class='user_name_icon'>";
            if(msg.ratings[i].score<=3){
              satisfaction+="<span class='iconfont icon-cai'>"+"</span>";
            }else{
              satisfaction+="<span class='iconfont icon-dianzan1'>"+"</span>";
            }
            if(msg.ratings[i].recommend != ""){
              for(var k=0;k<msg.ratings[i].recommend.length;k++){
                satisfaction+="<span class='wang'>"+msg.ratings[i].recommend[k]+"</span>";
              }
            }
            satisfaction+="</p>";
            satisfaction+="</div>"
            satisfaction+="</div>";
          };
        }
        $(".user-slide_fu").html(satisfaction);
        $(".title .satisfaction b").html(x);
      })
      $(".appraise .title .unsatisfaction").click(function(){
        $(this).addClass('title_color').siblings().removeClass("title_color");
        var unsatisfaction="";
        var x=0;
        for(var i=0;i<msg.ratings.length;i++){

          if (msg.ratings[i].rateType!=0) {
            x++;
            unsatisfaction+="<div class='user-slide'>";
            unsatisfaction+="<div class='user'>";
            unsatisfaction+="<img src="+msg.ratings[i].avatar+">";
            unsatisfaction+="</div>";
            unsatisfaction+="<div class='user_name'>";
            unsatisfaction+="<p class='ju'>"+msg.ratings[i].username+"</p>";
            unsatisfaction+="<a>"+"2016-07-13 20:33"+"</a>"
            var scoreStar = star(msg.ratings[i].score);
            // console.log(scoreStar)
            var a="";
            for(var j=0;j<scoreStar.length;j++){
              a +=("<img src='img/"+scoreStar[j]+".png'>")

            }
            unsatisfaction+="<p class='xin_img'>";
            unsatisfaction+="<img/"+a;

            if(msg.ratings[i].deliveryTime != ""){
              unsatisfaction+="<b>"+msg.ratings[i].deliveryTime+"分钟送达"+"</b>";
            }

            unsatisfaction+="</p>";

            unsatisfaction+="<p class='user_name_txt'>"+msg.ratings[i].text+"</p>";
            unsatisfaction+="<p class='user_name_icon'>";
            if(msg.ratings[i].score<=3){
              unsatisfaction+="<span class='iconfont icon-cai'>"+"</span>";
            }else{
              unsatisfaction+="<span class='iconfont icon-dianzan1'>"+"</span>";
            }
            if(msg.ratings[i].recommend != ""){
              for(var k=0;k<msg.ratings[i].recommend.length;k++){
                unsatisfaction+="<span class='wang'>"+msg.ratings[i].recommend[k]+"</span>";
              }
            }
            unsatisfaction+="</p>";
            unsatisfaction+="</div>"
            unsatisfaction+="</div>";
          };
        }
        $(".user-slide_fu").html(unsatisfaction);
        $(".title .unsatisfaction b").html(x);
      })
      $(".appraise .title .all").click(function(){
        $(this).addClass('title_color').siblings().removeClass("title_color");
        var all="";
        var x=0;
        for(var i=0;i<msg.ratings.length;i++){
            x++;
            all+="<div class='user-slide'>";
            all+="<div class='user'>";
            all+="<img src="+msg.ratings[i].avatar+">";
            all+="</div>";
            all+="<div class='user_name'>";
            all+="<p class='ju'>"+msg.ratings[i].username+"</p>";
            all+="<a>"+"2016-07-13 20:33"+"</a>"
            var scoreStar = star(msg.ratings[i].score);
            // console.log(scoreStar)
            var a="";
            for(var j=0;j<scoreStar.length;j++){
              a +=("<img src='img/"+scoreStar[j]+".png'>")

            }
            all+="<p class='xin_img'>";
            all+="<img/"+a;

            if(msg.ratings[i].deliveryTime != ""){
              all+="<b>"+msg.ratings[i].deliveryTime+"分钟送达"+"</b>";
            }

            all+="</p>";

            all+="<p class='user_name_txt'>"+msg.ratings[i].text+"</p>";
            all+="<p class='user_name_icon'>";
            if(msg.ratings[i].score<=3){
              all+="<span class='iconfont icon-cai'>"+"</span>";
            }else{
              all+="<span class='iconfont icon-dianzan1'>"+"</span>";
            }
            if(msg.ratings[i].recommend != ""){
              for(var k=0;k<msg.ratings[i].recommend.length;k++){
                all+="<span class='wang'>"+msg.ratings[i].recommend[k]+"</span>";
              }
            }
            all+="</p>";
            all+="</div>"
            all+="</div>";

        }
        $(".user-slide_fu").html(all);
        $(".title .all b").html(x);
      })
      $(".icon-aixin").click(function(){
        // $(this).css("color","red");
        $(this).toggleClass("icon-aixin_red")
        $(".collect").toggleClass("xiaoguo")
      })
      // 商家页面导入
      $(".xiangfang h3").html(msg.seller.name);
      $(".yue_shou_xing a").prepend(a_img);
      $(".yue_shou_txt").html("月售"+msg.seller.sellCount+"单");
      $(".sb .price_time_price").html(msg.seller.minPrice+"<b>"+"元"+"</b>");
      $(".pei .price_time_price").html(msg.seller.deliveryPrice+"<b>"+"元"+"</b>");
      $(".ping .price_time_price").html(msg.seller.ratingCount+"<b>"+"分"+"</b>");
      $(".notice_activity_txt").html(msg.seller.bulletin);
      $(".zaixian span").html(msg.seller.supports[0].description);
      $(".zhe span").html(msg.seller.supports[1].description);
      $(".se span").html(msg.seller.supports[2].description);
      $(".piao span").html(msg.seller.supports[3].description);
      $(".bao span").html(msg.seller.supports[4].description);
      $(".q").html("<img src="+msg.seller.pics[0]+">");
      $(".w").html("<img src="+msg.seller.pics[1]+">");
      $(".e").html("<img src="+msg.seller.pics[2]+">");
      $(".r").html("<img src="+msg.seller.pics[3]+">");
      $(".gai_shang").html(msg.seller.infos[0]);
      $(".pin_lei").html(msg.seller.infos[1]);
      $(".di_zhi").html(msg.seller.infos[2]);
      $(".ying_ye").html(msg.seller.infos[3]);

      // 商品及优惠数据的导入
      $(".reduced_price_name h3").html(msg.seller.name);
      var h=star(msg.seller.score);
      var h2="";
      for(var y=0;y<h.length;y++){
         h2+=("<img src='img/"+g[y]+".png'>");
      }
      $(".reduced_price_name p").prepend(h2);
      $(".reduced_price_notice p").html(msg.seller.bulletin);



      // $(".user-slide_fus .user-slide .user").html("<img src='"+msg.goods[0].foods[0].ratings[0].avatar+"'>");


      //初始化页面高度
      function starHeight(){
        var sh = $(window).height() - $("header").outerHeight() - $("nav").outerHeight() - $(".footer").outerHeight()*2 + "px";
        $(".goods").css("height",sh);
        // $(".gallery-top").css("height",sh);
        // $(".aaa").css("height",sh);
        $(".appraise").css("height",sh);
         $(".adds").css("height",sh);
        console.log(sh);
      }
      starHeight()
      //实时监听更改页面高度
      $(window).resize(function(){
        starHeight();
      });


      var galleryTop = new Swiper('.gallery-top', {
        direction: 'vertical', //方向垂直
        slidesPerView: 'auto', //显示的数量
        freeMode:true,       //取消自动贴合
        autoHeight:true,
        //  slideToClickedSlide:false, //设置为true则点击slide会过渡到这个slide
        // normalizeSlideIndex:false,

      });

      //右侧食物栏
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        direction: 'vertical', //方向垂直
        slidesPerView: 'auto', //显示的数量
        freeMode:true,       //取消自动贴合
        autoHeight:true,    //右边每个slide的高度都不一样，要加一个这个属性
        on:{//swiper自带的函数
          slideChange:function(){
            var i= this.activeIndex;
            $(".gallery-top ul li").eq(i).addClass('on').siblings().removeClass('on');
            galleryTop.slideTo(i);//右边滑动slide 左边自动跳到对应的slide
          },
        },
      });


      //点击左边的slide  右边跳到对应的slide
      $(".gallery-top ul li").on("click",function(){
        var i = $(this).index();//获取当前点击slide的索引
        $(".gallery-top ul li").eq(i).addClass('on').siblings().removeClass('on');
        galleryThumbs.slideTo(i);//让右边跳到对应的索引
      })

      //商品商家 评价 滑动
      var tabsSwiper = new Swiper('#tabs-container', {
        speed: 500,
        on: {
            slideChangeTransitionStart: function() {
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq(this.activeIndex).addClass('active');
            }
        }
    })
    $(".tabs a").on('click', function(e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo($(this).index())
    })

    // 公告点击
     $(".count,.notice_txt").click(function(){
       $(".reduced_price").fadeIn();
     })
     //×点击
     $(".cha").click(function(){
       $(".reduced_price").fadeOut();
     })
     // 商品详情点击
     $(".preserved_egg>img").click(function(){
    $(".shop_details").fadeIn();
    // $(".shop_details").css("display","block")
    // $("body").addClass('shop_details');
    var x= $(this).parent().index()-1;//获取菜的下标
    var y= $(this).parent().parent().index();
    console.log(y);
    //商品详情导入
    $(".big_img .big_img_img").html("<img src="+msg.goods[y].foods[x].image+">")
    $(".foods_title .txt_one").html(msg.goods[y].foods[x].name);
    $(".foods_title .txt_three").html("月售"+msg.goods[y].foods[x].sellCount+"份"+"好评率"+msg.goods[y].foods[x].rating+"%");
    $(".foods_title .txt_four .price1").html("￥"+msg.goods[y].foods[x].price);
    if(msg.goods[y].foods[x].oldPrice != ""){
      $(".foods_title .txt_four .price2").html("￥"+msg.goods[y].foods[x].oldPrice);
    }
      var details="";
      for(var s =0;s<msg.goods[y].foods[x].ratings.length;s++){
        details+="<div class='user-slide'>";
        details+="<div class='user'>";
        details+="<img src="+msg.goods[y].foods[x].ratings[s].avatar+">";
        details+="</div>";

        details+="<div class='user_name'>";
        details+="<p class='ju'>"+msg.goods[y].foods[x].ratings[s].username+"</p>";
        details+="<b>"+"2016-07-13 20:33"+"</b>"
        details+="<p class='user_name_txt'>"+msg.goods[y].foods[x].ratings[s].text+"</p>";
        details+="<p class='user_name_icon'>";
        if(msg.goods[y].foods[x].ratings[s].rateType!==0){
          details+="<span class='iconfont icon-cai'></span>";
        }else{
          details+="<span class='iconfont icon-dianzan1'></span>";
        }
        details+="</p>";
        details+="</div>"


        details+="</div>";
      }
      $(".user-slide_fus").html(details);
     })
     $(".shop_details_cha").click(function(){
       $(".shop_details").fadeOut()
     })


      //商家实景
     var commentSwiper = new Swiper(".merchants_lives",{
      freeMode:true,
      slidesPerView:'auto',
     })
    }
})
})






