/* =========================================================
   Car Shop Glory - main.js
   ========================================================= */
(function(){
  'use strict';

  /* ---------- year ---------- */
  var y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();

  /* ---------- header scroll state ---------- */
  var header=document.getElementById('siteHeader');
  window.addEventListener('scroll',function(){
    if(header) header.classList.toggle('scrolled',window.scrollY>20);
  },{passive:true});

  /* ---------- mobile nav ---------- */
  var toggle=document.getElementById('navToggle');
  var gnav=document.getElementById('gnav');
  if(toggle&&gnav){
    toggle.addEventListener('click',function(){gnav.classList.toggle('open');});
    gnav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){gnav.classList.remove('open');});
    });
  }

  /* ---------- 買取実績データ（イメージ。実データに差し替え可） ---------- */
  var results=[
    {img:'g-ferrari-f12.jpg', diff:'+320',pref:'愛知県',car:'フェラーリ F12ベルリネッタ',year:'2015',km:'21,000',when:'2025年8月'},
    {img:'g-lambo-huracan.jpg',diff:'+280',pref:'東京都',car:'ランボルギーニ ウラカン EVO',year:'2020',km:'12,000',when:'2025年7月'},
    {img:'g-porsche-gt3.jpg',  diff:'+240',pref:'大阪府',car:'ポルシェ 911 GT3 RS (991後期)',year:'2019',km:'9,500',when:'2025年6月'},
    {img:'g-mclaren-720.jpg',  diff:'+210',pref:'福岡県',car:'マクラーレン 720S',year:'2018',km:'16,000',when:'2025年5月'},
    {img:'g-ferrari-458.jpg',  diff:'+190',pref:'神奈川県',car:'フェラーリ 458 スパイダー',year:'2013',km:'27,000',when:'2025年5月'},
    {img:'g-aston-db11.jpg',   diff:'+120',pref:'兵庫県',car:'アストンマーティン DB11',year:'2019',km:'18,000',when:'2025年4月'},
    {img:'g-mclaren-570.jpg',  diff:'+150',pref:'埼玉県',car:'マクラーレン 570S',year:'2017',km:'22,000',when:'2025年4月'},
    {img:'g-corvette-c8.jpg',  diff:'+90', pref:'千葉県',car:'シボレー コルベット C8 スティングレイ',year:'2021',km:'14,000',when:'2025年3月'}
  ];

  var track=document.getElementById('galleryTrack');
  if(track){
    var html='';
    results.forEach(function(r){
      html+='<article class="result-card">'
        +'<div class="rc-media">'
          +'<div class="rc-badge"><small>他社査定より</small><b>'+r.diff+'<sup>万円</sup></b><span>買取UP</span></div>'
          +'<div class="rc-pref">'+r.pref+'のお客様</div>'
          +'<img class="rc-img" src="images/'+r.img+'" alt="'+r.car+'" loading="lazy">'
        +'</div>'
        +'<div class="rc-body">'
          +'<p class="rc-car">'+r.car+'</p>'
          +'<dl class="rc-spec">'
            +'<div><dt>年式</dt><dd>'+r.year+'</dd></div>'
            +'<div><dt>走行距離</dt><dd>'+r.km+'km</dd></div>'
            +'<div><dt>買取時期</dt><dd>'+r.when+'</dd></div>'
          +'</dl>'
        +'</div>'
      +'</article>';
    });
    track.innerHTML=html;
  }

  /* ---------- gallery carousel ---------- */
  (function(){
    if(!track) return;
    var cards=track.children;
    var dotsWrap=document.getElementById('gDots');
    var prev=document.querySelector('.g-prev');
    var next=document.querySelector('.g-next');
    var index=0;

    function perView(){
      if(window.innerWidth<=640) return 1;
      if(window.innerWidth<=900) return 2;
      return 3;
    }
    function pages(){return Math.max(1,Math.ceil(cards.length/perView()));}

    function buildDots(){
      if(!dotsWrap) return;
      dotsWrap.innerHTML='';
      for(var i=0;i<pages();i++){
        var b=document.createElement('button');
        b.setAttribute('aria-label','ページ'+(i+1));
        (function(i){b.addEventListener('click',function(){index=i;render();});})(i);
        dotsWrap.appendChild(b);
      }
    }
    function render(){
      var pv=perView();
      if(index>pages()-1) index=pages()-1;
      if(index<0) index=0;
      var card=cards[0];
      if(!card) return;
      var step=card.getBoundingClientRect().width+20;
      track.style.transform='translateX(-'+(index*step*pv)+'px)';
      if(dotsWrap){
        Array.prototype.forEach.call(dotsWrap.children,function(d,i){
          d.classList.toggle('active',i===index);
        });
      }
    }
    if(next) next.addEventListener('click',function(){index=(index+1)%pages();render();});
    if(prev) prev.addEventListener('click',function(){index=(index-1+pages())%pages();render();});

    var auto=setInterval(function(){index=(index+1)%pages();render();},5000);
    track.parentElement.addEventListener('mouseenter',function(){clearInterval(auto);});

    var rt;
    window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){buildDots();render();},200);});
    buildDots();render();
  })();

  /* ---------- scroll reveal ---------- */
  var revealTargets=document.querySelectorAll('.section-head, .brand-card, .neo-banner, .result-card, .reason-item, .voice-card, .flow-step, .company-table, .assess-form');
  revealTargets.forEach(function(el){el.classList.add('reveal');});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:0.12});
    revealTargets.forEach(function(el){io.observe(el);});
  }else{
    revealTargets.forEach(function(el){el.classList.add('in');});
  }

  /* ---------- number count-up ---------- */
  function animateNum(el){
    var target=parseFloat(el.dataset.target);
    var dec=parseInt(el.dataset.decimal||'0',10);
    var dur=1600,start=null;
    function tick(ts){
      if(!start) start=ts;
      var p=Math.min((ts-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      var val=target*eased;
      el.textContent=dec?val.toFixed(dec):Math.floor(val).toLocaleString();
      if(p<1) requestAnimationFrame(tick);
      else el.textContent=dec?target.toFixed(dec):target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  var numEls=document.querySelectorAll('.odometer,.reveal-num');
  if('IntersectionObserver' in window){
    var nio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){animateNum(e.target);nio.unobserve(e.target);}
      });
    },{threshold:0.6});
    numEls.forEach(function(el){nio.observe(el);});
  }else{
    numEls.forEach(function(el){el.textContent=el.dataset.target;});
  }

  /* ---------- form (UI only → LINE誘導) ---------- */
  var form=document.getElementById('assessForm');
  var status=document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      if(status){
        status.hidden=false;
        status.innerHTML='お申し込みありがとうございます。担当バイヤーより追ってご連絡いたします。<br>お急ぎの方は公式LINEからも受け付けております。';
        status.scrollIntoView({behavior:'smooth',block:'center'});
      }
      form.reset();
    });
  }
})();
