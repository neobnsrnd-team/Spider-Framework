function _tabs(n) {
    var html = '';
    for (var i = 1; i <= n; i++) {
        html += '\t';
    }
    return '\n' + html;
}

// source: https: //stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code
function _path() {
    var scripts = document.querySelectorAll('script[src]');
    var currentScript = scripts[scripts.length - 1].src;
    var currentScriptChunks = currentScript.split('/');
    var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
    return currentScript.replace(currentScriptFile, '');
}
var _snippets_path = _path();

var data_basic = {
    'snippets': [

        // IBK 금융 컴포넌트는 우측 ComponentPanel(금융 컴포넌트 탭)에서 제공합니다.
        // ── 일반 기본 블록 ─────────────────────────────────────────────────


		{
		    'thumbnail': 'preview/basic-03.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<h1>제목 텍스트를 입력하세요.</h1>
            <p>고객님의 소중한 자산을 안전하게 관리합니다. 최적의 금융 서비스를 통해 더 나은 미래를 설계하세요. 신뢰할 수 있는 파트너로서 항상 곁에 있겠습니다.</p>
			`	
		},
		{
		    'thumbnail': 'preview/basic-05.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<img src="assets/minimalist-blocks/images/ai-4fA9e.jpg" alt="">
			`	
		},
		{
		    'thumbnail': 'preview/basic-06.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column half">
						<p>디지털 금융의 새로운 기준을 제시합니다. 편리하고 안전한 금융 서비스로 고객의 일상에 가치를 더합니다.</p>
				</div>
				<div class="column half">
						<p>혁신적인 기술과 전문성을 바탕으로 최고의 금융 솔루션을 제공합니다. 고객 중심의 서비스로 신뢰를 쌓아갑니다.</p>
				</div>

			</div>
			`	
		},


        /* PLUGINS */
        {
		    'thumbnail': 'preview/plugin-gallery-01.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column">
        <div data-cb-type="media-grid" data-cb-columns="3" class="grid-sortable" data-cb-gap="16" data-cb-rounded="8" data-cb-content-theme="light">
            <div class="gallery-item">
                <img src="assets/minimalist-blocks/images/ai-MILpb.jpg" alt="샘플 제목">
                <div class="item-content">

                    <h4>샘플 제목</h4>
                    <div>간단한 설명이 들어갑니다</div>
                </div>
            </div>
            <div class="gallery-item">
                <img src="assets/minimalist-blocks/images/ai-2JkRP.jpg" alt="샘플 제목">

            </div>
            <div class="gallery-item">
                <img src="assets/minimalist-blocks/images/ai-4mQ3H.jpg" alt="샘플 제목">
                <div class="item-content">

                    <h4>샘플 제목</h4>
                    <div>간단한 설명이 들어갑니다</div>
                </div>
            </div>
            <div class="gallery-item">
                <img src="assets/minimalist-blocks/images/ai-j6Oyc.jpg" alt="샘플 제목">
                <div class="item-content">

                    <h4>샘플 제목</h4>
                    <div>간단한 설명이 들어갑니다</div>
                </div>
            </div>
            <div class="gallery-item"><img src="assets/minimalist-blocks/images/ai-lMoX0.jpg" alt=""></div>
            <div class="gallery-item"><img src="assets/minimalist-blocks/images/ai-xPlfu.jpg" alt=""></div>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-12.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column half" style="width: 57.6087%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-4DbMv.jpg" alt=""></div>
    <div class="column half flex justify-center flex-col items-center" style="width: 100%;">
        <p>고객 맞춤형 자산관리 서비스를 제공합니다. 체계적인 포트폴리오 분석으로 안정적인 수익을 추구합니다.</p>
    </div>
</div>
			`
		},
		{
		    'thumbnail': 'preview/basic-textslider.png',
		    'category': '120',
		    'viewMode': 'web',
			'type': 'glide',
		    'html': `
			<div class="row">
                    <div 
						class="column full is-dark-text" 
						data-noedit 
						data-module="text-slider" 
						data-module-desc="Text Slider" 
						data-dialog-width="1000px" 
						data-dialog-height="570px" 
						data-html="

							${encodeURIComponent(`

							<div id="_style_{id}" style="display:none">
                                #{id} .glide__arrow svg {
                                    fill: #000 !important;
                                }
								.plr { padding-left:40px;padding-right:40px; }
								.plr .glide__arrow--left { left:-70px !important; }
								.plr .glide__arrow--right { right:-70px !important;  }
			
								.pb { padding-bottom:40px; }
								.pb .glide__bullets { bottom:-20px }
			
								@media all and (max-width: 760px) {
									.plr { padding-left:0;padding-right:0; }
									.plr.m-arrows { padding-left:40px;padding-right:40px; }
			
									.pb { padding-bottom:30px; }
									.pb .glide__bullets { bottom:-15px }
								}
							</div>
							<div class="plr">
								<div id="{id}" class="glide" style="display:none">
									<div data-glide-el="track" class="glide__track">
										<div class="glide__slides space-x-3">
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">항목 1</h3>
													<p>스마트 뱅킹으로 언제 어디서나 편리하게 금융 서비스를 이용하세요. 계좌 조회부터 이체까지 한 번에 해결할 수 있습니다.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">항목 2</h3>
													<p>맞춤형 금융 상품으로 고객님의 자산을 효과적으로 운용합니다. 전문가의 분석과 조언으로 최적의 투자 전략을 세워드립니다.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">항목 3</h3>
													<p>안전한 보안 시스템으로 고객님의 금융 정보를 철저히 보호합니다. 최신 암호화 기술을 적용하여 안심하고 거래하실 수 있습니다.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">항목 4</h3>
													<p>글로벌 금융 네트워크를 통해 해외 송금과 환전 서비스를 빠르고 정확하게 처리합니다. 합리적인 수수료로 편리하게 이용하세요.</p>
												</div>
											</div>
										</div>
									</div>
								
									<div class="glide__arrows" data-glide-el="controls">
										<button class="glide__arrow glide__arrow--left" data-glide-dir="<" style="left:-60px">
											<svg class="is-icon-flex">
												<use xlink:href="#ion-ios-arrow-left"></use>
											</svg>
										</button>
										<button class="glide__arrow glide__arrow--right" data-glide-dir=">" style="right:-60px">
											<svg class="is-icon-flex">
												<use xlink:href="#ion-ios-arrow-right"></use>
											</svg>
										</button>
									</div>
								</div>
							</div>
							
							<script>
								var css = document.querySelector('#_style_{id}').innerHTML;
								var head = document.getElementsByTagName('head')[0];
								var s = document.createElement('style');
								s.appendChild(document.createTextNode(css));
								head.appendChild(s);
				
								var svgDef = '<svg width="0" height="0" style="position:absolute;display:none;">' +
									'<defs>' +
										'<symbol viewBox="0 0 512 512" id="ion-ios-arrow-left">' +
											'<path d="M352 115.4L331.3 96 160 256l171.3 160 20.7-19.3L201.5 256z"></path>' +
										'</symbol>' +
										'<symbol viewBox="0 0 512 512" id="ion-ios-arrow-right">' +
											'<path d="M160 115.4L180.7 96 352 256 180.7 416 160 396.7 310.5 256z"></path>' +
										'</symbol>' +
									'</defs>' +
								'</svg>';
								var pre = document.querySelector('#ion-ios-arrow-left');
								if(!pre) {
									document.body.insertAdjacentHTML('beforeend', svgDef);
								}
								
								var docReady = function(fn) {
									var stateCheck = setInterval(function() {
										if (document.readyState !== 'complete') return;
										clearInterval(stateCheck);
										try {
											fn()
										} catch (e) {}
									}, 1);
								};
								docReady(function() {

									let myslider = document.querySelector("#{id}");

									let swap = true;
									if(myslider.closest('.is-edit')) swap=false;

                                    setTimeout(()=>{

                                        myslider.style.display = '';
                                        var _{id} = new Glide('#{id}', {
                                            type: 'carousel',
                                            autoplay: false,
                                            animationDuration: 1000,
                                            gap: 40,
                                            perView: 2,
                                            hoverpause: true,
                                            arrow: true,
                                            dots: false,
                                            breakpoints: {
                                                760: { perView: 1, gap: 0 }
                                            },
                                            swipeThreshold: swap, dragThreshold: swap
                                        }).mount();
                                        _cleanClonedItems();

                                    }, 400);
								});
							
                                function _cleanClonedItems() {
                                    var clones = document.querySelectorAll(".glide__slide--clone");
                                    Array.prototype.forEach.call(clones, function(clone){
                                        try {
                                            clone.removeAttribute("data-subblock");
                                            clone.childNodes[0].removeAttribute("data-subblock");
                                        } catch(e) {}
                                    });
                                }
							</script>
							
							`)}

                        "

						data-settings="

							${encodeURIComponent('' +
							'{' +
								'"type": "carousel",' +
								'"autoplay":false,' +
								'"animationDuration":1000,' +
								'"gap":40,' +
								'"perView":2,' +
								'"hoverpause":true,' +
								'"arrow":true,' +
								'"arrowColor": "#000",' +
								'"dots":false,' +
								'"fit":""' +
							'}')}

						">

                    </div>
                </div>`	
		},
		{
		    'thumbnail': 'preview/ai-B2h6J.webp',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<video style="width: 100%;" loop="" autoplay="">
				<source src="assets/minimalist-blocks/images/ai-cQ5ST.mp4" type="video/mp4">
			</video>
			`	
		},
		{
		    'thumbnail': 'preview/basic-slider2.png', // 'preview/basic-slider.webp',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
				<div data-cb-type="swiper-slider" data-cb-loading="fade" data-cb-effect="slide" data-cb-aspect-ratio="16/9" data-cb-autoplay="false" data-cb-loop="true" data-cb-slides-per-view="1" data-cb-speed="800" data-cb-space-between="0" data-cb-navigation="true" data-cb-pagination="true" data-cb-delay="3000" data-cb-text-position="position-bottom-left" style="--top-overlay-opacity: 0; --bottom-overlay-opacity: 0.4; --aspect-ratio: 16/9; --slider-height: 600px; --accent-color: #1a1a1a; --slide-background: #ffffff; --border-radius: 10px; --swiper-navigation-border-radius: 50%; --zoom-scale: 1.08; --swiper-navigation-size: 48px; --swiper-navigation-font-size: 16px; --swiper-navigation-sides-offset: 20px; --text-max-width: 400px;" data-cb-top-overlay-opacity="0" data-cb-bottom-overlay-opacity="0.4" data-cb-transition-speed="800" data-cb-navigation-style="solid" data-cb-pagination-style="rounded-rectangle" data-layout="split" data-cb-rounded-corners="10" data-cb-navigation-rounded-corners="50" data-cb-zoom-scale="108" data-cb-zoom-effect="false" data-cb-pause-on-hover="false" data-cb-navigation-button-size="48" data-cb-navigation-arrow-size="16" data-cb-navigation-offset="20" data-cb-text-max-width="400">
                    <div class="swiper">
                        <div class="swiper-wrapper">

                            <div class="swiper-slide">
                                <div class="slide-image is-inview"><video autoplay="" loop="" muted="" playsinline="" data-src-desktop="assets/minimalist-blocks/images/ai-xuSLh.mp4">
                                        <source src="assets/minimalist-blocks/images/ai-xuSLh.mp4" type="video/mp4">
                                    </video></div>
                            </div>
                            <div class="swiper-slide">
                                <div class="slide-image">
                                    <img src="assets/minimalist-blocks/images/ai-mQEub.jpg" alt="새 슬라이드">
                                    <div class="slide-overlay"></div>
                                    <div class="slide-caption">
                                        <div class="is-subblock edit">
                                            <h3 class="slide-caption-title">시대를 초월한 우아함을 발견하세요</h3>
                                            <p class="slide-caption-description">미니멀한 디자인과 탁월한 장인정신이 조화를 이룬 최신 컬렉션을 경험해보세요.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                </div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-18.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column third">
					<h2 class="size-48">01</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">1단계</h3>
					<p>고객의 요구사항을 분석하고 최적의 솔루션을 설계합니다.</p>
				</div>
				<div class="column third">
					<h2 class="size-48">02</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">2단계</h3>
					<p>전문 팀이 체계적인 프로세스로 서비스를 구현합니다.</p>
				</div>
				<div class="column third">
					<h2 class="size-48">03</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">3단계</h3>
					<p>지속적인 모니터링과 개선으로 최상의 결과를 보장합니다.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-20.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': '<hr>'
		},
		{
		    'thumbnail': 'preview/basic-youtube.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
				<div class="embed-responsive embed-responsive-16by9">
            		<iframe width="560" height="315" src="https://www.youtube.com/embed/TSxZRHwZam8?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            	</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-map.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
				<div class="embed-responsive embed-responsive-16by9">
					<iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="mg1" src="https://maps.google.com/maps?q=Melbourne,+Victoria,+Australia&amp;hl=en&amp;sll=-7.981898,112.626504&amp;sspn=0.009084,0.016512&amp;oq=melbourne&amp;hnear=Melbourne+Victoria,+Australia&amp;t=m&amp;z=10&amp;output=embed"></iframe>
				</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-audio.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
				<div style="display:flex;width:100%;position:relative;margin:15px 0;background: transparent;">
					<audio controls="" style="width:100%">
						<source src="assets/minimalist-blocks/example.mp3" type="audio/mpeg">
						브라우저에서 오디오를 지원하지 않습니다.
					</audio>
				</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-form.png',
		    'category': '120',
		    'viewMode': 'web',
			'type': 'form',
		    'html': `
				<div class="row">
                    <div class="column" data-noedit 
                    data-dialog-width="1600px" 
                    data-dialog-height="85vh" 
                    data-module="form-builder" 
                    data-module-desc="Form Builder" 
                    data-html="

							${encodeURIComponent(`
                            <div id="_style_{id}" style="display:none">
                                #{id} {
                                    transition: all 0.3s ease-out;
                                    height: auto;
                                }
                                #{id}.collapsed {
                                    overflow: hidden;
                                    height: 0;
                                }
                                #status_{id} {
                                    transition: all 0.3s ease-out;
                                    height: auto;
                                }
                                #status_{id}.collapsed {
                                    overflow: hidden;
                                    height: 0;
                                }
                            </div>
                            <form id="form_{id}" method="POST" action="/formsubmission" style="padding: 25px 0 20px">
                                <div id="{id}"></div>

                                <div id="status_{id}" class="collapsed"></div>
                            </form>
                            
                            <script>
                            var css = document.querySelector('#_style_{id}').innerHTML;
                            var head = document.getElementsByTagName('head')[0];
                            var s = document.createElement('style');
                            s.appendChild(document.createTextNode(css));
                            head.appendChild(s);
                            
                            var docReady = function(fn) {
                                var stateCheck = setInterval(function() {
                                    if (document.readyState !== "complete") return;
                                    clearInterval(stateCheck);
                                    try {
                                        fn()
                                    } catch (e) {}
                                }, 1);
                            };
                  
                            docReady(function() {
                    
                                var elm = document.getElementById('{id}');
                                var viewer = new FormViewer(elm);

                                let json = {
    "title": "멋진 것을 함께 만들어봐요!",
    "description": "쉽고 빠르게 창의력을 발휘하세요.",
    "elements": [
        {
            "title": "이름:",
            "name": "your_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "이름을 입력하세요"
        },
        {
            "title": "이메일:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "이메일을 입력하세요"
        }
    ],
    "useSubmitButton": true,
    "submitText": "시작하기!"
};
                                
                                const initialFormData = JSON.stringify(json);
                                viewer.view(initialFormData); 

                                var statusInfo = document.querySelector('#status_{id}');

                                var form = document.querySelector('#form_{id}');

                                async function handleSubmit(event) {
                                    event.preventDefault();

                                    var btnSend = form.querySelector('.btn-submitform');
                                    
                                    btnSend.innerHTML = '<span class="loading-icon"><svg class="animate-spin" style="margin-right:7px;width:20px;height:20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>제출';

                                    var data = new FormData(form);

                                    fetch(form.action, {
                                        method: form.method,
                                        body: data,
                                        headers: {
                                            'Accept': 'application/json'
                                        }
                                    })
                                    .then(response=>response.json())
                                    .then(data=>{
                                        if(!data.error) {
                                            statusInfo.innerHTML = '<div class="text-center pt-4 pb-4"><i class="bi bi-send-check size-64"></i>' +
                                            '</div><div class="leading-14 text-center size-38 pb-4">제출해 주셔서 감사합니다!</div>';
                                            form.reset();

                                            elm.classList.add('collapsed');
                                            setTimeout(function(){
                                                statusInfo.classList.remove('collapsed');
                                            },300);

                                        } else {
                                            statusInfo.innerHTML = '<div class="leading-14 text-center size-38 pt-4 pb-4">죄송합니다. 제출 중 문제가 발생했습니다.</div>';
                                        
                                            // elm.classList.toggle('collapsed');
                                            setTimeout(function(){
                                                // statusInfo.innerHTML = data.error;
                                                statusInfo.classList.remove('collapsed');
                                            },300);
                                        }

                                        btnSend.innerHTML = '제출';
                                    });
                                }

                                form.addEventListener('submit', handleSubmit);
                          
                            });
                            </script>					
							
							`)}

                        " 
						
						data-settings="

							${encodeURIComponent(`
                            {
                              "json": {
    "title": "멋진 것을 함께 만들어봐요!",
    "description": "쉽고 빠르게 창의력을 발휘하세요.",
    "elements": [
        {
            "title": "이름:",
            "name": "your_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "이름을 입력하세요"
        },
        {
            "title": "이메일:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "이메일을 입력하세요"
        }
    ],
    "useSubmitButton": true,
    "submitText": "시작하기!"
},
                                "thankYouMessage": "제출해 주셔서 감사합니다!",
                                "errorMessage": "죄송합니다. 제출 중 문제가 발생했습니다.",
                                "buttonText": "제출",
                                "hideHeader": false,
                                "formAction": "/formsubmission"
                            }
                          `)}
						
						">

                    </div>
                </div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-code.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full" data-noedit data-html="

					${encodeURIComponent(`<h1 id="{id}">안녕하세요</h1>
						<p>커스텀 코드 블록입니다. 편집하려면 블록을 선택하고 설정 버튼을 클릭하세요.</p>
						<script>
						var docReady = function (fn) {
							var stateCheck = setInterval(function () {
								if (document.readyState !== "complete") return;
								clearInterval(stateCheck);
								try{fn()}catch(e){}
							}, 1);
						};
						docReady(function() {
							document.querySelector(\'#{id}\').innerHTML =\'<b>코드 블록</b>\';
						});
						</script>`)}

				">

				</div>
			</div>
			`	
		},

		/* Article */
		{
		    'thumbnail': 'preview/article-01.png',
		    'category': '118',
		    'viewMode': 'web',
		    'html': `
			<div class="row">

				<div class="column full">
					<h1 class="text-center leading-none size-64 font-extralight">진심을 담아</h1>
					<div class="spacer height-20"></div>
					<p class="text-center uppercase tracking-125 size-14" style="color: rgb(102, 102, 102);">김지은 에디터</p>
				</div>
			</div>

			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="flex flex-col justify-center column full">
					<p>금융의 본질은 신뢰입니다. 오랜 시간 축적된 경험과 전문성을 바탕으로 고객 한 분 한 분께 최선의 서비스를 제공하고자 합니다.&nbsp;</p>
					<p>변화하는 시대 속에서도 변하지 않는 가치를 지키며, 고객과 함께 성장하는 금융 파트너가 되겠습니다. 새로운 도전과 혁신을 통해 더 나은 금융 환경을 만들어 나가겠습니다.&nbsp;<br></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-03.png',
		    'category': '118',
		    'viewMode': 'web',
		    'html': `
<div class="row relative sm-items-1">
    <div class="py-6 flex flex-col justify-center column third">
        <h1 class="leading-none size-28 font-normal">새로운 여정, 위대한 발견.</h1>
        <div class="spacer height-20"></div>
        <p>다양한 금융 상품과 서비스를 통해 고객님의 꿈을 현실로 만들어 드립니다. 전문 컨설턴트가 맞춤형 재무 설계를 도와드립니다.</p>
    </div>
    <div class="flex flex-col justify-center items-center column two-third"><img src="assets/minimalist-blocks/images/ai-EiDeP.jpg" alt=""></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-15.png',
		    'category': '118',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-35 font-normal">높이 비상하다</h1>
					<p style="border-bottom: 2px solid #e74c3c; width: 60px; display: inline-block;"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<p class="text-justify">디지털 전환 시대에 맞춰 금융 서비스의 혁신을 이끌어갑니다. 인공지능과 빅데이터 기술을 활용한 맞춤형 서비스로 고객 경험을 한 차원 높였습니다.</p>
					<p class="text-justify">모바일 뱅킹부터 자산관리까지, 모든 금융 서비스를 하나의 플랫폼에서 편리하게 이용하실 수 있습니다.</p>
				</div>
				<div class="column half">
					<p class="text-justify">글로벌 시장에서의 풍부한 경험을 바탕으로 국내외 투자 기회를 발굴합니다. 리스크 관리 전문가가 안정적인 수익 창출을 지원합니다.</p>
					<p class="text-justify">지속 가능한 금융을 위해 ESG 경영을 실천하며, 사회적 가치와 경제적 성과를 함께 추구합니다.</p>
				</div>
			</div>
			`	
		},

		/* Headline */
		{
		    'thumbnail': 'preview/headline-01.png',
		    'category': '101',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-42 is-title4-48 inline-block tracking-125">놀라운 경험</h1>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-02.png',
		    'category': '101',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<i class="icon ion-coffee leading-none size-60"></i>
					<h1 class="font-medium size-54">카페 &amp; 비스트로</h1>
					<p><span class="italic">특별한 순간을 위한 공간</span></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-05.png',
		    'category': '101',
		    'viewMode': 'web',
		    'html': `
			<div class="row clearfix">
				<div class="column full">
					<h1 class="normal-case tracking-tight text-center font-normal size-64 leading-11">위대한 것은 복잡할 필요가 없습니다.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide" style="background-color: rgb(240, 240, 240);">서비스 안내</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">문의하기</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-17.png',
		    'category': '101',
		    'viewMode': 'web',
		    'html': `
<div class="row relative sm-items-1">
    <div class="column half" style="width: 42.1053%; flex: 0 0 auto;">
        <div class="spacer height-40"></div>
        <h1 class="tracking-wide leading-none font-medium size-48">아름답게 만들어보세요</h1>
        <div class="spacer height-20"></div>
        <p>직관적인 도구로 누구나 쉽게 멋진 결과물을 만들 수 있습니다.</p>
        <div class="spacer height-20"></div>

        <div class="button-group">
            <a href="#preview" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">미리보기</a>
            <a href="#buynow" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 text-black leading-14 rounded-full border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">지금 구매</a>
        </div>
    </div>
    <div style="position: relative; width: 100%;" class="flex flex-col justify-center column half">
        <div class="is-dock">
            <div style="width: 90%;left: 15%;top: 19%;min-width:400px">

                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-9Prvh.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(130px);" data-center-top="transform: translateX(0px);" data-50-top="transform: translateX(0px);" data-top-bottom="transform: translateX(125px);" data-filename="ai-xG2F8-editSVxYrFy.png">
            </div>
            <div style="width: 92%;left: 41%;top: 41%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-IZAg5.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(100px);" data-center-top="transform: translateX(0px);" data-50-top="transform: translateX(0px);" data-top-bottom="transform: translateX(100px);" data-filename="ai-iiPhS-editHBnPc8L.png">
            </div>
        </div>
    </div>
</div>
			`	
		},

		/* Buttons */
		{
		    'thumbnail': 'preview/buttons-02.png',
		    'category': '119',
		    'viewMode': 'web',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed" title="">시작하기</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-8 border-current hover:border-current font-normal leading-relaxed rounded-none size-15 tracking-widest" title="">미리보기</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-04.png',
		    'category': '119',
		    'viewMode': 'web',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mt-2 mb-1 py-2 size-18 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide underline px-2 ml-3 mr-3" data-bg="">더 알아보기</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">시작하기</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-06.png',
		    'category': '119',
		    'viewMode': 'web',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 font-normal leading-relaxed border-transparent rounded-full size-18 tracking-wide hover:border-transparent" style="color: rgb(255, 255, 255); background-color: rgb(0, 0, 0);" data-bg="rgb(0,0,0)">미리보기</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">지금 구매</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-07.png',
		    'category': '119',
		    'viewMode': 'web',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal size-14 uppercase tracking-125" title="" style="background-color: rgb(240, 240, 240);">상담 예약</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full size-14 uppercase tracking-125" title=""><i class="icon ion-android-arrow-dropright"></i>&nbsp; 서비스 안내</a>
			</div>
			`	
		},

		/* Photos */
		{
		    'thumbnail': 'preview/photos-01.png',
		    'category': '102',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-XUe84.jpg" alt="" style="margin: 0;float: left;" data-filename="ai-MhBT8-editIx7MmTn.png"></div>
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-cvlfg.jpg" alt="" style="margin: 0;float: left;" data-filename="ai-0Xx4D-editcfCbAOe.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-02.png',
		    'category': '102',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-uDhRs.jpg" alt="" style="margin: 0;float: left;" data-filename="ai-6ay66-editiYP7lM9.png"></div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-K5c5T.jpg" alt="" style="margin: 0;float: left;" data-filename="ai-O4SHb-editrtRtJ92.png"></div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-0Yhoi.jpg" alt="" style="margin: 0;float: left;" data-filename="ai-Rv3el-editnRcjlrC.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-03.png',
		    'category': '102',
		    'viewMode': 'web',
		    'html': `
<img src="assets/minimalist-blocks/images/ai-gX9nR.jpg" alt="">
			`	
		},

		/* Profile */
		{
		    'thumbnail': 'preview/profile-01.png',
		    'category': '103',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="text-center tracking-wide size-42 font-normal">팀 소개</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-80"></div>
    </div>
</div>
<div class="row">
    <div class="flex flex-col justify-center items-center column third px-3">
        <div class="img-circular" style="margin:25px 0 0;width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-Ayo6y.jpg" alt="" data-filename="ai-v0kWC-editXvGHq38.png"></div>
        <p class="text-center leading-14">
            <span class="size-19 text-center font-normal">김민지</span><br>
            <span style="color: rgb(109, 109, 109);">개발자</span>
        </p>
    </div>
    <div class="flex flex-col justify-center items-center column third px-3">
        <div class="img-circular" style="margin:25px 0 0;width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-U9Mhk.jpg" alt="" data-filename="ai-5LB8u-editHA3SVGs.png"></div>
        <p class="text-center leading-14">
            <span class="size-19 text-center font-normal">이수진</span><br>
            <span style="color: rgb(109, 109, 109);">개발자</span>
        </p>
    </div>
    <div class="flex flex-col justify-center items-center column third px-3">
        <div class="img-circular" style="margin:25px 0 0;width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-wfCwM.jpg" alt="" data-filename="ai-rBr7d-editQCT5GrW.png"></div>
        <p class="text-center leading-14">
            <span class="size-19 text-center font-normal">박준혁</span><br>
            <span style="color: rgb(109, 109, 109);">디자이너</span>
        </p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-05.png',
		    'category': '103',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full">
        <h3 class="text-center font-normal size-32">팀원 소개</h3>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-20"></div>
    </div>
</div>            
<div class="row">
    <div class="column half py-4">
        <img src="assets/minimalist-blocks/images/ai-M8a3L.jpg" alt="" data-filename="ai-Woik1-editxQ8cIMT.png">
        <h3 class="font-normal size-24">정하윤</h3>
        <p style="max-width: 400px;">사용자 경험을 최우선으로 생각하며 직관적인 인터페이스를 설계합니다.</p>
        <div class="is-social text-left">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
    <div class="column half py-4">
        <img src="assets/minimalist-blocks/images/ai-rBm3n.jpg" alt="" data-filename="ai-O2ED1-editFBpnp2k.png">
        <h3 class="font-normal size-24">최민수</h3>
        <p style="max-width: 400px;">최신 기술 트렌드를 반영한 안정적인 시스템을 구축합니다.</p>
        <div class="is-social text-left">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-07.png',
		    'category': '103',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full text-center">
        <h1 class="size-60 font-normal">열정적인 팀</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <p class="text-center">함께 일하고, 함께 성장합니다.</p>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="text-right column third flex flex-col justify-center items-center">
        <div class="img-circular" style="margin:25px 0;width: 13vw;height: 13vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-DJgsj.jpg" alt="" data-filename="ai-obZqc-editzbfsl0b.png"></div>
    </div>
    <div class="flex flex-col justify-center column two-third">
        <h2 class="size-21 font-normal">김서연</h2>
        <h3 class="font-light size-18" style="color: rgb(174, 174, 174);">디자이너</h3>
        <div class="spacer height-20"></div>
        <p>창의적인 디자인과 사용자 중심의 접근으로 최적의 UI/UX를 설계합니다. 아름다움과 기능성을 모두 갖춘 인터페이스를 만듭니다.</p>
    </div>
</div>
<div class="row relative desktop-column-reverse md-column-reverse sm-column-reverse">
    <div class="flex flex-col justify-center column two-third">
        <h2 class="size-21 font-normal">이지현</h2>
        <h3 class="font-light size-18" style="color: rgb(174, 174, 174);">개발자</h3>
        <div class="spacer height-20"></div>
        <p>안정적이고 확장 가능한 백엔드 시스템을 구축합니다. 최신 기술 스택을 활용하여 효율적인 개발을 추구합니다.</p>
    </div>
    <div class="text-left column third flex flex-col justify-center items-center">
        <div class="img-circular" style="margin:25px 0;width: 13vw;height: 13vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-qugm7.jpg" alt="" data-filename="ai-49P77-editKYIzbti.png"></div>
    </div>
</div>
			`	
		},

		/* Products */
		{
		    'thumbnail': 'preview/products-05.png',
		    'category': '104',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="text-center size-42 font-normal">상품</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row relative sm-items-2">
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-FpLps.jpg" alt="">

        <h3 class="font-normal size-21">스마트 데스크</h3>
        <p class="font-medium size-32">₩39,000</p>

        <p class="leading-13">세련된 디자인과 실용성을 겸비한 프리미엄 제품으로 일상에 품격을 더합니다.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">지금 구매</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">상세 보기</a>
        </div>
    </div>
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-bHuNq.jpg" alt="">

        <h3 class="size-21 font-normal">모듈러 선반</h3>
        <p class="font-medium size-32">₩59,000</p>

        <p class="leading-13">공간 활용도를 극대화한 모듈러 디자인으로 어떤 인테리어에도 완벽하게 어울립니다.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">지금 구매</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">상세 보기</a>
        </div>
    </div>
</div>
			`	
		},

		/* Process/Steps */
		{
		    'thumbnail': 'preview/steps-05.png',
		    'category': '106',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="italic size-17">알아보기</p>
					<h1 class="font-medium tracking-75 size-32">서비스 안내</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-android-bulb size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">1단계</h3>
					<p>아이디어를 발굴하고 프로젝트의 방향을 설정합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-compose size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">2단계</h3>
					<p>설계와 개발을 통해 아이디어를 현실로 구현합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-gear-b size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">3단계</h3>
					<p>테스트와 최적화를 거쳐 최고의 결과물을 완성합니다.</p>
				</div>
			</div>
			`	
		},

		/* Pricing */
		{
		    'thumbnail': 'preview/pricing-01.png',
		    'category': '107',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column third xs-hidden" style="width: 100%;">
					<div class="spacer height-80"></div>
				</div>
				<div style="width: 52.7981%; flex: 0 0 auto;" class="column third text-center">
					<h2 class="text-center font-normal size-28">합리적인 요금제</h2>
					<p style="border-bottom: 3px solid #000; width: 80px; display: inline-block;"></p>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="text-center size-14">고객님의 필요에 맞는 최적의 요금제를 선택하세요. 모든 플랜에는 기본 기능이 포함되어 있으며, 언제든지 업그레이드가 가능합니다.</p>
				</div>
				<div class="column third xs-hidden" style="width: 100%;">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row relative sm-items-2">
				<div class="column third p-7 flex flex-col justify-center items-center">
					<div style="padding: 50px 20px; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); width: 100%; max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest size-21">스탠다드</h3>
						<p class="size-21 text-center">₩<span class="size-64">9,900</span>/월</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>10 GB 저장공간</li>
							<li>2명 사용자</li>
							<li>2개 도메인</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">지금 구매</a>
						</div>
					</div>
				</div>
				<div class="column third p-7 flex flex-col justify-center items-center">
					<div style="padding: 90px 30px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest size-21">디럭스</h3>
						<p class="size-21 text-center">₩<span class="size-64">19,900</span>/월</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>20 GB 저장공간</li>
							<li>5명 사용자</li>
							<li>3개 도메인</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">지금 구매</a>
						</div>
					</div>
				</div>
				<div class="column third p-7 flex flex-col justify-center items-center">
					<div style="padding: 50px 20px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest capitalize size-21">얼티밋</h3>
						<p class="size-21 text-center">₩<span class="size-64">29,900</span>/월</p>
						<ul style="list-style: initial;padding-left: 20px;">
							<li>30 GB 저장공간</li>
							<li>10명 사용자</li>
							<li>무제한 도메인</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">지금 구매</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-04.png',
		    'category': '107',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h2 class="tracking-wide capitalize size-42 font-normal">필요에 맞는 요금제</h2>
					<div class="spacer height-20"></div>
					<p class="size-17 tracking-widest" style="color: rgb(87, 87, 87);">합리적인 가격. 최고의 서비스.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row relative">
				<div class="flex flex-col justify-center items-center column half py-4">
					<div style="width: 100%; padding: 50px 30px; box-sizing: border-box; max-width: 450px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">스탠다드</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">₩<span class="size-72 font-extralight">19,900</span>/월</p>
						<p style="color: rgb(123, 123, 123);">기본적인 기능을 합리적인 가격에 이용할 수 있는 플랜입니다.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>기능 1</li>
							<li>기능 2</li>
							<li>기능 3</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">지금 구매</a>
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-center items-center column half py-4">
					<div style="width: 100%; padding: 80px 40px; box-sizing: border-box; max-width: 550px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">프로</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">₩<span class="size-72 font-extralight">29,900</span>/월</p>
						<p style="color: rgb(123, 123, 123);">고급 기능과 우선 지원이 포함된 전문가용 플랜입니다.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>기능 1</li>
							<li>기능 2</li>
							<li>기능 3</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">지금 구매</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-07.png',
		    'category': '107',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-35 font-medium tracking-wider">구독 요금제</h1>
					<p>나에게 맞는 최적의 플랜을 선택하세요.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row relative sm-items-2">
				<div class="column third flex flex-col justify-center items-center py-4">
					<div style="width: 100%; padding: 50px 30px; box-sizing: border-box; max-width: 450px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">스탠다드</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">₩<span class="size-64">19,900</span>/월</p>
						<p>기본 기능을 합리적인 가격으로 이용할 수 있습니다.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>기능 1</li>
							<li>기능 2</li>
							<li>기능 3</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">플랜 선택</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4 is-light-text">
					<div style="width: 100%; padding: 80px 40px; box-sizing: border-box; max-width: 550px; background-color: rgb(2, 136, 216);" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">디럭스</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">₩<span class="size-64">29,900</span>/월</p>
						<p>더 많은 기능과 용량으로 업무 효율을 높여줍니다.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>기능 1</li>
							<li>기능 2</li>
							<li>기능 3</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">플랜 선택</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4 is-light-text">
					<div style="width: 100%; padding: 50px 30px; box-sizing: border-box; max-width: 450px; background-color: rgb(249, 168, 37);" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">얼티밋</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">₩<span class="size-64">39,900</span>/월</p>
						<p>모든 프리미엄 기능을 무제한으로 사용할 수 있습니다.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>기능 1</li>
							<li>기능 2</li>
							<li>기능 3</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">플랜 선택</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},

		/* Skills */
		{
		    'thumbnail': 'preview/skills-10.png',
		    'category': '108',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-normal">전문 분야</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-ios-lightbulb-outline size-35"></i>
					<h4 class="font-normal size-19">UI/UX 디자인</h4>
					<p>사용자 중심의 직관적인 인터페이스를 설계합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-heart-outline size-35"></i>
					<h4 class="font-normal size-19">풀스택 개발</h4>
					<p>프론트엔드부터 백엔드까지 통합 개발을 수행합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-list-outline size-35"></i>
					<h4 class="font-normal size-19">일러스트레이션</h4>
					<p>브랜드 아이덴티티를 살린 비주얼 콘텐츠를 제작합니다.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-ios-camera-outline size-35"></i>
					<h4 class="font-normal"><span class="size-19">영상 제작</span></h4>
					<p>임팩트 있는 영상 콘텐츠로 메시지를 전달합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-locked-outline size-35"></i>
					<h4 class="font-normal"><span class="size-19">브랜딩</span></h4>
					<p>일관된 브랜드 경험을 위한 전략을 수립합니다.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-world-outline size-35"></i>
					<h4><span class="font-normal size-19">마케팅</span></h4>
					<p>데이터 기반의 효과적인 마케팅 전략을 실행합니다.</p>
				</div>

			</div>
			`	
		},

		/* Achievements */
		{
		    'thumbnail': 'preview/achievements-03.png',
		    'category': '109',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-300 leading-18 size-12" style="color: rgb(109, 109, 109);">성과</p>
					<h1 class="font-light size-35">우리가 특별한 이유.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<div class="text-left leading-14">
						<i class="icon ion-ios-heart-outline size-48"></i>
					</div>
					<h2 class="leading-12 size-35">100%</h2>
					<h3 class="leading-12 tracking-wide size-19 font-light">고객 만족도</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">최고 수준의 서비스 품질로 고객 만족을 실현합니다.</p>
				</div>
				<div class="column third">
					<div class="text-left leading-14">
						<i class="icon ion-ios-people-outline size-48"></i>
					</div>
					<h2 class="leading-12 size-35">1.234</h2>
					<h3 class="leading-12 size-19 tracking-wide font-light">만족한 고객</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">지속적인 신뢰 관계를 구축하며 함께 성장합니다.</p>
				</div>
				<div class="column third">
					<div class="text-left leading-14">
						<i class="icon ion-ios-compose-outline size-48"></i>
					</div>
					<h2 class="leading-12 size-35">567</h2>
					<h3 class="leading-12 size-19 tracking-wide font-light">완료된 프로젝트</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">다양한 분야에서 성공적인 프로젝트를 수행했습니다.</p>
				</div>
			</div>
			`	
		},

		/* Quotes */
		{
		    'thumbnail': 'preview/quotes-02.png',
		    'category': '110',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full text-left">
					<div class="text-left">
						<i class="icon ion-quote size-32"></i>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<h1 class="size-32 leading-11">[회사명]은 앞서가는 사고와 체계적인 서비스를 제공해 주었습니다. 이는 우리 네트워크의 효율성과 안정성에 큰 영향을 미쳤습니다.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<p class="italic tracking-wider">— 사용자</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-03.png',
		    'category': '110',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column two-third"><img src="assets/minimalist-blocks/images/ai-r43cG.jpg" alt="" data-filename=" ai-49P75-editRkU0S4C.png"></div>

    <div class="flex flex-col justify-center column third py-3">
        <div class="text-left leading-18">
            <i class="icon ion-quote size-28"></i>
        </div>

        <p class="size-21 leading-14">사용하기 쉽고, 맞춤 설정이 가능하며, 사용자 친화적입니다. 정말 놀라운 기능입니다.</p>

        <p style="color: rgb(138, 138, 138);">- 사용자</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-06.png',
		    'category': '110',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="text-center size-35 font-normal">고객의 이야기</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-60"></div>
    </div>
</div>
<div class="row">
    <div class="text-center flex flex-col justify-center items-center column"><img src="assets/minimalist-blocks/images/ai-CKaDa.jpg" alt="" data-filename="ai-VETbj 2-editwK2A7QN.png">
        <div class="spacer height-20"></div>
        <div class="text-center">
            <i class="icon ion-quote size-28"></i>
        </div>

        <h3 class="size-19 font-light">"서비스 품질이 뛰어나고 고객 응대가 정말 훌륭합니다"</h3>
        <p class="tracking-wider size-16" style="color: rgb(102, 102, 102);">— 고객</p>
    </div>
    <div class="text-center flex flex-col justify-center items-center column" style="width: 50%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-8ABNg.jpg" alt="" data-filename="ai-3A86k-edithSvRhPC.png">
        <div class="spacer height-20"></div>
        <div class="text-center">
            <i class="icon ion-quote size-28"></i>
        </div>

        <h3 class="size-19 font-light">"서비스 품질이 뛰어나고 고객 응대가 정말 훌륭합니다"</h3>
        <p class="tracking-wider size-16" style="color: rgb(102, 102, 102);">— 고객</p>
    </div>
</div>
			`	
		},

		/* Partners */
		{
		    'thumbnail': 'preview/partners-02.png',
		    'category': '111',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full text-center">
					<h1 class="leading-18 text-center tracking-wide size-35">소중한 고객사</h1>
					<p style="border-bottom: 3px solid; width: 80px; display: inline-block;"></p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third flex flex-col justify-center items-center">
					<img src="assets/minimalist-blocks/images/creative.png" alt="">
				</div>
				<div class="column third flex flex-col justify-center items-center">
					<img src="assets/minimalist-blocks/images/light-studio.png" alt="">
				</div>
				<div class="column third flex flex-col justify-center items-center">
					<img src="assets/minimalist-blocks/images/infinitech.png" alt="">
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/partners-05.png',
		    'category': '111',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42"><span class="font-semibold tracking-wide size-35">열정으로 고객을 섬깁니다.</span></h1>
					<p class="size-16">세계 최고의 기업들이 신뢰하고 인정하는 파트너입니다.</p>
					<hr style="border-top: 3px solid #111;width: 60px;margin: 20px 0;">
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><img src="/assets/minimalist-blocks/images/worldwide.png" alt=""></div>
				<div class="column third"><img src="/assets/minimalist-blocks/images/steady.png" alt=""></div>
				<div class="column third"><img src="/assets/minimalist-blocks/images/design-firm.png" alt=""></div>

			</div>
			<div class="row">
				<div class="column third"><img src="/assets/minimalist-blocks/images/infinitech.png" alt=""></div>
				<div class="column third"><img src="/assets/minimalist-blocks/images/light-studio.png" alt=""></div>
				<div class="column third"><img src="/assets/minimalist-blocks/images/upclick.png" alt=""></div>

			</div>
			`	
		},

		/* 404 */
		{
		    'thumbnail': 'preview/404-01.png',
		    'category': '113',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<div class="text-center">
						<i class="icon ion-android-sad size-64"></i>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<h1 class="is-title1-48 is-title-lite leading-none font-light text-center size-42">페이지를 찾을 수 없습니다</h1>
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<p class="size-19 text-center" style="color: rgb(109, 109, 109);">요청하신 페이지를 찾을 수 없습니다. URL의 오타이거나 삭제된 페이지일 수 있습니다.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center button-group">
						<a href="#" role="button" class="transition-all inline-block cursor-pointer no-underline border-2 border-solid mr-1 mt-2 mb-2 tracking-75 py-2 border-current text-black hover:border-current font-normal ml-1 leading-relaxed rounded-full px-11 size-13" onmouseover="if(this.getAttribute('data-hover-bg'))this.style.backgroundColor=this.getAttribute('data-hover-bg');" onmouseout="if(this.getAttribute('data-bg'))this.style.backgroundColor=this.getAttribute('data-bg');else this.style.backgroundColor=''">홈으로</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-02.png',
		    'category': '113',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<i class="icon ion-alert-circled size-64"></i>
					<h1 class="size-42 is-title2-48 is-title-lite">앗, 페이지를 찾을 수 없습니다.</h1>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);">찾으시는 페이지가 삭제되었거나 이름이 변경되었을 수 있습니다. 일시적으로 이용할 수 없는 상태일 수도 있습니다.</p>
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center button-group">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full size-14 uppercase tracking-125">홈페이지</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-03.png',
		    'category': '113',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-196 leading-none tracking-wider" style="margin-bottom: 10px;">404</h1>
					<h3 class="size-28 tracking-225">페이지를 찾을 수 없습니다</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);">찾으시는 페이지가 삭제되었거나 이름이 변경되었을 수 있습니다. 일시적으로 이용할 수 없는 상태일 수도 있습니다.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center button-group">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 border-current hover:border-current font-normal leading-relaxed rounded size-14 uppercase pt-2 pb-2 px-8 tracking-75">홈으로</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-04.png',
		    'category': '113',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full"><i class="icon ion-android-sad size-64"></i>
					<h1 class="is-title1-48 is-title-lite size-42">무언가 잘못되었습니다... </h1>
					<p class="size-21">요청하신 페이지를 찾을 수 없습니다. URL의 오타이거나 삭제된 페이지일 수 있습니다.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div style="white-space: nowrap;">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">홈으로</a>
					</div>
				</div>

			</div>
			`	
		},

		/* Coming Soon */
		{
		    'thumbnail': 'preview/comingsoon-03.png',
		    'category': '114',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full center"><i class="icon ion-laptop size-64"></i>
					<h1 class="size-35 is-title2-48 is-title-lite font-semibold">사이트 점검 중입니다 </h1>
					<p class="size-21">잠시 후 다시 방문해 주세요.</p>
					<div class="spacer height-40"></div>
					<div class="is-social edit size-21">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>

			</div>
			`	
		},

		/* FAQ */
		{
		    'thumbnail': 'preview/faq-08.png',
		    'category': '115',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-28 text-center tracking-wide font-normal">자주 묻는 질문</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half"><i class="icon ion-android-cart size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">상품은 어떻게 구매하나요?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">홈페이지에서 원하는 상품을 선택한 후 간편하게 구매하실 수 있습니다.</p>
				</div>
				<div class="column half"><i class="icon ion-earth size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">해외 배송이 가능한가요?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">네, 전 세계 대부분의 지역으로 배송 서비스를 제공하고 있습니다.</p>
				</div>
			</div>
			<div class="row">
				<div class="column half"><i class="icon ion-card size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">어떤 결제 수단을 사용할 수 있나요?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">신용카드, 계좌이체, 간편결제 등 다양한 결제 수단을 지원합니다.</p>
				</div>
				<div class="column half"><i class="icon ion-arrow-swap size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">상품이 파손되었거나 주문과 다른 경우 어떻게 하나요?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">고객센터로 연락 주시면 신속하게 교환 또는 환불 처리해 드립니다.</p>
				</div>
			</div>
			`	
		},

		/* Contact */
		{
		    'thumbnail': 'preview/contact-01.png',
		    'category': '116',
		    'viewMode': 'web',
		    'html': `
			<div class="row relative sm-items-1">
				<div class="py-6 flex flex-col justify-center column half">
					<p class="uppercase size-12 tracking-125 text-left" style="color: rgb(102, 102, 102);">회사 이름</p>
					<h1 class="leading-none size-42 text-left font-normal">문의하기</h1>
					<div class="spacer height-20"></div>

					<p style="color: rgb(109, 109, 109);" class="text-left">서울특별시 강남구 테헤란로 123
						<br>전화: 02-1234-5678 / 02-1234-5679
					</p>
					<p>언제든지 편하게 문의해 주세요. 전문 상담원이 친절하고 신속하게 답변드리겠습니다. 고객님의 소중한 의견에 항상 귀 기울이겠습니다.</p>
					<div class="spacer height-20"></div>
					<div class="is-social text-center">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
				<div class="flex flex-col justify-center items-center column half" style="filter: grayscale(1);">
					<div class="embed-responsive embed-responsive-16by9" style="padding-bottom:100%">
						<iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="mg1" src="https://maps.google.com/maps?q=Melbourne,+Victoria,+Australia&amp;hl=en&amp;sll=-7.981898,112.626504&amp;sspn=0.009084,0.016512&amp;oq=melbourne&amp;hnear=Melbourne+Victoria,+Australia&amp;t=m&amp;z=10&amp;output=embed"></iframe>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-13.png',
		    'category': '116',
		    'viewMode': 'web',
		    'html': `
			<div class="row">
				<div class="column full" style="width: 100%; flex: 0 0 auto;">
					<h1 class="size-28 font-normal text-center">궁금한 점이 있으신가요? 전화주세요 <span style="color: rgb(230, 126, 34);">02-1234-5678</span></h1>
					<div class="spacer height-40"></div>
					<div class="is-social  text-center size-18">
                        <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
                        <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
                        <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
			</div>
			`	
		},

		/* About */
		{
		    'thumbnail': 'preview/about-04.png',
		    'category': '103',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column full"><img src="assets/minimalist-blocks/images/ai-lClur.jpg" alt=""></div>
</div>
<div class="row">
    <div class="column full pt-2">
        <h1 class="tracking-wide">우리의 이야기</h1>
        <p style="border-bottom: 2px solid #f49400;width: 70px;display: inline-block;margin-top: 0;"></p>
    </div>
</div>
<div class="row">
    <div class="column two-third">
        <p class="text-justify">고객 중심의 가치를 실현하기 위해 끊임없이 노력하고 있습니다. 혁신적인 기술과 풍부한 경험을 바탕으로 최고의 금융 서비스를 제공하며, 고객과 함께 성장해 나가고 있습니다.</p>
    </div>
    <div class="column third">
        <p class="size-14" style="color: rgb(138, 138, 138);">서울특별시 강남구 <br>테헤란로 123, 1층<br>전화: 02-1234-5678</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/about-06.png',
		    'category': '103',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column third">
        <h1 class="size-28" style="margin-top: 15px;"><span class="font-semibold">회사</span> 소개</h1>
        <p style="border-bottom: 2px solid #000;width: 30px;display: inline-block;margin-top: 0;"></p>
    </div>
    <div class="column two-third pb-5">
        <p class="text-justify">우리는 디지털 혁신을 선도하는 팀입니다. 최신 기술과 창의적인 아이디어를 결합하여 고객에게 최고의 가치를 전달합니다.</p>
    </div>
</div>
<div class="row">
    <div class="column full"><img src="assets/minimalist-blocks/images/ai-9F5nG.jpg" alt=""></div>
</div>
			`	
		},
		{
			'thumbnail': 'preview/basic-codeview.png',
			'category': '120',
		    'viewMode': 'web',
			'html':
				`<div class="row">
					<div class="column full" data-noedit data-module="codeview" data-module-desc="Code" data-dialog-height="570px" data-html="${encodeURIComponent(`

						<div class="hide-on-print" style="display: flex;justify-content: flex-end;margin-bottom:5px"><button id="_copycode{id}" style="font-family:system-ui;font-size:13px;font-weight:300;padding:0;border:none;background:transparent;display:flex;cursor:pointer;">
							<svg width="16" height="16" style="margin-right:3px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path>
							</svg>
							코드 복사</button><!-- Tooltip element below the button -->
                            <div id="tooltip{id}" style="display: none; margin-top: 25px; background-color: #333; color: #fff; padding: 5px 10px; border-radius: 4px; position: absolute; z-index: 1; font-size: 12px;">복사됨.</div>
						</div>
						<pre id="{id}" class="language-markup" style="font-size:14px;background-color: #f4f4f4;padding: 12px 16px;text-wrap: wrap;">&lt;h1>안녕하세요&lt;/h1></pre>
						<scr`+`ipt>
							var docReady = function(fn) {
								var stateCheck = setInterval(function() {
									if (document.readyState !== "complete") return;
									clearInterval(stateCheck);
									try {
										fn()
									} catch (e) {}
								}, 1);
							};
							docReady(function() {
								var block = document.getElementById('{id}');
						
								if (typeof Prism === 'undefined') {
									var prismCss = document.createElement('link');
									prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css';
									prismCss.rel = 'stylesheet';
						
									var prismThemeCss = document.createElement('link');
									prismThemeCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-coy.min.css';
									prismThemeCss.rel = 'stylesheet';
						
									var prismJs = document.createElement('script');
									prismJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js';
									prismJs.onload = function() {
										var styleElement = document.createElement('style');
										styleElement.innerHTML = \`
											<style>
												:not(pre)>code[class*=language-], pre[class*=language-] {
													background-color: #f4f4f4 !important;
													padding: 12px 16px !important;
												}
												pre[class*=language-]:after, pre[class*=language-]:before {
													box-shadow: none;
												}
												:not(pre)>code[class*=language-], pre[class*=language-] {
													margin-bottom: 0.5rem;
												}
												div[data-html] {
													min-height: 40px;
												}
												code[class*=language-], pre[class*=language-] {
													text-shadow: none;
												}
											</style>
											\`;
										document.head.appendChild(styleElement);
						
										Prism.highlightElement(block);
									};
						
									document.head.appendChild(prismCss);
									document.head.appendChild(prismThemeCss);
									document.head.appendChild(prismJs);
								} else {
									Prism.highlightElement(block);
								}
								try {
									Prism.highlightElement(block);
								} catch (e) {}
						
								var btnCopyCode = document.getElementById('_copycode{id}');
                                var tooltip = document.getElementById('tooltip{id}');
								btnCopyCode.addEventListener('click', () => {
									const range = document.createRange();
									range.selectNode(block);
									window.getSelection().addRange(range);
									try {
										document.execCommand('copy');
                                        tooltip.style.display = 'block';
                                        setTimeout(() => {
                                            tooltip.style.display = 'none';
                                        }, 1000);
									} catch (err) {
										console.error('Failed to copy code:', err);
									}
									window.getSelection().removeAllRanges();
								});
						
							});
						</scr`+`ipt>

						`)}" 
						
						data-settings="${encodeURIComponent(`
							
							{
								"code": "<h1>안녕하세요<h1>",
								"theme": "none"
							}

						`)}">
					</div>
				</div>`
		}, 


        /* PLUGINS */
		{
		    'thumbnail': 'preview/plugin-pendulum.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column flex flex-col justify-center items-start">
        <h1 class="font-medium size-35">AI 기반 데이터 사이언스 솔루션</h1>
        <p>최첨단 머신러닝과 고급 분석을 통해 데이터를 실행 가능한 인사이트로 전환하세요.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mt-2 mb-1 font-normal tracking-normal rounded-full py-2 px-6 size-15 leading-14 border-transparent hover:border-transparent" style="color: rgb(250, 250, 250); background-color: rgb(24, 24, 27);" onmouseover="if(this.getAttribute('data-hover-bg'))this.style.backgroundColor=this.getAttribute('data-hover-bg');" onmouseout="if(this.getAttribute('data-bg'))this.style.backgroundColor=this.getAttribute('data-bg');else this.style.backgroundColor='';" data-bg="rgb(24, 24, 27)" data-hover-bg="rgb(63, 63, 70)">자세히 보기</a>
        </div>
    </div>
    <div class="column" style="width: 70%; flex: 0 0 auto;">
        <div data-cb-type="pendulum" data-cb-speed="2.1" data-cb-color="#6464ff" data-cb-pendulum-count="10" data-cb-trail-length="100" data-cb-bg-color="#ffffff" data-cb-color-variation="100" data-cb-line-width="3.5" data-cb-trail-opacity="0.1" data-cb-pendulum-opacity="0" data-cb-ball-size="3" data-cb-ball-opacity="0.1" data-cb-blur="0" data-cb-draw-mode="curves" data-cb-fade-curve="linear" data-cb-swing-angle="60" data-cb-start-angle="45" data-cb-length-ratio="0.3" data-cb-base-freq="0.005" data-cb-freq-increment="0.001" data-cb-freq-distribution="linear" data-cb-pivot-y="20" data-cb-canvas-size="600" data-cb-margin="10" data-cb-transparent-bg="true">
        </div>
    </div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-mockup.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="browser-mockup" data-cb-max-width="1400" data-cb-rotate-x="8" data-cb-rotate-y="-3" data-cb-enable-hover="true">
    <div class="app-showcase">
        <div class="app-container" style="transform: rotateX(0deg) rotateY(0deg);">
            <div class="app-window">
                <div class="window-header">
                    <div class="window-dot"></div>
                    <div class="window-dot"></div>
                    <div class="window-dot"></div>
                </div>
                <div class="app-screenshot">
                    <img src="assets/minimalist-blocks/images/ai-lClur.jpg" alt="앱 목업" class="screenshot-image">
                </div>
            </div>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/plugin-card-list.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="card-list" data-cb-items-per-row="2" data-cb-gap="26" data-cb-aspect-ratio="16/9" data-cb-accent-color="#000000" tabindex="0" role="region" aria-label="카드 목록" style="position: relative; --accent-color: #000000; --accent-color-light: rgb(64, 64, 64);">
    <div class="card-list-grid grid-sortable">
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-XUe84.jpg" alt="상품 1">
            </div>
            <div class="item-content">
                <h3 class="item-title">프리미엄 위젯</h3>
                <p class="item-description">최고 품질의 장인정신</p>
                <a href="/product/1" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-cvlfg.jpg" alt="상품 1">
            </div>
            <div class="item-content">
                <h3 class="item-title">프리미엄 위젯</h3>
                <p class="item-description">최고 품질의 장인정신</p>
                <a href="/product/2" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-HzKor.jpg" alt="상품 1">
            </div>
            <div class="item-content">
                <h3 class="item-title">프리미엄 위젯</h3>
                <p class="item-description">최고 품질의 장인정신</p>
                <a href="/product/3" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-iNSwQ.jpg" alt="프리미엄 위젯">
            </div>
            <div class="item-content">
                <h3 class="item-title">프리미엄 위젯</h3>
                <p class="item-description">최고 품질의 장인정신</p>
                <a href="/product/4" class="item-link">자세히 보기 →</a>
            </div>
        </div>
    </div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-media-slider.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="media-slider" data-cb-items-per-slide="3" data-cb-gap="26" data-cb-aspect-ratio="3/4" tabindex="0" role="region" aria-label="미디어 슬라이더" aria-roledescription="carousel" style="position: relative; overflow: hidden; --accent-color: #000000; --accent-color-light: rgb(64, 64, 64);" data-cb-accent-color="#000000" data-cb-autoplay="false" data-cb-autoplay-speed="3000" data-cb-loop="true" data-cb-pause-on-hover="true" data-cb-show-arrows="true" data-cb-show-dots="true" data-cb-show-counter="false">
    <div class="media-slider-track">

        <div class="slider-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-ER9hZ.jpg" alt="샘플 제목 1">
            </div>
            <div class="item-content">
                <h3 class="item-title">샘플 제목 1</h3>
                <p class="item-description">간단한 설명이 들어갑니다</p>
                <a href="#" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="slider-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-ehmKk.jpg" alt="샘플 제목 2">
            </div>
            <div class="item-content">
                <h3 class="item-title">샘플 제목 2</h3>
                <p class="item-description">다양한 이미지를 활용하세요</p>
                <a href="#" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="slider-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-0Yhoi.jpg" alt="샘플 제목 3">
            </div>
            <div class="item-content">
                <h3 class="item-title">샘플 제목 4</h3>
                <p class="item-description">유연한 설명 텍스트</p>
                <a href="#" class="item-link">자세히 보기 →</a>
            </div>
        </div>
        <div class="slider-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-uDhRs.jpg" alt="샘플 제목 4">
            </div>
            <div class="item-content">
                <h3 class="item-title">샘플 제목 3</h3>
                <p class="item-description">간략한 캡션 또는 요약</p>
                <a href="#" class="item-link">자세히 보기 →</a>
            </div>
        </div>
    </div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-hero-anim.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div class="row">
    <div class="column flex flex-col justify-center" style="width: 42.5%; flex: 0 0 auto;">
        <h1 class="size-48 font-medium">AI 기반 데이터 사이언스 솔루션</h1>
        <p>최첨단 머신러닝과 고급 분석을 통해 데이터를 실행 가능한 인사이트로 전환하세요.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mt-2 mb-1 font-normal tracking-normal rounded-full py-2 px-6 size-15 leading-14 border-transparent hover:border-transparent" style="color: rgb(250, 250, 250); background-color: rgb(24, 24, 27);" onmouseover="if(this.getAttribute('data-hover-bg'))this.style.backgroundColor=this.getAttribute('data-hover-bg');" onmouseout="if(this.getAttribute('data-bg'))this.style.backgroundColor=this.getAttribute('data-bg');else this.style.backgroundColor='';" data-bg="rgb(24, 24, 27)" data-hover-bg="rgb(63, 63, 70)">자세히 보기</a>
        </div>
    </div>
    <div class="column" style="width: 100%;">

        <div data-cb-type="hero-animation" data-cb-animation-type="bezier" data-cb-speed="2.4" data-cb-base-color="rgba(255, 0, 112, 1)" data-cb-canvas-width="600" data-cb-canvas-height="600">
            <canvas></canvas>
        </div>
    </div>
</div>
    `	
		},
		{
		    'thumbnail': 'preview/plugin-logo-loop.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="logo-loop" data-cb-speed="40" data-cb-gap="60" data-cb-pause-on-hover="true" class="cb-logo-loop--fade-edges flex" data-cb-direction="left">
    <div class="logo-item">
        <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" width="120">
    </div>
    <div class="logo-item">
        <img src="https://cdn.simpleicons.org/vue.js/4FC08D" alt="Vue.js" width="120">
    </div>
    <div class="logo-item">
        <img src="https://cdn.simpleicons.org/next.js/000000" alt="Next.js" width="120">
    </div>

    <div class="logo-item">
        <img src="https://cdn.simpleicons.org/laravel/FF2D20" alt="Laravel" width="120">
    </div>
    <div class="logo-item">
        <img src="https://cdn.simpleicons.org/ruby/CC342D" alt="Ruby" width="120">
    </div>

</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-before-after.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="before-after-slider" data-cb-orientation="horizontal" data-cb-start-position="40" data-cb-show-labels="true">
    <div class="ba-container">
        <div class="ba-before">
            <img src="assets/minimalist-blocks/images/ai-iNSwQ.jpg" alt="리노베이션 전">
            <span class="ba-label-before">이전</span>
        </div>
        <div class="ba-after">
            <img src="assets/minimalist-blocks/images/ai-HzKor.jpg" alt="리노베이션 후">
            <span class="ba-label-after">이후</span>
        </div>
        <div class="ba-slider">
            <div class="ba-handle"></div>
        </div>
    </div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-timeline.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="timeline" data-cb-orientation="vertical" data-cb-animate="true" data-cb-accentcolor="#8b5cf6" data-cb-linewidth="2" data-cb-dotsize="14" class="timeline-vertical" role="list" aria-label="제품 로드맵" style="--timeline-accent: rgba(59, 130, 246, 1); --timeline-line-width: 2px; --timeline-dot-size: 10px;" data-cb-accent-color="rgba(59, 130, 246, 1)" data-cb-line-width="2" data-cb-dot-size="10">
    <div>
        <div class="timeline-item" data-status="completed" data-item-id="item-h1" role="listitem">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <span class="timeline-date">1단계</span>
                <h3 class="timeline-title">리서치 &amp; 기획</h3>
                <p class="timeline-desc">시장 조사를 수행하고 이해관계자의 의견을 반영하여 제품 요구사항을 정의했습니다.</p>
            </div>
        </div>
        <div class="timeline-item" data-status="completed" data-item-id="item-h2" role="listitem">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <span class="timeline-date">2단계</span>
                <h3 class="timeline-title">디자인 &amp; 프로토타입</h3>
                <p class="timeline-desc">사용자 중심 디자인을 수립하고 테스트용 인터랙티브 프로토타입을 제작했습니다.</p>
            </div>
        </div>
        <div class="timeline-item" data-status="current" data-item-id="item-h3" role="listitem">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <span class="timeline-date">3단계</span>
                <h3 class="timeline-title">개발</h3>
                <p class="timeline-desc">성능과 확장성에 초점을 맞춰 핵심 플랫폼을 구축하고 있습니다.</p>
            </div>
        </div>
        <div class="timeline-item" data-status="upcoming" data-item-id="item-h4" role="listitem">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <span class="timeline-date">4단계</span>
                <h3 class="timeline-title">테스트 &amp; QA</h3>
                <p class="timeline-desc">다양한 디바이스와 브라우저에서 품질을 보장하기 위한 종합 테스트를 진행합니다.</p>
            </div>
        </div>
        <div class="timeline-item" data-status="upcoming" data-item-id="item-h5" role="listitem">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <span class="timeline-date">5단계</span>
                <h3 class="timeline-title">출시</h3>
                <p class="timeline-desc">마케팅 캠페인과 고객 온보딩을 포함한 공식 제품 출시를 진행합니다.</p>
            </div>
        </div>
    </div>
    <div>
    </div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-accordion.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="faq" data-cb-allow-multiple="true" data-cb-open-first="true" style="--border-radius: 10px;" data-cb-border-radius="10">
    <div class="accordion-item">
        <div class="accordion-header">
            <span class="accordion-question edit">이 플랫폼은 무엇인가요?</span>
            <span class="accordion-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </span>
        </div>
        <div class="accordion-content">
            <div class="accordion-answer is-subblock edit">
                <p>저희 플랫폼은 연결, 생성, 협업을 손쉽게 도와줍니다. 새로운 아이디어를 탐색하거나 진행 중인 프로젝트를 관리할 때, 모든 것이 간단하고 체계적인 워크플로우를 위해 설계되었습니다.</p>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <div class="accordion-header">
            <span class="accordion-question edit">어떻게 시작하나요?</span>
            <span class="accordion-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </span>
        </div>
        <div class="accordion-content">
            <div class="accordion-answer is-subblock edit">
                <p>이메일 주소로 가입하고 프로필을 만든 후 대시보드를 탐색하세요. 거기에서 모든 도구, 튜토리얼, 커뮤니티 리소스에 접근하여 시작할 수 있습니다.</p>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <div class="accordion-header">
            <span class="accordion-question edit">모바일 기기에서도 사용할 수 있나요?</span>
            <span class="accordion-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </span>
        </div>
        <div class="accordion-content">
            <div class="accordion-answer is-subblock edit">
                <p>네! 플랫폼은 스마트폰과 태블릿에 완전히 최적화되어 있어 어디서든 생산적으로 활동할 수 있습니다.</p>
            </div>
        </div>
    </div>
</div>
`
		},
		{
		    'thumbnail': 'preview/plugin-media-grid.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="media-grid" data-cb-columns="3" class="grid-sortable" data-cb-gap="16" data-cb-rounded="8" data-cb-content-theme="light">

    <div class="gallery-item">
        <img src="assets/minimalist-blocks/images/ai-ehmKk.jpg" alt="샘플 제목">
        <div class="item-content">

            <h4>샘플 제목</h4>
            <div>간단한 설명이 들어갑니다</div>
        </div>
    </div>
    <div class="gallery-item">
        <img src="assets/minimalist-blocks/images/ai-yBliz.jpg" alt="샘플 제목">

    </div>
    <div class="gallery-item">
        <img src="assets/minimalist-blocks/images/ai-sFtJP2.jpg" alt="샘플 제목">
        <div class="item-content">

            <h4>샘플 제목</h4>
            <div>간단한 설명이 들어갑니다</div>
        </div>
    </div>
    <div class="gallery-item">
        <img src="assets/minimalist-blocks/images/ai-ER9hZ.jpg" alt="샘플 제목">
        <div class="item-content">

            <h4>샘플 제목</h4>
            <div>간단한 설명이 들어갑니다</div>
        </div>
    </div>
    <div class="gallery-item"><img src="assets/minimalist-blocks/images/ai-XUe84.jpg" alt=""></div>
    <div class="gallery-item"><img src="assets/minimalist-blocks/images/ai-4UgvH.jpg" alt=""></div>
    <div class="gallery-item"><img src="assets/minimalist-blocks/images/ai-xPlfu.jpg" alt=""></div>
</div>
`	
		},
		{
		    'thumbnail': 'preview/plugin-social-share.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="social-share" data-cb-show-x="true" data-cb-show-facebook="true" data-cb-show-linked-in="true" data-cb-show-whats-app="true" data-cb-show-copy-link="true" data-cb-show-more="true" data-cb-share-title="멋진 웹사이트 만드는 방법" data-cb-share-text="2025년 고성능 웹사이트를 만드는 비결을 알아보세요." data-cb-label-text="이 글 공유하기" data-cb-original-content="" data-cb-alignment="center" data-cb-show-label="true">
    <div class="share-container" role="group" aria-label="이 페이지 공유하기" data-alignment="center" aria-labelledby="share-label-cnftppq10"><span class="share-label" id="share-label-cnftppq10">이 글 공유하기</span>
        <div class="share-buttons flex" role="list">
            <div role="listitem"><button class="share-btn" type="button" aria-label="X에 공유"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg></button></div>
            <div role="listitem"><button class="share-btn" type="button" aria-label="Facebook에 공유"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg></button></div>
            <div role="listitem"><button class="share-btn" type="button" aria-label="LinkedIn에 공유"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg></button></div>
            <div role="listitem"><button class="share-btn" type="button" aria-label="WhatsApp으로 공유"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                    </svg></button></div>
            <div role="listitem"><button class="share-btn" type="button" aria-label="링크 복사"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg></button></div>
            <div class="share-more" role="listitem"><button class="share-btn" type="button" aria-label="더 많은 공유 옵션" aria-expanded="false" aria-haspopup="true" aria-controls="share-dropdown-9zv110z4t"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg></button>
                <div class="share-dropdown" id="share-dropdown-9zv110z4t" role="menu" aria-label="추가 공유 옵션">
                    <button type="button" role="menuitem" data-platform="reddit">Reddit</button>
                    <button type="button" role="menuitem" data-platform="telegram">Telegram</button>
                    <button type="button" role="menuitem" data-platform="email">Email</button>
                </div>
            </div>
        </div>
    </div>
</div>
`
		},
		{
		    'thumbnail': 'preview/plugin-cta-buttons.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="cta-buttons" data-cb-primary-padding-y="12" data-cb-primary-padding-x="24" data-cb-primary-font-size="18" data-cb-secondary-padding-y="12" data-cb-secondary-padding-x="24" data-cb-secondary-font-size="18" style="gap: 24px; flex-wrap: wrap; display: flex; justify-content: center; align-items: center;" class="flex justify-center items-center" data-cb-primary-text="시작하기" data-cb-primary-link="" data-cb-primary-style="gradient" data-cb-primary-color1="#6366f1" data-cb-primary-color2="#8b5cf6" data-cb-primary-text-color="#ffffff" data-cb-primary-border-radius="12" data-cb-primary-font-weight="true" data-cb-primary-shadow="true" data-cb-primary-hover-lift="true" data-cb-secondary-text="문서 보기" data-cb-secondary-link="" data-cb-secondary-style="outline" data-cb-secondary-color1="rgba(229, 229, 229, 1)" data-cb-secondary-color2="rgba(205, 205, 205, 1)" data-cb-secondary-text-color="#0f172a" data-cb-secondary-border-radius="12" data-cb-secondary-font-weight="true" data-cb-secondary-shadow="true" data-cb-secondary-hover-lift="false" data-cb-gap="24" data-cb-alignment="center">
    <a href="#signup" class="cta-btn primary-gradient hover-lift">
        무료 가입
    </a>
    <a href="#demo" class="cta-btn secondary-outline">
        데모 보기
    </a>
</div>
`
		},
		{
		    'thumbnail': 'preview/plugin-anim-stats.png',
		    'category': '120',
		    'viewMode': 'web',
		    'html': `
<div data-cb-type="animated-stats" data-variant="minimal" data-cb-columns="4" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;" class="text-center" data-cb-alignment="center" data-cb-duration="2" data-cb-delay="0.1" data-cb-easing="ease-out" data-cb-icon-size="32" data-cb-number-size="34" data-cb-label-size="16">
    <div class="stat-item" data-target="500" data-suffix="+" data-stat-id="stat-19">
        <div class="stat-icon" data-icon-type="bootstrap">
            <i class="bi bi-globe"></i>
        </div>
        <div class="stat-number">500+</div>
        <div class="stat-label">글로벌 고객</div>
    </div>
    <div class="stat-item" data-target="50" data-suffix="+" data-stat-id="stat-20">
        <div class="stat-icon" data-icon-type="bootstrap">
            <i class="bi bi-person-badge-fill"></i>
        </div>
        <div class="stat-number">50+</div>
        <div class="stat-label">팀원 수</div>
    </div>
    <div class="stat-item" data-target="10" data-suffix="+" data-stat-id="stat-21">
        <div class="stat-icon" data-icon-type="bootstrap">
            <i class="bi bi-pin-map-fill"></i>
        </div>
        <div class="stat-number">10+</div>
        <div class="stat-label">진출 국가</div>
    </div>
    <div class="stat-item" data-target="100" data-suffix="%" data-stat-id="stat-22">
        <div class="stat-icon" data-icon-type="bootstrap">
            <i class="bi bi-bullseye"></i>
        </div>
        <div class="stat-number">100%</div>
        <div class="stat-label">헌신</div>
    </div>
</div>
`
		},

	]

};