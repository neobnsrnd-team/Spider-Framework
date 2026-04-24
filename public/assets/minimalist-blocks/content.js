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


		{
		    'thumbnail': 'preview/basic-01b.png',
		    'category': '120',
		    'html': `
			<div class="display">
				<h1 class="font-medium">Design the way you think.</h1>
				<p>Build your site with more creative freedom.</p>
			</div>
			`	
		},
		// {
		//     'thumbnail': 'preview/basic-01.png',
		//     'category': '120',
		//     'html': `
		// 	<div class="display">
		// 		<h1 class="uppercase size-42 font-semibold">Beautiful Content. Responsive.</h1>
		// 		<p><span class="italic">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></p>
		// 	</div>
		// 	`	
		// },
		{
		    'thumbnail': 'preview/basic-02.png',
		    'category': '120',
		    'html': `
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
			`	
		},
		{
		    'thumbnail': 'preview/basic-03.png',
		    'category': '120',
		    'html': `
			<h1>Heading 1 Text Goes Here.</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
			`	
		},
		{
		    'thumbnail': 'preview/basic-04.png',
		    'category': '120',
		    'html': `
			<h2>Heading 2 Text Goes Here.</h2>
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
			`	
		},

		{
		    'thumbnail': 'preview/basic-05.png',
		    'category': '120',
		    'html': `
			<img src="assets/minimalist-blocks/images/ai-4fA9e.jpg" alt="">
			`	
		},
        {
		    'thumbnail': 'preview/basic-24.png',
		    'category': '120',
		    'html': `
			<div class="row">
                <div class="column">
                    <h1 class="size-96"><span class="font-semibold size-96">About</span> us</h1>
                    <h3 class="size-21 tracking-wide">Founded in 2019</h3>
                </div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-21.png',
		    'category': '120',
			'mode': 'canvas',
		    'html': `
			<div class="is-block block-steady" style="top: 20%; left: 20%; width:540px;height: 300px" data-new-dummy="1">
				<div class="is-block-overlay" style="background-image: url(&quot;assets/minimalist-blocks/images/ai-4fA9e.jpg"&quot;); background-position: 50% 60%;"></div>
			</div>
			`,
			'html2': `
			<div class="row">
				<div class="column pt-0 pb-0 pl-0 pr-0 flex flex-col justify-center">
				<img src="assets/minimalist-blocks/images/ai-4fA9e.jpg" alt="">
				</div>
			</div>
			`
		},

		// {
		//     'thumbnail': 'preview/basic-05.png',
		//     'category': '120',
		//     'html': `
		// 	<img src="assets/minimalist-blocks/images/office2.png" alt="">
		// 	`	
		// },
		// {
		//     'thumbnail': 'preview/basic-21.png',
		//     'category': '120',
		// 	'mode': 'canvas',
		//     'html': `
		// 	<div class="is-block block-steady" style="top: 20%; left: 20%; width:540px;height: 300px" data-new-dummy="1">
		// 		<div class="is-block-overlay" style="background-image: url(&quot;assets/minimalist-blocks/images/person2.png&quot;); background-position: 50% 60%;background-color: rgb(254, 243, 226);"></div>
		// 	</div>
		// 	`	
		// },

		{
		    'thumbnail': 'preview/basic-06.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half">
						<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half">
						<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
        
		{
		    'thumbnail': 'preview/basic-07.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column two-third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<div class="spacer height-40"></div>
				</div>
			</div>
			`	
		},

		{
		    'thumbnail': 'preview/basic-23.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="font-semibold size-42 tracking-wider">Agency Name — We imagine, ideate, and execute with intention and drive to discover new ways of designing and detailing spaces.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="font-semibold tracking-wider size-19"><a href="#" title="" class="no-underline">Let's Talk</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>
			</div>
			`	
		},
        {
		    'thumbnail': 'preview/gallery-01.png',
		    'category': '120',
		    'html': `
				<div class="row">
                    <div class="column py-1" data-noedit 
                    data-dialog-width="1200px" 
                    data-dialog-height="740px" 
                    data-module="media-grid-builder" 
                    data-module-desc="Image Gallery" 
                    data-html="

							${encodeURIComponent(`
                            <div id="_style_{id}" style="display:none">
                            #{id}.is-media-grid {
                              column-count: 3;
                              column-gap: 10px;
                              padding: 0px;
                            }
                            #{id} .gallery-item {
                              position: relative;
                              break-inside: avoid;
                              border-radius: 0px;
                              margin-bottom: 10px;
                              line-height: 0; /* Eliminate extra space */
                              overflow: hidden;
                            }
                            #{id} .gallery-item img {
                              width: 100%;
                              height: auto;
                              transition: .8s all;
                              margin: 0;
                            }
                            #{id} .gallery-item .caption {
                              position: absolute;
                              bottom: 0;
                              left: 0;
                              width: 100%;
                              background-color: rgba(0, 0, 0, 0.4);
                              color: #fff;
                              padding: 12px 15px;
                              opacity: 0;
                              transition: all 0.8s ease;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              box-sizing: border-box;
                              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                              font-size: .9em;
                              font-weight: 200;
                              line-height: 1.2;
                            }
                            
                            #{id} .gallery-item .caption h4 {
                              font-weight: 300;
                              font-size: 1.1em;
                              margin: 0 0 0.1em;;
                            }
                            #{id} .gallery-item:hover .caption {
                              opacity: 1;
                            }
                  
                            /* Slide */
                            #{id} .gallery-item .caption {
                                transform: translateY(100%);
                                transition: transform 0.5s ease, opacity 0.5s ease;
                            }
                            #{id} .gallery-item:hover .caption {
                                transform: translateY(0%);
                                opacity: 1;
                            } 
                            
                            /* Caption Light */
                            #{id} .gallery-item .caption {
                                background-color: #fff;
                                color: #000;
                            }
                  
                            @media (max-width: 800px) {
                              #{id}.is-media-grid {column-count: 3;}
                            }
                            @media (max-width: 600px) {
                              #{id}.is-media-grid {column-count: 2;}
                            }
                            @media (max-width: 400px) {
                              #{id}.is-media-grid {column-count: 1;}
                            }
                  
                            #{id} .gallery-item a.glightbox {
                                pointer-events: none;
                            }

                            .gallery-item video {
                                height: auto; 
                                width: 100%;
                                object-fit: cover;
                            }
                            </div>
                            <div id="{id}" class="is-media-grid grid-sortable" style="opacity:0">
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-MILpb.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-MILpb.jpg" alt="My title">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-2JkRP.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-2JkRP.jpg" alt="My title">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-4mQ3H.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-4mQ3H.jpg" alt="">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                            
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-j6Oyc.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-j6Oyc.jpg" alt="My title">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-lMoX0.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-lMoX0.jpg" alt="My title">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                              <div class="gallery-item">
                                <a href="assets/minimalist-blocks/images/ai-xPlfu.jpg" class="glightbox" data-title="My title" data-description="This is the description">
                                  <img src="assets/minimalist-blocks/images/ai-xPlfu.jpg" alt="My title">
                                  <div class="caption">
                                    <h4>My title</h4>
                                    <div>This is the description</div>
                                  </div>
                                </a>
                              </div>
                            </div>
                            <script>
                            var docReady = function(fn) {
                                var stateCheck = setInterval(function() {
                                    if (document.readyState !== "complete") return;
                                    clearInterval(stateCheck);
                                    fn();
                                }, 1);
                            };
                  
                            docReady(function() {
                              var cssElm = document.querySelector('#_style_{id}');
                              if(!cssElm) return;
                              var css = cssElm.innerHTML;
                              var head = document.getElementsByTagName('head')[0];
                              var s = document.createElement('style');
                              s.appendChild(document.createTextNode(css));
                              head.appendChild(s);
                  
                              var grid = document.getElementById('{id}');
                          
                              if (typeof GLightbox === 'undefined') {
                                var lightboxCss = document.createElement('link');
                                lightboxCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/css/glightbox.min.css';
                                lightboxCss.rel = 'stylesheet';
                          
                                var lightboxJs = document.createElement('script');
                                lightboxJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/js/glightbox.min.js';
                                lightboxJs.async = true; // Ensure script is executed after load
                                lightboxJs.defer = true; // Ensure script is executed in order

                                lightboxJs.onload = function() {
                                    initializeLightbox(grid);
                                };
                    
                                document.head.appendChild(lightboxCss);
                                document.head.appendChild(lightboxJs);

                              } else {

                                initializeLightbox(grid);

                              }
                          
                            });

                            function initializeLightbox(grid) {
                                if (typeof GLightbox !== 'undefined') {
                                    setTimeout(() => {
                                        grid.style.opacity = '';
                                    }, 100);
                        
                                    const lightbox = GLightbox({
                                        touchNavigation: true,
                                        selector: '#{id} .glightbox',
                                        loop: true,
                                        autoplayVideos: true,
                                        zoomable: true,
                                        slideEffect: 'slide',
                                        descPosition: 'bottom',
                                        skin: 'light'
                                    });
                                } else {
                                    setTimeout(() => {
                                        initializeLightbox(grid);
                                    }, 100); // Retry after a short delay if still undefined
                                }
                            }
                            </script>					
							
							`)}

                        " 
						
						data-settings="

							${encodeURIComponent(`
                            {
                              "gap": 10,
                              "cols": 3,
                              "rounded": 0,
                              "theme": "light",
                              "hover": "",
                              "captionPos": "bottom",
                              "captionEffect": "slide",
                              "captionTheme": "light",
                              "slideEffect": "slide",
                              "zoomable": "yes",
                              "lightbox": "disabled"
                            }
                          `)}
						
						">

                    </div>
                </div>
			`	
		},
/*
        {
		    'thumbnail': 'preview/gallery-01.png',
		    'category': '120',
		    'html': `
				<div class="row">
                    <div class="column" data-noedit 
                    data-dialog-width="1220px" 
                    data-dialog-height="85vh" 
                    data-module="form-builder" 
                    data-module-desc="Form Builder" 
                    data-html="

							${encodeURIComponent(`

                            <div id="_style_{id}" style="display:none">
                                .animate-spin {
                                    animation: spin 1s linear infinite;
                                }
                                @keyframes spin {
                                    from {
                                        transform: rotate(0deg);
                                    }
                                    to {
                                        transform: rotate(360deg);
                                    }
                                }
                            </div>
                            <form id="form_{id}" method="POST" action="/formsubmission" style="padding: 25px 0 20px">
                                <div id="{id}"></div>

                                <button id="btn_send_{id}" type="submit" class="transition-all inline-flex items-center whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-6 mb-1 py-2 size-18 px-8 text-black leading-relaxed rounded border-transparent hover:border-transparent font-normal tracking-wide" style="background-color: rgb(240, 240, 240);">Submit</button>
                            
                                <div id="status_{id}"></div>
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
                                    fn();
                                }, 1);
                            };
                  
                            docReady(function() {
                    
                                var elm = document.getElementById('{id}');
                                var viewer = new FormViewer(elm, {
                                    onChange: (json) => {
                                        // console.log(json);
                                    },
                                    // formHeader: false,
                                });

                                let json = {
    "title": "Register for the Tech Conference",
    "description": "Join us for an insightful and engaging experience.",
    "elements": [
        {
            "title": "Full Name:",
            "name": "full_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "Enter your full name"
        },
        {
            "title": "Ticket Type:",
            "name": "ticket_type",
            "type": "select",
            "isRequired": true,
            "choices": [
                "Standard Admission",
                "VIP Admission",
                "Student Discount"
            ]
        },
        {
            "title": "Select the sessions you’re interested in:",
            "name": "select_the_sessions_youre_interested_in",
            "type": "multi-select",
            "choices": [
                "Keynote Speech",
                "AI Workshop",
                "Networking Session",
                "Panel Discussion"
            ]
        },
        {
            "title": "Are you attending the networking dinner?",
            "name": "are_you_attending_the_networking_dinner",
            "type": "switch"
        },
        {
            "title": "Email:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "Enter your email"
        }
    ]
};
                                
                                viewer.view(json); // Render form

                                const form = document.querySelector('#form_{id}');

                                var btnSend = document.querySelector('#btn_send_{id}');

                                var statusInfo = document.querySelector('#status_{id}');

                                async function handleSubmit(event) {
                                    event.preventDefault();

                                    btnSend.innerHTML = '<span class="loading-icon"><svg class="animate-spin" style="margin-right:7px;width:20px;height:20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>Submit';

                                    var data = new FormData(event.target);
                                    fetch(event.target.action, {
                                        method: form.method,
                                        body: data,
                                        headers: {
                                            'Accept': 'application/json'
                                        }
                                    }).then(response => {
                                        if (response.ok) {
                                            statusInfo.innerHTML = '<div class="text-center pt-4"><i class="bi bi-send-check size-64"></i>' +
                                            '</div><div class="leading-11 text-center size-38 pb-4">Thanks for your submission!</div>';
                                            form.reset();
                                        } else {
                                            response.json().then(data => {
                                                if (Object.hasOwn(data, 'errors')) {
                                                    statusInfo.innerHTML = data['errors'].map(error => error['message']).join(', ');
                                                } else {
                                                    statusInfo.innerHTML = '<div class="leading-11 text-center size-38 pt-4 pb-4">Oops! There was a problem submitting your form.</div>';
                                                }
                                            });
                                        }

                                        btnSend.innerHTML = 'Submit';
                                    }).catch(error => {
                                        statusInfo.innerHTML = '<div class="leading-11 text-center size-38 pt-4 pb-4">Oops! There was a problem submitting your form.</div>';

                                        btnSend.innerHTML = 'Submit';
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
    "title": "Register for the Tech Conference",
    "description": "Join us for an insightful and engaging experience.",
    "elements": [
        {
            "title": "Full Name:",
            "name": "full_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "Enter your full name"
        },
        {
            "title": "Ticket Type:",
            "name": "ticket_type",
            "type": "select",
            "isRequired": true,
            "choices": [
                "Standard Admission",
                "VIP Admission",
                "Student Discount"
            ]
        },
        {
            "title": "Select the sessions you’re interested in:",
            "name": "select_the_sessions_youre_interested_in",
            "type": "multi-select",
            "choices": [
                "Keynote Speech",
                "AI Workshop",
                "Networking Session",
                "Panel Discussion"
            ]
        },
        {
            "title": "Are you attending the networking dinner?",
            "name": "are_you_attending_the_networking_dinner",
            "type": "switch"
        },
        {
            "title": "Email:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "Enter your email"
        }
    ]
},
                                "thankYouMessage": "Thanks for your submission!",
                                "errorMessage": "Oops! There was a problem submitting your form.",
                                "buttonText": "Submit",
                                "hideHeader": false,
                                "formAction": "/formsubmission"
                            }
                          `)}
						
						">

                    </div>
                </div>
			`	
		},
        */

		/*
		{
		    'thumbnail': 'preview/basic-08.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 100%;">
					<h2 class="size-28 tracking-wider font-light capitalize">Our Works</h2>
					<div class="spacer height-80"></div>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half" style="width: 60.7087%; flex: 0 0 auto;">
					<div class="spacer height-60"></div>
				</div>

			</div>
			`	
		},
		*/
		{
		    'thumbnail': 'preview/basic-09.png',
		    'category': '120',
		    'html': `
			<div class="row sm-autofit">
				<div class="column sm-hidden fourth">
					<div class="spacer height-40"></div>
				</div>
				<div class="column half">
					<h2 class="text-center font-semibold">Examples</h2>
					<p class="text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
				<div class="column sm-hidden fourth">
					<div class="spacer height-40"></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-10.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 leading-11 font-semibold">Everything you need is here..</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row clearfix">
				<div class="column half" style="width: 39.8078%; flex: 0 0 auto;">
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half xs-hidden" style="width: 100%;">
					<div class="spacer height-40"></div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-11.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="text-center size-42 leading-11 font-semibold">Great things don’t have to be complicated.</h2>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div style="width: 17.9305%; flex: 0 0 auto;" class="column third">
					<div class="spacer height-40"></div>
				</div>
				<div style="width: 64.8476%; flex: 0 0 auto;" class="column third">
					<p class="text-center">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third" style="width: 17.1747%; flex: 0 0 auto;">
					<div class="spacer height-40"></div>
				</div>

			</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/basic-12.png',
		    'category': '120',
		    'html': `
<div class="row">
    <div class="column half" style="width: 57.6087%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-4DbMv.jpg" alt=""></div>
    <div class="column half flex justify-center flex-col items-center" style="width: 100%;">
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-13.png',
		    'category': '120',
		    'html': `
<div class="row">
<div class="column half flex justify-center flex-col items-center" style="width: 100%;">
    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
</div>
<div class="column half" style="width: 58.8043%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-Vg1LJ.jpg" alt="" data-filename="ai-xgcEE-editdYnaSM4.png"></div>
</div>`	
		},


		/* elements */
		{
		    'thumbnail': 'preview/basic-textslider.png',
		    'category': '120',
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
													<h3 class="font-semibold">Item 1</h3>
													<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">Item 2</h3>
													<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">Item 3</h3>
													<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
												</div>
											</div>
											<div class="glide__slide">
												<div class="is-subblock flex-col" data-subblock>
													<h3 class="font-semibold">Item 4</h3>
													<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
		    'html': `
			<video style="width: 100%;" loop="" autoplay="">
				<source src="assets/minimalist-blocks/images/ai-cQ5ST.mp4" type="video/mp4">
			</video>
			`	
		},
		/* /elements */

		{
		    'thumbnail': 'preview/basic-14.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 55%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-ER9hZ.jpg" alt=""></div>
				<div class="column half">
					<p>In a sunlit room, a graceful plant stands in a white vase on a minimalist wooden table. Its lush green leaves reach toward the light, casting soft shadows on pale walls. The serene setting invites calm reflection, where nature and simplicity exist in quiet harmony.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-15.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half">
					<p>In a bright, sunlit room, a vibrant yellow sofa sits against a smooth white wall, its clean lines softened by a plush white pillow. Sunlight pours in, casting gentle shadows across the floor. This warm, inviting corner blends comfort and simplicity, creating a cheerful space for rest, reflection, and quiet joy.</p>
				</div>
				<div class="column half" style="width: 55%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-upOUB.jpg" alt=""></div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-16.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 55%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-twdt4.jpg" alt=""></div>
				<div class="column half flex flex-col justify-end items-start">
					<p>In a calm, minimalist room, a simple rack holds neatly arranged outfits in soft and bold tones. Black heels rest nearby on warm wooden flooring, and a small table with a clear vase adds a touch of natural elegance.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-17.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column half flex flex-col justify-end items-start">
					<p>Sunlight streams through the window, glowing on the wooden steps. The soft, neutral walls and minimalist design create a serene escape—each step leading to quiet moments of peace. Light and shadow speak in simplicity.</p>
				</div>
				<div class="column half" style="width: 55%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-Ur8t8.jpg" alt=""></div>
			</div>
			`	
		},


		{
		    'thumbnail': 'preview/basic-slider.png',
		    'category': '120',
			'type': 'slick',
		    'html': 
				'<div class="row">' +
                    '<div class="column full" data-noedit data-module="slider" data-module-desc="Slider" data-html="' +

                        encodeURIComponent('<div id="{id}" class="slider-on-content" style="position:absolute;top:0;left:0;width:100%;height:100%;display:none">' +
                            '<div class="is-boxes slider-image" style="background-image: url(\'assets/minimalist-blocks/images/ai-w6ntC.jpg\');">' +
                            '</div>' +
                            '<div class="is-boxes slider-image" style="background-image: url(\'assets/minimalist-blocks/images/ai-2mCK5.jpg\');">' +
                            '</div>' +
                            '<div class="is-boxes slider-image" style="background-image: url(\'assets/minimalist-blocks/images/ai-iiKdf.jpg\');">' +
                            '</div>' +
                        '</div>' +
                        '' +
                        '<scr' + 'ipt>' +
                            'var docReady = function (fn) {' +
                                'var stateCheck = setInterval(function () {' +
                                    'if (document.readyState !== "complete") return;' +
                                    'clearInterval(stateCheck);' +
                                    'try { fn() } catch (e) { }' +
                                '}, 1);' +
                            '};' +
                            'docReady(function () {' +
                                'jQuery("#{id}").css("display","block");' +
                                'jQuery("#{id}").slick({' +
                                    'dots: true,' +
                                    'arrows: true,' +
                                    'infinite: true,' +
                                    'speed: 500,' +
                                    'cssEase: "linear",' +
                                    'slidesToShow: 1,' +
                                    'autoplay: false,' +
                                    'autoplaySpeed: 3000,' +
                                    'fade: false,' +
                                    'adaptiveHeight: true' +
                                '});' +
                            '});' +
                        '</scr' + 'ipt>' +
                        '') +

                        '" data-settings="' +

                        encodeURIComponent('[' +
                                '{' +
                                    '"auto":false,' +
                                    '"arrow":true,' +
                                    '"dots":true,' +
                                    '"fade":false,' +
                                    '"height":"500",' +
                                    '"images":' +
                                        '[' +
                                            '{' +
                                                '"src": "assets/minimalist-blocks/images/ai-w6ntC.jpg", ' +
                                                '"caption": "", "link": "", "width": "450", "align": "", "position": "bottom left"' +
                                            '},' +
                                            '{' +
                                                '"src": "assets/minimalist-blocks/images/ai-2mCK5.jpg", ' +
                                                '"caption": "", "link": "", "width": "450", "align": "", "position": "bottom left"' +
                                            '},' +
                                            '{' +
                                                '"src": "assets/minimalist-blocks/images/ai-iiKdf.jpg", ' +
                                                '"caption": "", "link": "", "width": "450", "align": "", "position": "bottom left"' +
                                            '}' +
                                        ']' +
                                '}]') + '"' +

                    '>' +

		            '</div>' +
			    '</div>'
		},
		{
		    'thumbnail': 'preview/basic-slider.webp',
		    'category': '120',
			'type': 'glide',
		    'html': `
				<div class="row">
                    <div class="column full py-1 is-light-text" data-noedit data-module="slider-builder" data-module-desc="Slider" data-html="

							${encodeURIComponent(`
								<div id="_style_{id}" style="display:none">
		
									#{id} .glide__arrow svg {
										fill: rgb(0,0,0) !important;
									}
		
								</div>
								<div id="{id}" class="glide cover" style="display:none">
									<div data-glide-el="track" class="glide__track">
										<ul class="glide__slides">
											<li class="glide__slide">
												<div data-subblock>
                                                    <video muted loop playsinline><source src="assets/minimalist-blocks/images/ai-xuSLh.mp4"></video>
                                                </div>
											</li>
											<li class="glide__slide">
												<div data-subblock><img data-image-embed data-noresize data-sync src="assets/minimalist-blocks/images/ai-lsDB4.jpg" alt="" /></div>
											</li>
										</ul>
									</div>

									<div class="glide__arrows" data-glide-el="controls">
										<button class="glide__arrow glide__arrow--left" data-glide-dir="<">
											<svg style="width:30px;height:30px;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
												<path d="M213.7 256L380.9 81.9c4.2-4.3 4.1-11.4-.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-.2L131.1 247.9c-2.2 2.2-3.2 5.2-3 8.1-.1 3 .9 5.9 3 8.1l204.2 212.7c4.2 4.3 11.2 4.2 15.5-.2l29.9-30.6c4.3-4.4 4.4-11.5.2-15.8L213.7 256z"></path>
											</svg>
										</button>
										<button class="glide__arrow glide__arrow--right" data-glide-dir=">">
											<svg style="width:30px;height:30px;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
												<path d="M298.3 256L131.1 81.9c-4.2-4.3-4.1-11.4.2-15.8l29.9-30.6c4.3-4.4 11.3-4.5 15.5-.2L380.9 248c2.2 2.2 3.2 5.2 3 8.1.1 3-.9 5.9-3 8.1L176.7 476.8c-4.2 4.3-11.2 4.2-15.5-.2L131.3 446c-4.3-4.4-4.4-11.5-.2-15.8L298.3 256z"></path>
											</svg>
										</button>
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
    if (!pre) {
        document.body.insertAdjacentHTML('beforeend', svgDef);
    }

    var docReady = function(fn) {
        var stateCheck = setInterval(function() {
            if (typeof Glide === 'undefined') return;
            clearInterval(stateCheck);
            try {
                fn()
            } catch (e) {}
        }, 1);
    };
    docReady(function() {
        document.querySelector("#{id}").style.display = "";

        const glideSlides = document.querySelectorAll('#{id} .glide__slide');

        const perView = 1;

        function stopVideo(slide) {
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            slide.classList.remove('active');
        }

        function playVideo(slide) {
            let video = slide.querySelector('video');
            if (video) {
                video.play();
            }
        }

        function coverflow(index) {
            let activeSlide = glideSlides[index];
            let nextSlide = activeSlide.nextElementSibling;
            let next2Slide;
            if (nextSlide) next2Slide = nextSlide.nextElementSibling;
            let next3Slide;
            if (next2Slide) next3Slide = next2Slide.nextElementSibling;

            activeSlide.classList.remove('glide__slide--previous');
            activeSlide.classList.remove('glide__slide--following');

            if (activeSlide.nextElementSibling) {
                activeSlide.nextElementSibling.classList.remove('glide__slide--previous');
                activeSlide.nextElementSibling.classList.remove('glide__slide--following');
                activeSlide.nextElementSibling.classList.add('glide__slide--following');
            }

            if (activeSlide.previousElementSibling) {
                activeSlide.previousElementSibling.classList.remove('glide__slide--previous');
                activeSlide.previousElementSibling.classList.remove('glide__slide--following');
                activeSlide.previousElementSibling.classList.add('glide__slide--previous');
            }

            if (perView === 1 || perView === 2 || perView === 3 || perView === 4) playVideo(activeSlide);
            if ((perView === 2 || perView === 3 || perView === 4) && nextSlide) playVideo(nextSlide);
            if ((perView === 3 || perView === 4) && next2Slide) playVideo(next2Slide);
            if (perView === 4 && next3Slide) playVideo(next3Slide);

            activeSlide.classList.add('active');

            let elms = activeSlide.parentNode.querySelectorAll('.glide__slide');
            elms.forEach(elm => {
                if (elm === activeSlide) return;
                if (perView === 2)
                    if (elm === activeSlide || elm === nextSlide) return;
                if (perView === 3)
                    if (elm === activeSlide || elm === nextSlide || elm === next2Slide) return;
                if (perView === 4)
                    if (elm === activeSlide || elm === nextSlide || elm === next2Slide || elm === next3Slide) return;

                stopVideo(elm);
            });

            const slider = activeSlide.closest('.glide');
            slider.classList.add('running');
        }

        let myslider = document.querySelector("#{id}");
        let _{id};

        setTimeout(() => {

            if (myslider.classList.contains('coverflow')) {

                _{id} = new Glide(myslider, {
                    type: "carousel",
                    autoplay: false,
                    animationDuration: 1000,
                    gap: 0,
                    perView: 3,
                    startAt: 2,
                    hoverpause: false,
                    arrow: true,
                    dots: false,
                    breakpoints: {
                        575: {
                            perView: 1,
                            peek: 50
                        },

                        414: {
                            perView: 1,
                            peek: 40
                        },

                        360: {
                            perView: 1,
                            peek: 30
                        }
                    },
                    focusAt: "center",
                });

            } else {

                _{id} = new Glide("#{id}", {
                    type: "carousel",
                    autoplay: false,
                    animationDuration: 1000,
                    gap: 0,
                    perView: 1,
                    hoverpause: false,
                    arrow: true,
                    dots: false,
                    breakpoints: {

                        970: {
                            perView: 1,
                            gap: 0
                        }
                    },
                });

            }

            _{id}.on('mount.after', function() {
                coverflow(_{id}.index, true);
            });

            _{id}.on('run', function(event) {
                coverflow(_{id}.index);
            });

            _{id}.mount();

            _cleanClonedItems();

        }, 400);

    });

    function _cleanClonedItems() {
        var clones = document.querySelectorAll(".glide__slide--clone");
        Array.prototype.forEach.call(clones, function(clone) {
            try {
                clone.removeAttribute("data-subblock");
                clone.childNodes[0].removeAttribute("data-subblock");
            } catch (e) {}
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
								'"gap":0,' +
								'"perView":1,' +
								'"hoverpause":true,' +
								'"arrow":true,' +
								'"arrowColor": "rgb(0,0,0)",' +
								'"arrowPreset":2,' +
								'"dots":false,' +
								'"fit":"cover"' +
							'}')}
						
						">

                    </div>
                </div>
			`	
		},

		{
		    'thumbnail': 'preview/basic-18.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column third">
					<h2 class="size-48">01</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">Step One</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third">
					<h2 class="size-48">02</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">Step Two</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third">
					<h2 class="size-48">03</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-19 uppercase leading-12">Step Three</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-19.png',
		    'category': '120',
		    'html': `
			<div class="row">
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px;height: 40px;border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide size-24">Feature One</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px;height: 40px;border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide size-24">Feature Two</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px;height: 40px;border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide size-24">Feature Three</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},

		{
		    'thumbnail': 'preview/basic-20.png',
		    'category': '120',
		    'html': '<hr>'
		},

		{
		    'thumbnail': 'preview/basic-youtube.png',
		    'category': '120',
		    'html': `
				<div class="embed-responsive embed-responsive-16by9">
            		<iframe width="560" height="315" src="https://www.youtube.com/embed/P5yHEKqx86U?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            	</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-map.png',
		    'category': '120',
		    'html': `
				<div class="embed-responsive embed-responsive-16by9">
					<iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="mg1" src="https://maps.google.com/maps?q=Melbourne,+Victoria,+Australia&amp;hl=en&amp;sll=-7.981898,112.626504&amp;sspn=0.009084,0.016512&amp;oq=melbourne&amp;hnear=Melbourne+Victoria,+Australia&amp;t=m&amp;z=10&amp;output=embed"></iframe>
				</div>
			`	
		},
		{
		    'thumbnail': 'preview/basic-audio.png',
		    'category': '120',
		    'html': `
				<div style="display:flex;width:100%;position:relative;margin:15px 0;background: transparent;">
					<audio controls="" style="width:100%">
						<source src="assets/minimalist-blocks/example.mp3" type="audio/mpeg">
						Your browser does not support the audio element.
					</audio>
				</div>
			`	
		},

		{
		    'thumbnail': 'preview/basic-form.png',
		    'category': '120',
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
    "title": "Let’s Build Something Cool!",
    "description": "Fuel your creativity with ease.",
    "elements": [
        {
            "title": "Your Name:",
            "name": "your_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "Enter your name"
        },
        {
            "title": "Your Best Email:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "Enter your email"
        }
    ],
    "useSubmitButton": true,
    "submitText": "Let’s Go!"
};
                                
                                const initialFormData = JSON.stringify(json);
                                viewer.view(initialFormData); 

                                var statusInfo = document.querySelector('#status_{id}');

                                var form = document.querySelector('#form_{id}');

                                async function handleSubmit(event) {
                                    event.preventDefault();

                                    var btnSend = form.querySelector('.btn-submitform');
                                    
                                    btnSend.innerHTML = '<span class="loading-icon"><svg class="animate-spin" style="margin-right:7px;width:20px;height:20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>Submit';

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
                                            '</div><div class="leading-14 text-center size-38 pb-4">Thanks for your submission!</div>';
                                            form.reset();

                                            elm.classList.add('collapsed');
                                            setTimeout(function(){
                                                statusInfo.classList.remove('collapsed');
                                            },300);

                                        } else {
                                            statusInfo.innerHTML = '<div class="leading-14 text-center size-38 pt-4 pb-4">Oops! There was a problem submitting your form.</div>';
                                        
                                            // elm.classList.toggle('collapsed');
                                            setTimeout(function(){
                                                // statusInfo.innerHTML = data.error;
                                                statusInfo.classList.remove('collapsed');
                                            },300);
                                        }

                                        btnSend.innerHTML = 'Submit';
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
    "title": "Let’s Build Something Cool!",
    "description": "Fuel your creativity with ease.",
    "elements": [
        {
            "title": "Your Name:",
            "name": "your_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": "Enter your full name"
        },
        {
            "title": "Your Best Email:",
            "name": "email",
            "type": "email",
            "isRequired": true,
            "placeholder": "Enter your email"
        }
    ],
    "useSubmitButton": true,
    "submitText": "Let’s Go!"
},
                                "thankYouMessage": "Thanks for your submission!",
                                "errorMessage": "Oops! There was a problem submitting your form.",
                                "buttonText": "Submit",
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
		    'html': `
			<div class="row">
				<div class="column full" data-noedit data-html="

					${encodeURIComponent(`<h1 id="{id}">Lorem ipsum</h1>
						<p>This is a custom code block. To edit, select this block and click the Settings button.</p>
						<script>
						var docReady = function (fn) {
							var stateCheck = setInterval(function () {
								if (document.readyState !== "complete") return;
								clearInterval(stateCheck);
								try{fn()}catch(e){}
							}, 1);
						};
						docReady(function() {
							document.querySelector(\'#{id}\').innerHTML =\'<b>Code Block</b>\';
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
		    'html': `
			<div class="row">

				<div class="column full">
					<h1 class="text-center leading-none size-64 font-extralight">Words From Heart</h1>
					<div class="spacer height-20"></div>
					<p class="text-center uppercase tracking-125 size-14" style="color: rgb(102, 102, 102);">By Selma Laursen</p>
				</div>
			</div>

			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="flex flex-col justify-center column full">
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.&nbsp;</p>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.&nbsp;<br></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-02.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-54 font-normal">Twenty Four Minutes</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="size-16 text-center font-normal">William Norris</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-03.png',
		    'category': '118',
		    'html': `
<div class="row relative sm-items-1">
    <div class="py-6 flex flex-col justify-center column third">
        <h1 class="leading-none size-28 font-normal">Fascinating Places, Great Journey.</h1>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div class="flex flex-col justify-center items-center column two-third"><img src="assets/minimalist-blocks/images/ai-EiDeP.jpg" alt=""></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-04.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-150 size-14">Heart-warming story from<br class="size-14">Wilhelmina Bradley</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h1 class="size-42 font-semibold">Best friend</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-05.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="size-16">A BEAUTIFUL DAY IN OCTOBER</p>
					<h1 class="uppercase leading-none font-bold size-42">Time to think, time to create.</h1>
					<p class="size-16">— By David Anderson</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<p class="text-justify">Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.</p>
				</div>
				<div class="column half">
					<p class="text-justify">Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-06.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column two-third">
					<p style="color: rgb(102, 102, 102);" class="tracking-75 size-15">WORDS FROM ANDREW JONES</p>
					<h1 class="leading-none font-light size-64">Home is wherever I'm with you.</h1>
				</div>
				<div class="column third">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column two-third">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</div>
				<div class="column third">
					<div class="spacer height-60"></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-07.png',
		    'category': '118',
		    'html': `
<div class="row relative sm-items-1">
    <div class="flex flex-col justify-center items-center column two-third" style="width: 100%;"><img src="assets/minimalist-blocks/images/ai-SyNxZ.jpg" alt="" style="width: 99.9136%; height: auto;" data-filename="ai-2XpKE-editndwr5cw.png"></div>
    <div class="py-6 flex flex-col justify-center column third" style="width: 33.2943%; flex: 0 0 auto;">
        <h1 class="leading-none size-64 font-medium">flying high</h1>
        <div class="spacer height-20"></div>
        <p class="text-justify italic font-light size-16">By&nbsp;Nicklas Henriksen</p>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-08.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="leading-none font-medium size-64">just chillin'</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half" style="width: 100%;">
					<p class="italic" style="color: rgb(138, 138, 138);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<p class="font-semibold size-16">By Anne Marry</p>
				</div>
				<div class="column half xs-hidden" style="width: 49.9563%; flex: 0 0 auto;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row sm-autofit">
				<div class="column full sm-hidden xs-hidden">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row md-autofit">
				<div class="column third md-hidden">
					<div class="spacer height-40"></div>
				</div>
				<div class="column third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-09.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center size-42" style="letter-spacing: 10px;">CLEAN</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="size-16 text-center italic">By Michael Williams</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet. Vivamus ante.</p>
				</div>
				<div class="column half">
					<p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet. Vivamus ante.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-10.png',
		    'category': '118',
		    'html': `
<div class="row">
    <div class="column third" style="width: 36.7206%; flex: 0 0 auto;">
        <h3 class="size-42 font-normal leading-11">Fascinating Places, Great Journey.</h3>
        <p class="size-17 leading-14" style="color: rgb(145, 145, 145);">80 days around the world, we’ll find a pot of gold just sitting where the rainbow’s ending.</p>
    </div>
    <div class="column two-third xs-hidden" style="width: 100%;">
        <div class="spacer height-80"></div>
    </div>
</div>
<div class="row sm-autofit">
    <div class="column full xs-hidden sm-hidden">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column">
        <p class="text-justify">80 days around the world, we’ll find a pot of gold just sitting where the rainbow’s ending. Time — we’ll fight against the time, and we’ll fly on the white wings of the wind. 80 days around the world, no we won’t say a word before the ship is really back. Round, round, all around the world.</p>
    </div>

    <div class="column">
        <p class="text-justify">80 days around the world, we’ll find a pot of gold just sitting where the rainbow’s ending. Time — we’ll fight against the time, and we’ll fly on the white wings of the wind. 80 days around the world, no we won’t say a word before the ship is really back. Round, round, all around the world.</p>
    </div>
</div>
<div class="row">
    <div class="column">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="column" style="width: 74.7826%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-TDcyw.jpg" alt="" data-filename="ai-ls8Ku-edityZX70Ci.png"></div>

    <div class="column flex flex-col justify-end items-start" style="width: 100%;">
        <p class="text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-11.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 74.0084%; flex: 0 0 auto;">
					<h1 class="leading-none font-medium size-64">Simple, Clean, Bright</h1>
				</div>
				<div class="column half" style="width: 100%;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-140"></div>
				</div>
			</div>
			<div class="row relative md-items-2">
				<div class="flex flex-col justify-end column third">
					<p class="leading-none size-16">Written by<br><span class="font-semibold">Samantha Holmes</span></p>
				</div>
				<div class="column third">
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<p class="text-left">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-12.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full pb-4">
					<h1 class="text-center leading-none font-extralight size-64">We fall in love with minimalist style</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-160"></div>
				</div>
			</div>
			<div class="row md-autofit sm-autofit">
				<div class="column half">
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
				</div>
				<div class="md-hidden sm-hidden xs-hidden column fourth">
					<div class="spacer height-80"></div>
				</div>
				<div class="flex flex-col justify-end items-end column fourth">
					<p class="leading-12 text-justify italic font-light size-16">By&nbsp;Nicklas Henriksen</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-13.png',
		    'category': '118',
		    'html': `
<div class="row relative sm-items-2">
    <div style="width: 42.6729%; flex: 0 0 auto;" class="column half flex flex-col justify-end pb-3"><img src="assets/minimalist-blocks/images/ai-hdeid.jpg" alt="" data-filename="ai-CbyDu-editoSan1S2.png">
    </div>
    <div style="width: 100%;" class="column fourth">
        <h1 class="leading-none uppercase font-semibold size-28">Home is Where Your Story Begins</h1>
        <p class="font-semibold size-14">Jonathan Courtright</p>
    </div>
    <div style="width: 100%;" class="flex flex-col justify-end column fourth">
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type.</p>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-14.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-144 leading-none font-medium">A Place</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h3 class="size-21">Where Ideas Grow</h3>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row md-autofit sm-autofit">
				<div class="md-hidden sm-hidden column half">
					<div class="spacer height-40"></div>
				</div>
				<div class="column half">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="leading-12 font-semibold size-14">Ralph Whisler</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-15.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-35 font-normal">Fying High</h1>
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
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.</p>
					<p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.</p>
					<p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-16.png',
		    'category': '118',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="font-semibold size-54 leading-09">Keep Everything Simple</h1>
    </div>
</div>
<div class="row">
    <div class="column full xs-hidden">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column" style="width: 57.8261%; flex: 0 0 auto;">
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

    </div>
    <div class="column" style="width: 10.5435%; flex: 0 0 auto;">
        <div class="spacer height-80"></div>
    </div>
    <div style="width: 100%;" class="column">
        <p style="color: rgb(145, 145, 145);">Words from<br>Brandon Lamberth</p>
    </div>
</div>
<div class="row">
    <div class="column">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="column"><img src="assets/minimalist-blocks/images/ai-lsDB4.jpg" alt="" data-filename="ai-mDJ0J-editoqZd279.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-17.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="size-21 text-center italic tracking-150">the</p>
					<h1 class="size-54 text-center tracking-200">OCEAN</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-center">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus leo ante, consectetur sit amet vulputate vel, dapibus sit amet lectus.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-center"><span class="italic">Spencer Lane</span></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-18.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="uppercase leading-none font-medium size-48">Words From Heart</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="size-15">By Stephen Garcia</p>
				</div>
			</div>
			<div class="row sm-autofit">
				<div class="column full xs-hidden sm-hidden">
					<div class="spacer height-160"></div>
				</div>
			</div>
			<div class="row md-autofit sm-autofit">
				<div class="column fourth md-hidden sm-hidden" style="width: 12.5371%; flex: 0 0 auto;">
					<div class="spacer height-20"></div>
				</div>
				<div class="column fourth" style="width: 100%;">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
				<div class="column fourth" style="width: 100%;">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column fourth" style="width: 100%;">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-19.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-200">A Story</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h1 class="font-semibold leading-08 size-120">Dancing in Harmony</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-450 text-left">Annie Baldwin</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row md-autofit">
				<div style="width: 100%;" class="column fourth md-hidden">
					<div class="spacer height-20"></div>
				</div>
				<div style="width: 51.1918%; flex: 0 0 auto;" class="column half">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div style="width: 100%;" class="column fourth md-hidden">
					<div class="spacer height-20"></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-20.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div style="width: 60.7741%; flex: 0 0 auto;" class="column half">
					<p class="size-16">Words by<br>Samantha Jones</p>
				</div>
				<div style="width: 100%;" class="column half">
					<h1 class="leading-12 size-72">hello.<br>hello..<br>hello...</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-140"></div>
				</div>
			</div>
			<div class="row relative md-items-2">
				<div class="column third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/article-21.png',
		    'category': '118',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center leading-none size-88 font-semibold" style="color: rgb(196, 196, 196);">Sunday Lovely Sunday.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column half">
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="size-16 text-center"><i style="color: rgb(138, 138, 138);">By Jennifer Anderson</i></p>
				</div>
			</div>
			`	
		},


		/* Headline */
		{
		    'thumbnail': 'preview/headline-01.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-42 is-title4-48 inline-block tracking-125">STUNNING</h1>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-02.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full center">
					<i class="icon ion-coffee leading-none size-60"></i>
					<h1 class="font-medium size-54">Café &amp; Bistro</h1>
					<p><span class="italic">Lorem Ipsum is simply dummy text</span></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-03.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="font-light size-64 leading-11">Planning a memorable trip? You came to the right place.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="center"><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mt-2 mb-1 py-2 size-17 text-black leading-12 rounded border-transparent hover:border-transparent font-normal tracking-wide px-2 mr-5 ml-0 underline" data-bg="">Get in Touch</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide">View Destinations</a></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-04.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="font-semibold size-42 tracking-wider">Struggling to find the perfect event organizer? No worries. We're here to help you creating the event like no other.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full text-center">
					<p class="font-semibold tracking-wider"><a href="#" title="" class="no-underline">Book a Call&nbsp;</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-05.png',
		    'category': '101',
		    'html': `
			<div class="row clearfix">
				<div class="column full">
					<h1 class="normal-case tracking-tight text-center font-normal size-64 leading-11">Great things don’t have to be complicated.</h1>
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
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide" style="background-color: rgb(240, 240, 240);">How We Work</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">Get In Touch</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-06.png',
		    'category': '101',
		    'html': `
<div class="row relative sm-items-1">
    <div class="column py-6 flex flex-col justify-center items-start" style="width: 100%;">
        <h1 class="font-normal leading-09 size-35">Great things don’t have to be complicated.</h1>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        <div class="text-center">
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Take a Tour</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed" title="">Get In Touch</a>
        </div>
    </div>
    <div class="column flex flex-col justify-center items-center" style="width: 60.5435%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-2K7j5.jpg" alt=""></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-07.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column two-fourth">
					<h1 class="normal-case font-normal size-64 leading-none">Learn anytime, anywhere, and grow your skills.</h1>
				</div>
				<div class="column fourth">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">Get Started</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide" title="">Explore&nbsp;<i class="icon ion-android-arrow-forward"></i></a>
					</div>
				</div>
			</div>
			`	
		},

		{
		    'thumbnail': 'preview/headline-17.png',
		    'category': '101',
		    'html': `
<div class="row relative sm-items-1">
    <div class="column half" style="width: 42.1053%; flex: 0 0 auto;">
        <div class="spacer height-40"></div>
        <h1 class="tracking-wide leading-none font-medium size-48">Build Anything Beautifully</h1>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <div class="spacer height-20"></div>

        <div class="button-group">
            <a href="#preview" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Preview</a>
            <a href="#buynow" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 text-black leading-14 rounded-full border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">Buy Now</a>
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

		{
		    'thumbnail': 'preview/headline-08.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center leading-none tracking-tight size-84 font-medium">Build and design without limits.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="xs-hidden column fourth" style="width: 100%;">
					<div class="spacer height-20"></div>
				</div>
				<div style="width: 60.2224%; flex: 0 0 auto;" class="column half">
					<p class="text-center" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="xs-hidden column fourth" style="width: 100%;">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide" style="background-color: rgb(240, 240, 240);">Read More</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">Get Started</a>
					</div>
				</div>
			</div>
			`	
		},

		{
		    'thumbnail': 'preview/headline-18.png',
		    'category': '101',
		    'html': `
<div class="row clearfix relative sm-items-1">
    <div class="flex justify-center flex-col column two-third" style="width: 42.2368%; flex: 0 0 auto;">
        <h1 class="tracking-wide leading-none font-medium size-48">Keep Everything Simple</h1>
        <div class="spacer height-20"></div>

        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <div class="spacer height-20"></div>

        <div class="button-group">
            <a href="#preview" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Preview</a>
            <a href="#buynow" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 text-black leading-14 rounded-full border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">Buy Now</a>
        </div>
    </div>
    <div style="position: relative; min-height: 30vh; width: 57.7174%;" class="flex flex-col justify-center items-center column third">
        <div class="is-dock" style="margin:50px 0">
            <div style="width: 120%;left: 40%;top: 4%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-4eEUt.jpg" style="width: 100%;" data-bottom-top="transform: translateX(130px);" data-center="transform: translateX(0px);" data-filename="ai-rBr7d-editfXtbiw6.png">
            </div>
            <div style="width: 58%;left: 13%;top: 56%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-cvlfg.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(75px);" data-center-top="transform: translateX(0px);" data-center-bottom="transform: translateX(0px);" data-top-bottom="transform: translateX(75px);" data-filename="ai-lMoX0-editiapPoPs.png">
            </div>
            <div style="width: 58%;left: 89%;top: 56%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-XUe84.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(125px);" data-center-top="transform: translateX(0px);" data-center-bottom="transform: translateX(0px);" data-top-bottom="transform: translateX(100px);" data-filename="ai-EjMa5-editTiWcFjJ.png">
            </div>
        </div>
    </div>
</div>
			`	
		},

		{
		    'thumbnail': 'preview/headline-09.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center size-76 font-normal leading-11">simplicity &amp; sophistication</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-center size-16">We are a team of dedicated designers specialized in visual identity design.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full text-center">
					<p class="font-semibold tracking-wider"><a href="#" title="" class="no-underline">Start a Project&nbsp;</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-10.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="leading-none font-normal size-54">A forward thinking studio delivering digital solutions that help your business.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal size-14 uppercase tracking-125" title="" style="background-color: rgb(240, 240, 240);">Our Works</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full size-14 tracking-125 uppercase" title="">Get Started</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-11.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="leading-none font-light size-64">Every flavor tells a story</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third flex flex-col justify-center items-start">
					<div>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Explore Menu</a>
					</div>
				</div>
				<div class="text-left column two-third flex flex-col justify-center items-start">
					<div class="text-left">
						<a href="#" title="" class="flex items-center" style="text-decoration:none">
                        <i class="icon ion-android-arrow-dropright-circle mr-3 size-48"></i> Show Reel</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-12.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="tracking-75 size-16">Your reliable partner.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h1 class="leading-none font-normal size-60">Experience results-oriented IT consulting.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 text-black leading-14 rounded-full border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">Book a Call</a>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">How We Work</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-13.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div style="width: 67.5072%; flex: 0 0 auto;" class="column half">
					<h1 class="normal-case font-light tracking-tight leading-none size-50"><span class="font-semibold size-50">We're [CompanyName].</span><br class="size-50">Mobile app development with a spark of creativity.</h1>
					<div class="spacer height-40"></div>
					<div>
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title=""><i class="icon ion-android-arrow-dropright"></i>&nbsp; Our Showreel</a>
					</div>
				</div>
				<div class="column half flex flex-col justify-start items-end pt-3" style="width: 35.7593%;">
					<p class="size-42 font-medium leading-none"><a href="#" title="" class="size-32">Let's Talk</a></p>
					<p class="text-right">You’ll be talking with our technology experts.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-14.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="text-center uppercase tracking-250 size-16">Hello Friends</p>
					<h1 class="text-center leading-11 uppercase tracking-wide size-42 font-medium">This is Dave. I Develop Websites and Design Beautiful Things You Will Love</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p class="text-center"><a href="#" title="" class="no-underline font-semibold">Start a Project</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-15.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="text-center size-17 tracking-300">TRAVEL AGENCY</p>
					<h1 class="text-center leading-none tracking-wide font-normal size-64" style="font-style: normal;">Where Will You Go Today?</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="center" style="margin: 15px 0"><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-solid mt-2 mb-1 py-2 border-current hover:border-current font-normal leading-relaxed rounded size-14 uppercase tracking-125 border-0 underline px-2 mr-5 ml-0">Get in Touch</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-8 border-current hover:border-current font-normal leading-relaxed rounded size-14 uppercase tracking-125">View Destinations</a></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/headline-16.png',
		    'category': '101',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="size-14 tracking-75">Branding &amp; Digital Marketing</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h1 class="leading-none font-light size-50">We've put together a special combination of design, strategy, and digital expertise.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>
				<div class="column half">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<p><a href="#" title="" class="no-underline font-semibold">Start a Project</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>
			</div>
			`	
		},
		
		/* Buttons */
		{
		    'thumbnail': 'preview/buttons-01.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-8 border-current hover:border-current font-normal leading-relaxed rounded-none size-15 tracking-widest" title=""><i class="icon ion-android-arrow-dropright"></i>&nbsp; Take a Tour</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed" title="">Get in Touch</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-02.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed" title="">Get Started</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-8 border-current hover:border-current font-normal leading-relaxed rounded-none size-15 tracking-widest" title="">View Demo</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-03.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide" title=""><i class="icon ion-android-arrow-dropright"></i>&nbsp; Our Showreel</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mt-2 mb-1 py-2 size-18 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 ml-3 mr-3 underline" title="" data-bg="">Get In Touch</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-04.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mt-2 mb-1 py-2 size-18 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal tracking-wide underline px-2 ml-3 mr-3" data-bg="">Read More</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">Get Started</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-05.png',
		    'category': '119',
		    'html': `
			<p class="font-semibold tracking-wider text-center"><a href="#" title="" class="no-underline">Start a Project&nbsp;</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-06.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 font-normal leading-relaxed border-transparent rounded-full size-18 tracking-wide hover:border-transparent" style="color: rgb(255, 255, 255); background-color: rgb(0, 0, 0);" data-bg="rgb(0,0,0)">View Demo</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">Buy Now</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-07.png',
		    'category': '119',
		    'html': `
			<div class="text-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 text-black leading-relaxed rounded-full border-transparent hover:border-transparent font-normal size-14 uppercase tracking-125" title="" style="background-color: rgb(240, 240, 240);">Book a Call</a>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full size-14 uppercase tracking-125" title=""><i class="icon ion-android-arrow-dropright"></i>&nbsp; How We Work</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-08.png',
		    'category': '119',
		    'html': `
			<p class="size-42 font-medium leading-none text-center"><a href="#" title="" class="size-35">Let's Talk</a></p>
			<p class="text-center">You’ll be talking with our technology experts.</p>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-09.png',
		    'category': '119',
		    'html': `
			<div class="text-center flex items-center justify-center">
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide mr-5 mt-1" title="">Explore Menu</a>

				<a href="#" title="" class="ml-5 flex items-center" style="display: inline-flex;text-decoration:none"><i class="icon ion-android-arrow-dropright-circle mr-3 size-50"></i> Show Reel</a>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/buttons-10.png',
		    'category': '119',
		    'html': `
			<div>
				<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mt-2 mb-1 py-2 px-8 text-black leading-relaxed border-transparent hover:border-transparent font-normal rounded-none size-14 uppercase tracking-125 mr-3" title="" style="background-color: rgb(240, 240, 240);">View Demo</a><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-8 border-current hover:border-current font-normal leading-relaxed rounded-none size-14 uppercase tracking-125" title="">Buy Now</a>
			</div>
			`	
		},

		/* Photos */
		{
		    'thumbnail': 'preview/photos-01.png',
		    'category': '102',
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
		    'html': `
<img src="assets/minimalist-blocks/images/ai-gX9nR.jpg" alt="">
			`	
		},
		{
		    'thumbnail': 'preview/photos-04.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column third flex flex-col justify-center items-start">
        <h1 class="font-medium size-28 leading-none">Discover new possibilities.</h1>

        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
    </div>
    <div class="column two-third"><img src="assets/minimalist-blocks/images/ai-bIpd8.jpg" alt="" data-filename="ai-r0K4U-editMam9unJ.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-05.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column two-third"><img src="assets/minimalist-blocks/images/ai-M51Y5.jpg" alt="" data-filename="ai-2jc41-editfRbgdvk.png"></div>
    <div class="column third flex flex-col justify-center items-start">
        <h1 class="font-medium size-28 leading-none">Everything you need is here.</h1>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-06.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column half">
        <p class="text-center">Caption One</p><img src="assets/minimalist-blocks/images/ai-WIyxT.jpg" alt="" data-filename="ai-VKkIR-editosmpAhF.png">
    </div>
    <div class="column half">
        <p class="text-center">Caption Two</p><img src="assets/minimalist-blocks/images/ai-3nzGt.jpg" alt="" data-filename="ai-obZqc-editTmVUiej.png">
    </div>
</div>
			`	
		},

		{
		    'thumbnail': 'preview/photos-13.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column full">
        <img src="assets/minimalist-blocks/images/ai-Mnx3I.jpg" alt="" data-filename="ai-KRivl-editOikeCV0.png">
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-14.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column half">
        <img src="assets/minimalist-blocks/images/ai-ehmKk.jpg" alt="" data-filename="ai-HI7Lx-editnzCdNcM.png">
        <p class="text-center">Example One</p>
    </div>
    <div class="column half">
        <img src="assets/minimalist-blocks/images/ai-ER9hZ.jpg" alt="" data-filename="ai-EjMa5-edituVB0rtI.png">
        <p class="text-center">Example Two</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-15.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column third">
        <img src="assets/minimalist-blocks/images/ai-Lucwn.jpg" alt="">
        <p class="text-center">Example One</p>
    </div>
    <div class="column third">
        <img src="assets/minimalist-blocks/images/ai-DXzgn.jpg" alt="">
        <p class="text-center">Example Two</p>
    </div>
    <div class="column third">
        <img src="assets/minimalist-blocks/images/ai-ueYQN.jpg" alt="">
        <p class="text-center">Example Three</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-16.png',
		    'category': '102',
		    'html': `
<div class="row relative sm-items-1">
    <div class="column half" style="width: 36.9737%; flex: 0 0 auto;">
        <h1 class="tracking-wide font-medium size-36 leading-11">Discover new possibilities.</h1>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div style="position: relative; width: 63.0435%;" class="flex flex-col justify-center column half">
        <div class="is-dock">
            <div style="width: 90%;left: 15%;top: 19%;min-width:400px">

                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-5V0rH.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(130px);" data-center-top="transform: translateX(0px);" data-50-top="transform: translateX(0px);" data-top-bottom="transform: translateX(125px);" data-filename="ai-e02Fm-editWt2uF5V.png">
            </div>
            <div style="width: 92%;left: 41%;top: 41%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-jDJiG.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(100px);" data-center-top="transform: translateX(0px);" data-50-top="transform: translateX(0px);" data-top-bottom="transform: translateX(100px);" data-filename="ai-OJVXh-editTe4o2s7.png">
            </div>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-07.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-RDRoj.jpg" alt="">
        <h3 class="font-normal size-21">Item One</h3>
        <p>Lorem Ipsum is simply dummy text of the printing industry</p>
    </div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-oFKJG.jpg" alt="">
        <h3 class="size-21 font-normal">Item Two</h3>
        <p>Lorem Ipsum is simply dummy text of the printing industry</p>
    </div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-jWqaN.jpg" alt="" data-filename="ai-K8NLb-editKHOt72Z.png">
        <h3 class="size-21 font-normal">Item Three</h3>
        <p>Lorem Ipsum is simply dummy text of the printing industry</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-17.png',
		    'category': '102',
		    'html': `
<div class="row clearfix relative sm-items-1">
    <div class="flex justify-center flex-col column two-third" style="width: 38.2156%; flex: 0 0 auto;">
        <h1 class="tracking-wide leading-none font-medium size-36">Discover new possibilities.</h1>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div style="position: relative; min-height: 30vh; width: 59.8913%; flex: 0 0 auto;" class="flex flex-col justify-center items-center column third">
        <div class="is-dock" style="margin:50px 0">
            <div style="width: 120%;left: 40%;top: 4%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-pdgTj.jpg" style="width: 100%;" data-bottom-top="transform: translateX(130px);" data-center="transform: translateX(0px);" data-filename="ai-LYgLn-editZE1UrHC.png">
            </div>
            <div style="width: 58%;left: 13%;top: 56%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-85Hwg.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(75px);" data-center-top="transform: translateX(0px);" data-center-bottom="transform: translateX(0px);" data-top-bottom="transform: translateX(75px);" data-filename="ai-GkRyo-editAn7tWgk.png">
            </div>
            <div style="width: 58%;left: 89%;top: 56%;">
                <img alt="" data-noresize="" src="assets/minimalist-blocks/images/ai-4UgvH.jpg" style="width: 100%; box-shadow: rgba(22, 22, 22, 0.2) 3em 3em 5em;" data-bottom-top="transform: translateX(125px);" data-center-top="transform: translateX(0px);" data-center-bottom="transform: translateX(0px);" data-top-bottom="transform: translateX(100px);" data-filename="ai-xG2F8-editIw9OILJ.png">
            </div>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-08.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column"><img src="assets/minimalist-blocks/images/ai-aTIy0.jpg" alt="">

        <h1 class="font-normal size-21">Item One</h1>
        <p>Lorem Ipsum is simply dummy text of the printing industry.</p>
    </div>
    <div class="column" style="width: 60%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-VPX1m.jpg" alt="">

        <h1 class="font-normal size-21">Item Two</h1>
        <p>Lorem Ipsum is simply dummy text of the printing industry.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-09.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div style="width: 73.7397%; flex: 0 0 auto;" class="column two-fourth"><img src="assets/minimalist-blocks/images/ai-PHFUp.jpg" alt="" data-filename="ai-J6fcA-editicZq1U0.png"></div>
    <div class="flex flex-col justify-end column fourth" style="width: 100%;">
        <h1 class="leading-none size-28 font-normal">We're visual storytellers. Helping people &amp; brands through every step of their journey.</h1>

        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-10.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div class="column fourth flex flex-col justify-end items-start" style="width: 100%;">
        <h1 class="leading-none size-28 font-normal">Great things don’t have to be complicated.</h1>

        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div style="width: 73.7397%; flex: 0 0 auto;" class="column two-fourth"><img src="assets/minimalist-blocks/images/ai-xW9WX.jpg" alt="" data-filename="ai-xPiUl-editqUsvy4K.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-11.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div style="width: 40%; flex: 0 0 auto;" class="column"><img src="assets/minimalist-blocks/images/ai-Mj1qZ.jpg" alt="">

        <h2 class="font-normal size-21">Project One</h2>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>

    <div class="column"><img src="assets/minimalist-blocks/images/ai-4CEhz.jpg" alt="">

        <h2 class="font-normal size-21">Project Two</h2>
        <p>Lorem Ipsum is simply dummy text of the printing.</p>
    </div>
    <div class="column"><img src="assets/minimalist-blocks/images/ai-trryg.jpg" alt="">

        <h2 class="font-normal size-21">Project Three</h2>
        <p>Lorem Ipsum is simply dummy text of the printing.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/photos-12.png',
		    'category': '102',
		    'html': `
<div class="row">
    <div style="width: 27.2594%; flex: 0 0 auto;" class="column third pb-6">
        <h1 class="size-42 leading-09 font-normal">Our recent works.</h1>
    </div>
    <div style="width: 100%;" class="column third">
        <img src="assets/minimalist-blocks/images/ai-mkXX2.jpg" alt="">
        <img src="assets/minimalist-blocks/images/ai-iNSwQ.jpg" alt="">
    </div>
    <div class="column third" style="width: 100%;">
        <img src="assets/minimalist-blocks/images/ai-xMYsY.jpg" alt="">
        <img src="assets/minimalist-blocks/images/ai-HzKor.jpg" alt="">
    </div>
</div>
			`	
		},

		/* Profile */
		{
		    'thumbnail': 'preview/profile-01.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="text-center tracking-wide size-42 font-normal">Meet Our Team</h1>
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
            <span class="size-19 text-center font-normal">Jennifer Clarke</span><br>
            <span style="color: rgb(109, 109, 109);">Developer</span>
        </p>
    </div>
    <div class="flex flex-col justify-center items-center column third px-3">
        <div class="img-circular" style="margin:25px 0 0;width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-U9Mhk.jpg" alt="" data-filename="ai-5LB8u-editHA3SVGs.png"></div>
        <p class="text-center leading-14">
            <span class="size-19 text-center font-normal">Freja E. Andersen</span><br>
            <span style="color: rgb(109, 109, 109);">Developer</span>
        </p>
    </div>
    <div class="flex flex-col justify-center items-center column third px-3">
        <div class="img-circular" style="margin:25px 0 0;width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-wfCwM.jpg" alt="" data-filename="ai-rBr7d-editQCT5GrW.png"></div>
        <p class="text-center leading-14">
            <span class="size-19 text-center font-normal">Nathan Williams</span><br>
            <span style="color: rgb(109, 109, 109);">Illustrator</span>
        </p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-02.png',
		    'category': '103',
		    'html': `
<div class="row relative sm-items-1">
    <div class="py-6 flex flex-col justify-center column third">
        <p style="color: rgb(123, 123, 123);">Story about me.</p>
        <h1 class="size-54 font-light leading-none">Emilie Petersen</h1>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        <div class="spacer height-20"></div>
        <div class="is-social text-left">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/" title=""><i class="icon bi bi-instagram"></i></a>
        </div>
    </div>
    <div class="flex flex-col justify-center items-center column two-third">
        <img src="assets/minimalist-blocks/images/ai-fP32o.jpg" alt="" data-filename="ai-rBr7f-editoxDuXn4.png">
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-03.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full center">
        <h2 class="size-42 font-normal" style="letter-spacing: 3px;">Meet The Team</h2>
        <p style="color: rgb(136, 136, 136);" class="size-19">Here are our awesome team.</p>
    </div>
</div>
<div class="row">
    <div class="column full center">
        <div class="spacer height-60"></div>
    </div>
</div>
<div class="row">
    <div class="column third center flex flex-col justify-start items-center"><img src="assets/minimalist-blocks/images/ai-A1pR1.jpg" alt="" data-filename="ai-VETbj 2-editPMpscUR.png">
        <h3 class="size-21 font-normal">Emilie Petersen</h3>
        <div style="color: rgb(136, 136, 136);">Founder</div>
    </div>
    <div class="column third center flex flex-col justify-start items-center"><img src="assets/minimalist-blocks/images/ai-53t21.jpg" alt="" data-filename="ai-q5dRh-editso6EkVK.png">
        <h3 class="size-21 font-normal">Marcus Klausen</h3>
        <div style="color: rgb(136, 136, 136);">Developer</div>
    </div>
    <div class="column third center flex flex-col justify-start items-center">
        <img src="assets/minimalist-blocks/images/ai-vP7cI.jpg" alt="" data-filename="ai-49P71-editXAEmqxx.png">
        <h3 class="size-21 font-normal">Jennifer Clarke</h3>
        <div style="color: rgb(136, 136, 136);">UI/UX</div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-04.png',
		    'category': '103',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="tracking-wide size-32 leading-12">Hello. I'm Emilie Petersen. A web designer with experience in studios and startups. <a href="#" title="">Drop me a line</a>.</h2>
					<div class="spacer height-60"></div>
					<div class="is-social edit size-18">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-05.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h3 class="text-center font-normal size-32">The Team</h3>
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
        <h3 class="font-normal size-24">Amanda Steele</h3>
        <p style="max-width: 400px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div class="is-social text-left">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
    <div class="column half py-4">
        <img src="assets/minimalist-blocks/images/ai-rBm3n.jpg" alt="" data-filename="ai-O2ED1-editFBpnp2k.png">
        <h3 class="font-normal size-24">Peter A. Lassen</h3>
        <p style="max-width: 400px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
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
		    'thumbnail': 'preview/profile-06.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="size-42 text-left font-normal">The Team</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column third py-4"><img src="assets/minimalist-blocks/images/ai-32nTD.jpg" alt="" data-filename="ai-A0tqK-editZopXqYt.png">
        <h3 class="font-normal size-24">Emilie Petersen</h3>
        <p style="max-width: 400px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
    <div class="column third py-4"><img src="assets/minimalist-blocks/images/ai-YLtos.jpg" alt="" data-filename="ai-R3Xui-editDtexBS0.png">
        <h3 class="font-normal size-24">Jonathan Rugg</h3>
        <p style="max-width: 400px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
    <div class="column third py-4"><img src="assets/minimalist-blocks/images/ai-1ANxo.jpg" alt="">
        <h3 class="font-normal size-24">Amanda Steele</h3>
        <p style="max-width: 400px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-07.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full text-center">
        <h1 class="size-60 font-normal">A Passionate Team</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <p class="text-center">We work as equals &amp; celebrate as a team.</p>
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
        <h2 class="size-21 font-normal">Elaine Moreno</h2>
        <h3 class="font-light size-18" style="color: rgb(174, 174, 174);">Designer</h3>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
</div>
<div class="row relative desktop-column-reverse md-column-reverse sm-column-reverse">
    <div class="flex flex-col justify-center column two-third">
        <h2 class="size-21 font-normal">Janice Smith</h2>
        <h3 class="font-light size-18" style="color: rgb(174, 174, 174);">Developer</h3>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div class="text-left column third flex flex-col justify-center items-center">
        <div class="img-circular" style="margin:25px 0;width: 13vw;height: 13vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-qugm7.jpg" alt="" data-filename="ai-49P77-editKYIzbti.png"></div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-08.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="flex flex-col justify-center items-center px-3 column third py-3">
        <div class="img-circular" style="width: 10vw;height: 10vw;min-width:150px;min-height:150px;"><img style="height: 100%; width: 100%; object-fit: cover" src="assets/minimalist-blocks/images/ai-IulKo.jpg" alt="" data-filename="ai-Dpzsu-editgi68ksx.png"></div>
    </div>
    <div class="px-3 flex flex-col justify-center column two-third">
        <p class="size-21 font-normal leading-11">Nathan Williams</p>
        <p style="color: rgb(109, 109, 109);">Lorem Ipsum is simply dummy text of the printing industry.</p>
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
		    'thumbnail': 'preview/profile-09.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 style="letter-spacing: 3px; width: 400px; max-width: 100%; font-size: 56px !important;" class="leading-none font-medium">Meet <br>our amazing team.</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-TVh7V.jpg" alt="" data-filename="ai-CbyDu-editPrBEsiC.png">
        <h5 class="size-21 font-medium tracking-wide">Sarah&nbsp;<span style="color: rgb(136, 136, 136);">/ Founder</span></h5>
        <p>Lorem Ipsum is dummy text of the printing and typesetting industry.</p>
    </div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-1owT9.jpg" alt="" data-filename="ai-0qHok-editHAa8oh4.png">
        <h5 class="size-21 font-medium tracking-wide">Nathan&nbsp;<span style="color: rgb(136, 136, 136);">/ Developer</span></h5>
        <p>Lorem Ipsum is dummy text of the printing and typesetting industry.</p>
    </div>

    <div class="column third"><img src="assets/minimalist-blocks/images/ai-TysFp.jpg" alt="" data-filename="ai-obZqc-editFBXxfuT.png">
        <h5 class="size-21 font-medium tracking-wide">Janice&nbsp;<span style="color: rgb(136, 136, 136);" class="font-medium">/ Designer</span></h5>
        <p>Lorem Ipsum is dummy text of the printing and typesetting industry.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-10.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <p class="size-18 is-info1">Hi World!</p>
        <h1 class="size-42 is-title1-48 is-title-lite font-medium">I'M AUDREY SMITH</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="flex flex-col justify-center column half" style="width: 100%;">
        <h3 style="letter-spacing: 1px;" class="font-normal size-21">I design beautiful and functional stuff</h3>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text.</p>
        <div class="size-14 is-social">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
    <div class="column half" style="width: 59.2391%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-MxA1c.jpg" alt="" data-filename="ai-MhBT8-editKYgBsVH.png"></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-11.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="center column half"><img src="assets/minimalist-blocks/images/ai-joa6X.jpg" alt=""></div>
    <div class="flex flex-col justify-center items-center column half">
        <h2 style="letter-spacing: 3px;" class="text-center">Martha Massey</h2>
        <div style="border-bottom: 2px solid #b8b8b8;width: 70px;display: inline-block;margin: 22px 0 7px;"></div>
        <p class="text-center tracking-225 size-14 uppercase">Full Stack Developer</p>
        <div class="spacer height-20"></div>
        <p class="text-center">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text.</p>
        <div class="spacer height-20"></div>
        <div class="is-social center">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-12.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column half flex flex-col justify-end items-start"><img src="assets/minimalist-blocks/images/ai-XYcP5.jpg" alt="" data-filename="ai-nZOdD-editJnHhoBO.jpg"></div>
    <div class="flex flex-col justify-center items-end column half">
        <h1 class="size-160 text-right leading-11">A.</h1>
        <h2 class="size-28 text-right tracking-wide">Ann Higby</h2>
        <div class="spacer height-140"></div>
        <p class="text-left size-17" style="font-style: italic; font-family: serif; width: 100%;">Product Designer</p>
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <div class="is-social size-14" style="width: 100%;">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-13.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column half flex flex-col justify-center items-start">
        <h1 class="size-160 leading-11">M.</h1>
        <h2 class="size-28 text-right tracking-wider">Monica Reed</h2>
        <div class="spacer height-100"></div>
        <p class="text-right size-17" style="font-style: italic; font-family: serif;">Product Designer</p>
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <div class="is-social size-14">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
    <div class="column half flex flex-col justify-end items-start"><img src="assets/minimalist-blocks/images/ai-p98j0.jpg" alt=""></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/profile-14.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-BKPZP.jpg" alt=""></div>
    <div class="column half flex flex-col justify-center items-start">
        <p style="font-style: italic; color: rgb(188, 188, 188); font-family: Georgia, serif;" class="tracking-175">Hello</p>
        <h1 class="size-28 tracking-wider">I'm <span class="font-semibold">Olivia Maus</span>. I develop website and design awesome things <span class="font-semibold">you will love</span>.</h1>
        <div class="spacer height-20"></div>
        <p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        <div class="spacer height-20"></div>
        <div class="is-social size-14">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
        </div>
    </div>
</div>
			`	
		},

		/* Products */
		{
		    'thumbnail': 'preview/products-01.png',
		    'category': '104',
		    'html': `
<div class="row relative sm-items-1">
    <div class="py-6 column half" style="width: 100%;">
        <p class="leading-none size-15" style="color: rgb(138, 138, 138);">Store Name<br class="size-15">Your City Name</p>
        <h2 class="font-normal leading-none size-35">Bedside Table</h2>

        <p class="font-medium size-24">$129.00</p>

        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <p class="font-normal">Details</p>
        <ul>
            <li>Base Material: Solid Wood</li>
            <li>Seat Material: Soft Fabric<br></li>
        </ul>

        <div class="whitespace-nowrap">
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Buy Now</a>
        </div>
    </div>
    <div class="flex flex-col justify-center items-center column half" style="width: 61.413%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-7dr6M.jpg" alt=""></div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-03.png',
		    'category': '104',
		    'html': `
<div class="row relative desktop-column-reverse">
    <div class="column half py-4" style="width: 100%;">
        <h2 class="leading-08 font-normal size-88">Shoes</h2>
        <div class="spacer height-40"></div>
        <h4 class="size-21 tracking-wide leading-loose">Details</h4>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

        <p class="font-medium size-32">$199</p>

        <div class="button-group">
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-14 rounded tracking-wide" title="">Buy Now</a>
        </div>
    </div>
    <div class="column half" style="width: 62.8261%; flex: 0 0 auto;">
        <img src="assets/minimalist-blocks/images/ai-7g7oa.jpg" alt="" data-filename="img-KE1UcwrHe8N7yNIewWkN1-editvFjRgQT.jpg">
        <p class="tracking-wide font-semibold leading-none size-18">Colors</p>
        <p class="size-15 leading-none">White, Black, Grey, Yellow, Red</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-04.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="text-center size-42 font-medium">Furniture</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="py-4 column half"><img src="assets/minimalist-blocks/images/ai-hC1gx.jpg" alt="">

        <h3 class="font-normal size-24">Bedside Table</h3>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type.</p>
        <p class="font-normal leading-16 size-32">$129</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed">View Details</a>
        </div>
    </div>
    <div class="py-4 column half"><img src="assets/minimalist-blocks/images/ai-D9YFP.jpg" alt="">

        <h3 class="font-normal size-24">Wood Cabinet</h3>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type.</p>
        <p class="font-normal leading-16 size-32">$159</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid border-transparent ml-1 mr-1 hover:border-transparent rounded size-16 py-1 px-5 font-normal tracking-wide text-gray-800 underline leading-relaxed">View Details</a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-05.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="text-center size-42 font-normal">Products</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row relative sm-items-2">
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-FpLps.jpg" alt="">

        <h3 class="font-normal size-21">Coffee Table</h3>
        <p class="font-medium size-32">$29</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">View Details</a>
        </div>
    </div>
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-bHuNq.jpg" alt="">

        <h3 class="size-21 font-normal">Bookcase</h3>
        <p class="font-medium size-32">$49</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">View Details</a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-06.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="leading-09 text-center font-normal size-50">Wood Cabinet</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="flex flex-col justify-end column">
        <p class="size-16 leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div class="column" style="width: 50%; flex: 0 0 auto;">
        <img src="assets/minimalist-blocks/images/ai-6u6u8.jpg" alt="" data-filename="ai-54zu9-edituBnxtQJ.png">
    </div>
    <div class="flex flex-col justify-start column">
        <p class="leading-none tracking-tight font-normal size-32">$189</p>
        <div class="spacer height-20"></div>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 px-6 border-current hover:border-current font-normal leading-12 rounded-none pt-3 pb-3 size-15 tracking-wider" title="">Buy Product&nbsp;<i class="icon ion-android-arrow-forward"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-02.png',
		    'category': '104',
		    'html': `
<div class="row relative sm-items-1">
    <div class="flex flex-col justify-center items-center column half" style="width: 59.1304%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-Ir61c.jpg" alt=""></div>
    <div class="py-6 column half" style="width: 100%;">

        <h2 class="font-normal leading-none size-48">Dinning Chair</h2>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <p class="font-normal">Details</p>
        <ul>
            <li>Base Material: Solid Wood</li>
            <li>Seat Material: Soft Fabric<br></li>
        </ul>
        <p class="font-light size-35">$149.00</p>

        <div class="whitespace-nowrap">
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="">Buy Now</a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-07.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="text-center size-42 font-normal">Most Loved</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row relative sm-items-2">
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-01Opn.jpg" alt="">

        <h3 class="size-21 font-normal">Coffee Table</h3>
        <p class="font-medium size-32">$29</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">View Details</a>
        </div>
    </div>
    <div class="column py-4"><img src="assets/minimalist-blocks/images/ai-MHUTu.jpg" alt="">

        <h3 class="size-21 font-normal">Bookcase</h3>
        <p class="font-medium size-32">$49</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 text-black leading-12 rounded-full border-transparent hover:border-transparent font-normal tracking-wide px-2 underline" data-bg="">View Details</a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-09.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column full">
        <h2 class="size-42 font-normal text-left">Featured Products</h2>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row relative sm-items-2">
    <div class="column flex flex-col justify-end py-4"><img src="assets/minimalist-blocks/images/ai-8JTXG.jpg" alt="">

        <h3 class="size-21 font-normal">Bedside Table</h3>
        <p class="font-medium size-32">$39</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
        </div>
    </div>
    <div class="column flex flex-col justify-end py-4" style="width: 50%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-vjVz0.jpg" alt="">

        <h3 class="size-21 font-normal">Bookcase</h3>
        <p class="font-medium size-32">$49</p>

        <p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide">Buy Now</a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-10.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column half flex flex-col justify-center items-start" style="width: 100%;">
        <h2 class="leading-none font-normal size-54">Comfy Wooden Office Desk</h2>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
    </div>
    <div class="column half" style="width: 60.4651%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-Pehly.jpg" alt="" data-filename="ai-sGD6j-editMLX4bfi.png"></div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="column half" style="width: 43.0095%; flex: 0 0 auto;">
        <p class="font-normal size-28">$189</p>
        <div>
            <a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 leading-relaxed rounded-full border-transparent hover:border-transparent font-normal uppercase tracking-125 size-14" title="" style="background-color: rgb(36, 36, 36); color: rgb(255, 255, 255);" data-bg="rgb(36,36,36)">Buy Now&nbsp;<i class="icon ion-android-arrow-forward"></i></a>
        </div>
    </div>
    <div class="column half flex flex-col justify-center items-start" style="width: 100%;">
        <ul style="list-style: initial;padding-left: 20px;">
            <li>Shape: Rectangular</li>
            <li>Dimension:&nbsp;19.7"D x 19.7"W x 29.5"H</li>
            <li>Color: Walnut</li>
            <li>Style: Modern</li>
        </ul>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-11.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column" style="width: 55.2174%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-XR1Mp.jpg" alt="" data-filename="ai-cNyke-editMdV0t2R.png"></div>
    <div class="column" style="width: 100%;">
        <h2 class="tracking-wide size-32">Extra Bass Earphone</h2>
        <p class="text-justify leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.</p>
        <table class="default" style="border-collapse:collapse;width:100%;">
            <tbody>
                <tr style="border-bottom: 1px solid; border-color: rgb(158, 158, 158);">
                    <td class="size-14">Price</td>
                    <td class="size-14 text-right">$34</td>
                </tr>
                <tr style="border-bottom: 1px solid; border-color: rgb(158, 158, 158);">
                    <td class="size-14">Color Availability</td>
                    <td class="size-14 text-right">Black, White, Red</td>
                </tr>
            </tbody>
        </table>
        <div class="spacer height-20"></div>
        <div><a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 text-black leading-12 rounded border-transparent hover:border-transparent font-normal tracking-wide" title="" style="background-color: rgb(240, 240, 240);">Add to Cart</a> &nbsp; <a href="#" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="" role="button">Buy Now</a></div>
        <div class="spacer height-20"></div>
        <p class="size-14 text-right" style="margin-bottom: 5px;">Share:</p>
        <div class="is-social text-right">
            <a href="https://twitter.com/home?status=https://example.com/"><i class="bi bi-twitter-x size-14" style="margin-right: 2px;"></i></a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://example.com/"><i class="bi bi-facebook size-14" style="margin-right: 2px;"></i></a>
            <a href="https://pinterest.com/pin/create/button/?url=https://example.com/&amp;media=&amp;description="><i class="icon ion-social-pinterest-outline size-14"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/products-12.png',
		    'category': '104',
		    'html': `
<div class="row">
    <div class="column half pb-3" style="width: 100%;">
        <h1 class="tracking-wide size-32">Strawberry Dessert</h1>
        <p class="size-12 tracking-wider"><i class="icon ion-android-time"></i>&nbsp;18 MINS&nbsp; &nbsp;<i class="icon ion-person"></i>&nbsp;&nbsp;1 PERSON&nbsp; &nbsp;<i class="icon ion-ios-flame"></i>&nbsp;93 CALORIES</p>
        <div class="spacer height-20"></div>
        <p class="text-justify leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.</p>
        <p class="size-28 font-medium">$14</p>
        <div><a href="#" title="" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-14 rounded tracking-wide" role="button">Place Order</a></div>
    </div>
    <div class="column half" style="width: 57.9348%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-GE8eQ.jpg" alt="" data-filename="ai-uRRdO-editeEnWfgv.png"></div>
</div>
			`	
		},
		

		/* Features */
		{
		    'thumbnail': 'preview/features-01.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="size-32 font-normal">Why Choose Us</h2>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px; height: 40px; border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide size-24 font-normal">Feature One</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px; height: 40px; border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide font-normal size-24">Feature Two</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="rounded-full flex justify-center items-center mb-8" style="width: 40px; height: 40px; border: 2px solid rgb(136, 136, 136);">
						<i class="icon ion-android-done leading-none size-24" style="color: rgb(136, 136, 136);"></i>
					</div>
					<h3 class="tracking-wide font-normal size-24">Feature Three</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-02.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="text-center size-32 font-normal">Features</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div style="width: 17.9305%; flex: 0 0 auto;" class="column third">
					<div class="spacer height-40"></div>
				</div>
				<div style="width: 64.8476%; flex: 0 0 auto;" class="column third">
					<p class="text-center leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third" style="width: 100%;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-ios-lightbulb-outline size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #333; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-ios-gear-outline size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #333; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-ios-camera-outline size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #333; width: 50px; display: inline-block;"></p>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-iphone size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #444; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-ios-paper-outline size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #444; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="center column third">
					<div class="padding-20">
						<i class="icon ion-ios-clock-outline size-48" style="color: rgb(174, 174, 174);"></i>
						<h3 class="leading-none tracking-wider capitalize size-19 font-normal">Feature Item</h3>
						<p style="border-bottom: 2px solid #444; width: 50px; display: inline-block;"></p>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-03.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="xs-hidden column fourth">
					<div class="spacer height-60"></div>
				</div>
				<div class="column half">
					<h1 class="text-center tracking-tight font-normal size-42 leading-11">Design with a spark of creativity.</h1>
				</div>
				<div class="xs-hidden column fourth">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth">
					<div class="text-center">
						<i class="icon ion-ios-gear-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center size-19 font-medium">Full Stack</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
				<div class="column fourth">
					<div class="text-center">
						<i class="icon ion-ios-heart-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center size-19 font-medium">UI/UX</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
				<div class="column fourth">
					<div class="text-center">
						<i class="icon ion-ios-rose-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center size-19 font-medium">Illustration</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
				<div class="column fourth">
					<div class="text-center">
						<i class="icon ion-ios-mic-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center size-19 font-medium">Branding</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-04.png',
		    'category': '105',
		    'html': `
			<div class="row clearfix">
				<div class="column full">
					<h2 class="capitalize size-32 text-center font-normal">Why Choose Us</h2>
				</div>

			</div>

			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>

			<div class="row clearfix">
				<div class="p-2 flex flex-col justify-start items-center column fifth">
					<p class="leading-08 size-64 font-medium" style="color: rgb(211, 211, 211);">1.</p>
				
				</div>
				<div class="p-2 flex flex-col justify-center column two-fifth">
					<h3 class="leading-none tracking-wider capitalize size-21 font-normal">Flexible Learning Options</h3>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row clearfix">
				<div class="p-2 flex flex-col justify-start items-center column fifth">
					<p class="leading-08 size-64 font-medium" style="color: rgb(211, 211, 211);">2.</p>
				</div>
				<div class="p-2 flex flex-col justify-center column two-fifth">
					<h3 class="leading-none tracking-wider capitalize size-21 font-normal">Experienced Tutor</h3>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row clearfix">
				<div class="flex flex-col justify-start items-center column fifth">
					<p class="leading-08 size-64 font-medium" style="color: rgb(211, 211, 211);">3.</p>
				</div>
				<div class="p-2 flex flex-col justify-center column two-fifth">
					<h3 class="leading-none tracking-wider capitalize size-21 font-normal">Lifetime Access</h3>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-05.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="font-normal size-32">Why choose us.</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h2 class="font-normal size-54">01.</h2>
					<h3 class="font-normal size-19">Flexible Learning Options</h3>
					<div class="spacer height-20"></div>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>
				<div class="column third">
					<h2 class="size-54 font-normal">02.</h2>
					<h3 class="font-normal size-19">Experienced Tutor</h3>
					<div class="spacer height-20"></div>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>
				<div class="column third">
					<h2 class="size-54 font-normal">03.</h2>
					<h3 class="font-normal size-19">Lifetime Access</h3>
					<div class="spacer height-20"></div>
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-06.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 is-title1-32 is-title-lite is-upper text-center font-normal">WHY CHOOSE US?</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<div class="list">
						<i class="icon ion-checkmark"></i>
						<h3 class="default-font2 font-normal size-21">Feature Item</h3>
						<p style="margin: 5px 0 0 50px;  font-weight: 300" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
					</div>
				</div>
				<div class="column third">
					<div class="list">
						<i class="icon ion-checkmark"></i>
						<h3 class="size-21 default-font2 font-normal">Feature Item</h3>
						<p style="margin: 5px 0 0 50px;  font-weight: 300" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
					</div>
				</div>
				<div class="column third">
					<div class="list">
						<i class="icon ion-checkmark"></i>
						<h3 class="size-21 default-font2 font-normal">Feature Item</h3>
						<p style="margin: 5px 0 0 50px; font-weight: 300" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-07.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-ios-lightbulb-outline size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none font-semibold tracking-wide">UI/UX</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-ios-gear-outline size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none font-semibold tracking-wide">Full Stack</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-ios-camera-outline size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none font-semibold tracking-wide">Illustration</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-iphone size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none tracking-wide font-semibold">Video Explainer</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-ios-paper-outline size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none font-semibold tracking-wide">Branding</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>
				<div class="column third center">
					<div class="padding-20">
						<i class="icon ion-ios-clock-outline size-42" style="color: #e74c3c"></i>
						<h3 class="size-17 leading-none font-semibold tracking-wide">Support</h3>
						<p style="border-bottom: 2px solid #e74c3c; width: 50px; display: inline-block;"></p>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-08.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="display-font2 leading-12 size-32 font-medium" style="letter-spacing: 10px;">WHAT MAKES US DIFFERENT</p>
					<p style="border-bottom: 2px solid #333; width: 70px; display: inline-block; margin: 0"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth"><i class="icon ion-android-bulb size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="tracking-wide font-normal size-19">FEATURE 01</h3>
					<p class="leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-android-desktop size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="tracking-wide font-normal size-19">FEATURE 02</h3>
					<p class="leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-gear-b size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="tracking-wide font-normal size-19">FEATURE 03</h3>
					<p class="leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-earth size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="leading-none font-normal size-19" style="letter-spacing: 1px;">FEATURE 04</h3>
					<p class="leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/features-09.png',
		    'category': '105',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="text-center capitalize size-32 font-normal">Why Choose Us</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div style="width: 17.9305%; flex: 0 0 auto;" class="column third">
					<div class="spacer height-40"></div>
				</div>
				<div style="width: 64.8476%; flex: 0 0 auto;" class="column third">
					<p class="text-center leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third" style="width: 100%;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="center p-2 column third">
					<i class="icon ion-checkmark size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="leading-none tracking-wider capitalize font-normal size-24">Feature One</h3>
				</div>
				<div class="center p-2 column third">
					<i class="icon ion-checkmark size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="leading-none tracking-wider capitalize font-normal size-24">Feature Two</h3>
				</div>
				<div class="center p-2 column third">
					<i class="icon ion-checkmark size-32" style="color: rgb(174, 174, 174);"></i>
					<h3 class="leading-none tracking-wider capitalize font-normal size-24">Feature Three</h3>
				</div>
			</div>
			`	
		},

		/* Process/Steps */
		{
		    'thumbnail': 'preview/steps-01.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="font-normal size-35 tracking-widest">How We Work</h1>
					<p style="border-bottom: 2px solid #000; width: 60px; display: inline-block; margin-top: 0"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h2 style="color: rgb(204, 204, 204);" class="size-42">01.</h2>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<h2 style="color: rgb(204, 204, 204);" class="size-42">02.</h2>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<h2 style="color: rgb(204, 204, 204);" class="size-42">03.</h2>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-02.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="size-21" style="color: #d4d4d4; font-family: 'Georgia', serif;"><span class="italic" style="color: rgb(138, 138, 138);">Discover</span></p>
					<h1 class="size-28 is-title1-32 is-title-bold font-medium">HOW IT WORKS</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h1 class="size-64 is-title-bold" style="color: #d4d4d4;">1.</h1>
					<h3 class="size-21 is-title-lite font-medium">STEP 01</h3>
					<p style="border-bottom: 2px solid #333; width: 40px; display: inline-block; margin-top: 0"></p>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<h1 class="size-64 is-title-bold" style="color: #d4d4d4;">2.</h1>
					<h3 class="size-21 is-title-lite font-medium">STEP 02</h3>
					<p style="border-bottom: 2px solid #333; width: 40px; display: inline-block; margin-top: 0"></p>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<h1 class="size-64 is-title-bold" style="color: #d4d4d4;">3.</h1>
					<h3 class="size-21 is-title-lite font-medium">STEP 03</h3>
					<p style="border-bottom: 2px solid #333; width: 40px; display: inline-block; margin-top: 0"></p>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-03.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h2 class="font-normal tracking-wide size-54">Timeline Process</h2>
					<p class="tracking-wider size-19">Discover How We Work</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third center">
					<p class="size-50 default-font1 leading-13 font-medium">01</p>
					<h3 class="size-18 font-medium">STEP ONE</h3>
					<p class="size-16" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third center">
					<p class="size-50 default-font1 leading-13 font-medium">02</p>
					<h3 class="size-18 font-medium">STEP TWO</h3>
					<p class="size-16" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third center">
					<p class="size-50 default-font1 leading-13 font-medium">03</p>
					<h3 class="size-18 font-medium">STEP THREE</h3>
					<p class="size-16" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-04.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="font-medium size-32 tracking-75">WORK STEPS</h1>
					<p style="border-bottom: 2px solid #333; width: 40px; display: inline-block;"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-120"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h1 class="size-54 text-center">01</h1>
					<p class="text-left">Lorem Ipsum is simply dummy text of the printing industry. Vivamus leo ante, dolor sit amet vel.</p>
				</div>
				<div class="column third">
					<h1 class="size-54 text-center">02</h1>
					<p>Lorem Ipsum is simply dummy text of the printing industry. Vivamus leo ante, dolor sit amet vel.</p>
				</div>
				<div class="column third">
					<h1 class="size-54 text-center">03</h1>
					<p>Lorem Ipsum is simply dummy text of the printing industry. Vivamus leo ante, dolor sit amet vel.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-05.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="italic size-17">Discover</p>
					<h1 class="font-medium tracking-75 size-32">HOW WE WORK</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-android-bulb size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">STEP ONE</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-compose size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">STEP TWO</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-gear-b size-32" style="color: #ea653c;"></i>
					<h3 class="font-medium tracking-wide size-19">STEP THREE</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-06.png',
		    'category': '106',
		    'html': `
<div class="row">
    <div class="column half">
        <p class="tracking-75 size-16">STEP ONE</p>
        <h1 class="font-semibold size-32">Discovery</h1>
        <p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
    </div>
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-yLlkY.jpg" alt="" data-filename="ai-135pk-editqXenIiK.png"></div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-fI9Mf.jpg" alt="" data-filename="ai-UQ7nZ-editjkWxWbh.png"></div>
    <div class="column half">
        <p class="tracking-75 size-16">STEP TWO</p>
        <h1 class="font-semibold size-32">Design and Development</h1>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-07.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full text-center">
					<h1 class="tracking-75 size-32">THIS IS HOW WE WORK</h1>
					<p style="border-bottom: 2px solid #333; width: 70px; display: inline-block;"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-clipboard size-28"></i>
					<h3 class="size-19">STEP ONE</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-gear-b size-28"></i>
					<h3 class="size-19">STEP TWO</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-paper-airplane size-28"></i>
					<h3 class="size-19">STEP THREE</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-08.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-35 tracking-wide">How<span class="font-semibold"> [our company] </span>Works</h1>
				</div>
			</div>
			<div class="row">
				<div class="column two-third">
					<p class="size-16 text-justify" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth"><i class="icon ion-ios-compose-outline size-42" style="color: #e74c3c"></i>
					<p class="leading-none tracking-75">CREATE</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-world-outline size-42" style="color: #e74c3c"></i>
					<p class="leading-none tracking-75">PUBLISH</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-paperplane-outline size-42" style="color: #e74c3c"></i>
					<p class="leading-none tracking-75">START SELLING</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-list-outline size-42" style="color: #e74c3c"></i>
					<p class="leading-none tracking-75">MANAGE</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-09.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column half">
					<h1 class="size-32 font-semibold tracking-wide leading-none">HOW <br>WE WORKS</h1>
				</div>
				<div class="column half">
					<p><span class="font-semibold">1. Tell us what you need.</span> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
					<p><span class="font-semibold">2. Solution offer.</span> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
					<p><span class="font-semibold">3. Planning &amp; design.</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
					<p><span class="font-semibold">4. Implementing &amp; maintenance.</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-10.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 font-semibold tracking-wide">4 simple <font style="color: #bdbdbd;">steps</font>
					</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth"><i class="icon ion-ios-lightbulb-outline size-42"></i>
					<p class="leading-none font-normal tracking-75">PLAN</p>
					<p class="size-14">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-heart-outline size-42"></i>
					<p class="leading-none font-normal tracking-75">DESIGN</p>
					<p class="size-14">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-compose-outline size-42"></i>
					<p class="leading-none font-normal tracking-75">BUILD</p>
					<p class="size-14">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column fourth"><i class="icon ion-ios-list-outline size-42"></i>
					<p class="leading-none font-normal tracking-75">MANAGE</p>
					<p class="size-14">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-11.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-32 text-left tracking-wider">How it Works</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<h1 class="size-21 tracking-wide">Choose your product</h1>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block; margin: 0;"></p>
					<p style="color: rgb(102, 102, 102);" class="size-16 text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
				</div>
				<div class="column half">
					<h1 class="size-21 tracking-wide">Add your design</h1>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block; margin: 0;"></p>
					<p style="color: rgb(102, 102, 102);" class="size-16 text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<h1 class="size-21 tracking-wide">Processing</h1>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block; margin: 0;"></p>
					<p style="color: rgb(102, 102, 102);" class="size-16 text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
				</div>
				<div class="column half">
					<h1 class="size-21 tracking-wide">Shipping</h1>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block; margin: 0;"></p>
					<p style="color: rgb(102, 102, 102);" class="size-16 text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-12.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full text-center">
					<h2 class="size-64 text-left font-normal">Timeline Process</h2>
					<p class="size-16 uppercase text-left tracking-300">Discover How We Work</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-120"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h2 class="size-64">01</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-21 uppercase leading-12 font-semibold">Step One</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<h2 class="size-64">02</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-21 uppercase leading-12">Step Two</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<h2 class="size-64">03</h2>
					<div class="spacer height-20"></div>
					<h3 class="size-21 uppercase leading-12">Step Three</h3>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/steps-13.png',
		    'category': '106',
		    'html': `
			<div class="row">
				<div class="column full text-center">
					<h2 class="text-center size-48 font-normal">How We Work</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row">
				<div class="text-center column third">
					<h3 class="size-54">01</h3>
					<div class="spacer height-20"></div>
					<p class="size-21 leading-12 font-normal">Step One</p>
					<p class="text-left">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="text-center column third">
					<h3 class="size-54">02</h3>
					<div class="spacer height-20"></div>
					<p class="size-21 leading-12 font-normal">Step Two</p>
					<p class="text-left">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="text-center column third">
					<h3 class="size-54">03</h3>
					<div class="spacer height-20"></div>
					<p class="size-21 leading-12 font-normal">Step Three</p>
					<p class="text-left">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},

		/* Pricing */
		{
		    'thumbnail': 'preview/pricing-01.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column third xs-hidden" style="width: 100%;">
					<div class="spacer height-80"></div>
				</div>
				<div style="width: 52.7981%; flex: 0 0 auto;" class="column third text-center">
					<h2 class="text-center font-normal size-28">Simple Pricing</h2>
					<p style="border-bottom: 3px solid #000; width: 80px; display: inline-block;"></p>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="text-center size-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
						<h3 class="text-center tracking-widest size-21">Standard</h3>
						<p class="size-21 text-center">$<span class="size-64">9</span>/mo</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>10 GB Storage</li>
							<li>2 Users</li>
							<li>2 Domains</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="column third p-7 flex flex-col justify-center items-center">
					<div style="padding: 90px 30px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest size-21">Deluxe</h3>
						<p class="size-21 text-center">$<span class="size-64">19</span>/mo</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>20 GB Storage</li>
							<li>5 Users</li>
							<li>3 Domains</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="column third p-7 flex flex-col justify-center items-center">
					<div style="padding: 50px 20px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest capitalize size-21">Ultimate</h3>
						<p class="size-21 text-center">$<span class="size-64">29</span>/mo</p>
						<ul style="list-style: initial;padding-left: 20px;">
							<li>30 GB Storage</li>
							<li>10 Users</li>
							<li>Unlimited Domains</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-02.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column third xs-hidden" style="width: 100%;">
					<div class="spacer height-80"></div>
				</div>
				<div style="width: 52.7981%; flex: 0 0 auto;" class="column third text-center">
					<h2 class="text-center font-normal size-28">Order Now</h2>
					<p style="border-bottom: 3px solid #000; width: 80px; display: inline-block;"></p>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="text-center size-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
			<div class="row relative">
				<div class="p-7 flex flex-col justify-center items-center column half">
					<div style="padding: 50px 30px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest size-21">Standard</h3>
						<p class="size-21 text-center">$<span class="size-64">9</span>/mo</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>10 GB Storage</li>
							<li>2 Users</li>
							<li>2 Domains</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="p-7 flex flex-col justify-center items-center column half">
					<div style="padding: 90px 20px; width: 100%; box-sizing: border-box; border: 1px solid rgb(85, 85, 85); max-width: 450px;" class="text-left flex justify-center flex-col items-center">
						<h3 class="text-center tracking-widest size-21">Pro</h3>
						<p class="size-21 text-center">$<span class="size-64">19</span>/mo</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>20 GB Storage</li>
							<li>5 Users</li>
							<li>3 Domains</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-12 rounded-full tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-03.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h2 class="tracking-wide capitalize size-42 font-normal">Plans that meet your needs</h2>
					<div class="spacer height-20"></div>

					<p class="size-17 tracking-widest" style="color: rgb(87, 87, 87);">Fair Prices. Excellent Services.</p>
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
						<h3 class="size-21 tracking-wider">Standard</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">$<span class="size-64 font-extralight">19</span>/mo</p>
						<p style="color: rgb(123, 123, 123);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4">
					<div style="width: 100%; padding: 80px 40px; box-sizing: border-box; max-width: 550px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">Deluxe</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">$<span class="size-64 font-extralight">29</span>/mo</p>
						<p style="color: rgb(123, 123, 123);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4">
					<div style="width: 100%; padding: 50px 30px; box-sizing: border-box; max-width: 450px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">Ultimate</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">$<span class="size-64 font-extralight">39</span>/mo</p>
						<p style="color: rgb(123, 123, 123);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-04.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h2 class="tracking-wide capitalize size-42 font-normal">Plans that meet your needs</h2>
					<div class="spacer height-20"></div>
					<p class="size-17 tracking-widest" style="color: rgb(87, 87, 87);">Fair Prices. Excellent Services.</p>
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
						<h3 class="size-21 tracking-wider">Standard</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">$<span class="size-72 font-extralight">19</span>/mo</p>
						<p style="color: rgb(123, 123, 123);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-center items-center column half py-4">
					<div style="width: 100%; padding: 80px 40px; box-sizing: border-box; max-width: 550px;" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">Pro</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none">$<span class="size-72 font-extralight">29</span>/mo</p>
						<p style="color: rgb(123, 123, 123);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-40"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Buy Now</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-05.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 41.5871%; flex: 0 0 auto;">
					<h2 class="leading-none tracking-wide size-48 font-medium">Choose Your Plan.</h2>
				</div>
				<div class="column half" style="width: 58.4129%;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-100"></div>
				</div>
			</div>
			<div class="row relative">
				<div class="column third pr-9 py-5">
					<h3 class="leading-14 font-normal size-54">01</h3>
					<h4 class="size-21 leading-16 font-normal">Lite / $39</h4>
					<div class="spacer height-20"></div>
					<ul style="list-style: initial;padding-left: 20px;">
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
					</ul>
					<div class="spacer height-40"></div>
					<div>
						<a href="#" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="" role="button">Get Started</a>
					</div>
				</div>
				<div class="column third pr-9 py-5">
					<h3 class="leading-14 font-normal size-54">02</h3>
					<h4 class="size-21 leading-16 font-normal">Advanced / $59</h4>
					<div class="spacer height-20"></div>
					<ul style="list-style: initial;padding-left: 20px;">
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
				
					</ul>
					<div class="spacer height-40"></div>
					<div>
						<a href="#" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="" role="button">Get Started</a>
					</div>
				</div>
				<div class="column third pr-9 py-5">
					<h3 class="leading-14 font-normal size-54">03</h3>
					<h4 class="size-21 leading-16 font-normal">Ultimate / $89</h4>
					<div class="spacer height-20"></div>
					<ul style="list-style: initial;padding-left: 20px;">
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
						<li class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
					</ul>
					<div class="spacer height-40"></div>
					<div>
						<a href="#" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide" title="" role="button">Get Started</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-06.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="leading-14 size-48 font-light">Pricing Plans</h2>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row md-autofit">
				<div class="py-5 column third" style="width: 100%;">
					<h3 class="size-28 font-normal">Basic</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(123, 123, 123);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
						<li>Feature Three</li>
					</ul>
					<div class="spacer height-20"></div>
					<p>$<span class="size-48">59</span>/ month</p>
					<div class="button-group">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-6 border-current hover:border-current font-normal rounded leading-relaxed size-14 uppercase tracking-widest" title="">Choose Plan</a>
					</div>
				</div>
				<div class="py-5 column third xs-hidden md-hidden" style="width: 12.5704%; flex: 0 0 auto;">
					<div class="spacer height-80"></div>
				</div>
				<div class="pr-9 py-5 column third" style="width: 100%;">
					<h3 class="size-28 font-normal">Premium</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(123, 123, 123);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.&nbsp;</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
						<li>Feature Three</li>
					</ul>
					<div class="spacer height-20"></div>
					<p>$<span class="size-48">99</span>/ month</p>
					<div class="button-group">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-6 border-current hover:border-current font-normal rounded leading-relaxed size-14 uppercase tracking-widest" title="">Choose Plan</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-07.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-35 font-medium tracking-wider">SUBSCRIPTION PLANS</h1>
					<p>Choose the right plan that works for you.</p>
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
						<h3 class="size-21 tracking-wider">Standard</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">$<span class="size-64">19</span>/mo</p>
						<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Select Plan</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4 is-light-text">
					<div style="width: 100%; padding: 80px 40px; box-sizing: border-box; max-width: 550px; background-color: rgb(2, 136, 216);" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">Deluxe</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">$<span class="size-64">29</span>/mo</p>
						<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Select Plan</a>
						</div>
					</div>
				</div>
				<div class="column third flex flex-col justify-center items-center py-4 is-light-text">
					<div style="width: 100%; padding: 50px 30px; box-sizing: border-box; max-width: 450px; background-color: rgb(249, 168, 37);" class="is-card shadow-1 text-left flex justify-center flex-col items-center">
						<h3 class="size-21 tracking-wider">Ultimate</h3>
						<div class="spacer height-20"></div>
						<p class="size-21 leading-none font-semibold">$<span class="size-64">39</span>/mo</p>
						<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

						<ul style="list-style: initial;padding-left: 20px;">
							<li>Feature One</li>
							<li>Feature Two</li>
							<li>Feature Three</li>
						</ul>
						<div class="spacer height-20"></div>
						<div class="button-group">
							<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-12 rounded tracking-wide" title="">Select Plan</a>
						</div>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-08.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="default-font2 font-medium tracking-wider size-32">PRICING PLANS</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<h2 class="size-48 font-semibold"><span class="size-28">$</span>31</h2>
					<p class="size-16 default-font1">MONTHLY</p>
					<h3 class="default-font2 leading-loose font-semibold tracking-wider size-21">STANDARD</h3>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
					</ul>
					<div class="spacer height-20"></div>
					<div style="margin:1.5em 0">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-14 rounded tracking-wide">Get Started</a>
					</div>
				</div>
				<div class="column third">
					<h2 class="size-48 font-semibold"><span class="size-28">$</span>57</h2>
					<p class="size-16 default-font1">MONTHLY</p>
					<h3 class="size-21 default-font2 leading-loose font-semibold tracking-wider">PREMIUM</h3>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
					</ul>
					<div class="spacer height-20"></div>
					<div style="margin:1.5em 0">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-14 rounded tracking-wide">Get Started</a>
					</div>
				</div>
				<div class="column third">
					<h2 class="size-48 font-semibold"><span class="size-28">$</span>62</h2>
					<p class="size-16 default-font1">MONTHLY</p>
					<h3 class="size-21 default-font2 leading-loose font-semibold tracking-wider">ULTIMATE</h3>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
					</ul>
					<div class="spacer height-20"></div>
					<div style="margin:1.5em 0">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-6 border-current hover:border-current font-normal leading-14 rounded tracking-wide">Get Started</a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/pricing-09.png',
		    'category': '107',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 tracking-wide">Plans That Meet Your Needs</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third" style="width: 100%;">
					<h1 class="size-64 font-semibold" style="color: rgb(222, 222, 222);">01</h1>
					<h3 class="size-21 font-semibold">BASIC / <span>$55</span></h3>
					<p style="border-bottom: 2px solid #000; width: 40px; display: inline-block; margin-top:0"></p>
					<p>Lorem Ipsum is dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
					</ul>
					<div style="margin:1.2em 0">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide">Select Plan</a>
					</div>
				</div>
				<div class="column third" style="width: 13.2474%; flex: 0 0 auto;">
					<div class="spacer height-80"></div>
				</div>
				<div style="width: 100%;" class="column third">
					<h1 class="size-64 font-semibold" style="color: rgb(222, 222, 222);">02</h1>
					<h3 class="size-21 font-semibold">PREMIUM / <span>$77</span></h3>
					<p style="border-bottom: 2px solid #000; width: 40px; display: inline-block; margin-top:0"></p>
					<p>Lorem Ipsum is dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
					<ul style="list-style: initial;padding-left: 20px;">
						<li>Feature One</li>
						<li>Feature Two</li>
					</ul>
					<div style="margin:1.2em 0">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 px-7 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide">Select Plan</a>
					</div>
				</div>

			</div>
			`	
		},

		/* Skills */
		{
		    'thumbnail': 'preview/skills-01.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="text-center tracking-widest">Team Skills</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>
			</div>
			<div class="row">
				<div style="width: 100%;" class="column third">
					<div class="spacer height-40"></div>
				</div>
				<div style="width: 54.5922%; flex: 0 0 auto;" class="column third">
					<h1 class="text-center leading-none tracking-widest font-normal size-35">We create things beautifully</h1>
				</div>
				<div class="column third" style="width: 100%;">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<div class="text-center">
						<i class="icon ion-ios-gear-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center font-normal leading-12 size-18">Frontend Development</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<div class="text-center">
						<i class="icon ion-ios-heart-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center font-normal leading-12 size-18">UI/UX</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<div class="text-center">
						<i class="icon ion-ios-rose-outline size-42"></i>
					</div>
					<p class="tracking-75 text-center font-normal leading-12 size-18">Illustration</p>
					<p class="text-center leading-13" style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-02.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-35 font-normal">Team Skills</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-heart-outline size-42"></i>
					</div>
					<h3 class="default-font2 text-left font-normal size-19">UI/UX</h3>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-gear-outline size-42"></i>
					</div>
					<h3 class="default-font2 size-19 font-normal">Full Stack Development</h3>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-world-outline size-42"></i>
					</div>
					<h3 class="default-font2 size-19 font-normal">Branding</h3>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-03.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column fourth">
					<div class="spacer height-80"></div>
				</div>
				<div class="column half">
					<p class="uppercase tracking-wider size-14 text-center" style="color: rgb(109, 109, 109);">I create things beautifully.</p>
					<h1 class="text-center font-semibold leading-11 size-54">My Work Skills</h1>
				</div>
				<div class="column fourth">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row relative">
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">85%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center font-normal size-17">Full Stack</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">90%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center font-normal size-17">UI/UX</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">70%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center font-normal size-17">Illustration&nbsp;</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-04.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div style="width: 40%; flex: 0 0 auto;" class="column half">
					<p class="uppercase tracking-wider size-14" style="color: rgb(109, 109, 109);">I create things beautifully.</p>
					<h1 class="font-medium">My Work Skills</h1>
				</div>
				<div style="width: 100%;" class="column half">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third pr-10">
					<div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgb(51, 51, 51); display: inline-block;" class="text-center">
						<p class="size-28 font-light" style="padding:0;margin:0;line-height:120px;">80%</p>
					</div>
					<div class="spacer height-20"></div>
					<h3 class="font-normal leading-12 size-24">Full Stack</h3>

					<p style="color: rgb(102, 102, 102);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third pr-10">
					<div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgb(51, 51, 51); display: inline-block;" class="text-center">
						<p class="size-28 font-light" style="padding:0;margin:0;line-height:120px;">90%</p>
					</div>
					<div class="spacer height-20"></div>
					<h3 class="font-normal leading-12 size-24">UI/UX</h3>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third pr-10">
					<div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgb(51, 51, 51); display: inline-block;" class="text-center">
						<p class="size-28 font-light" style="padding:0;margin:0;line-height:120px;">95%</p>
					</div>
					<div class="spacer height-20"></div>
					<h3 class="font-normal leading-12 size-24">Illustration&nbsp;</h3>
					<p style="color: rgb(102, 102, 102);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-05.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="size-42 font-medium">Our Skills.</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row sm-autofit">
				<div class="column fourth sm-hidden">
					<div class="spacer height-20"></div>
				</div>
				<div class="column fourth">
					<div class="text-left">
						<i class="icon ion-android-favorite-outline size-35" style="color: rgb(243, 156, 18);"></i>
					</div>
					<h3 class="leading-16 uppercase tracking-wider size-19" style="font-weight: 500;">Web Design</h3>
					<p style="border-bottom: 2px solid #f39c12; width: 40px; display: inline-block;"></p>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column fourth">
					<div class="text-left">
						<i class="icon ion-code size-35" style="color: rgb(243, 156, 18);"></i>
					</div>
					<h3 class="leading-16 uppercase tracking-wider size-19" style="font-weight: 500;">Development</h3>
					<p style="border-bottom: 2px solid #f39c12; width: 40px; display: inline-block;"></p>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column fourth">
					<div class="text-left">
						<i class="icon ion-android-globe size-35" style="color: rgb(243, 156, 18);"></i>
					</div>
					<h3 class="leading-16 uppercase tracking-wider size-19" style="font-weight: 500;">Branding</h3>
					<p style="border-bottom: 2px solid #f39c12; width: 40px; display: inline-block;"></p>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-06.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-275 text-center size-14">Discover<br class="size-14">How Good We Are</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<h2 class="leading-12 text-center font-medium size-48">Team Skills</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row relative">
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">85%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center leading-12 size-17 font-medium">Full Stack</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">90%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center leading-12 size-17 font-medium">UI/UX</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third px-10">
					<h2 class="leading-14 font-light text-center size-54">70%</h2>
					<div class="spacer height-20"></div>
					<h3 class="uppercase tracking-wider text-center leading-12 size-17 font-medium">Illustration&nbsp;</h3>
					<p style="color: rgb(102, 102, 102);" class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-07.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="font-normal tracking-125 size-54">Team Skills</h1>
					<p class="tracking-wider size-15">SEE WHAT WE ARE GOOD AT</p>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block;"></p>
				</div>
			</div>
			<div class="row">
				<div class="column full center">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="center column third"><i class="icon ion-ios-heart-outline size-42"></i>
					<h4 class="font-normal size-19">UI/UX</h4>
					<p class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="center column third"><i class="icon ion-ios-gear-outline size-42"></i>
					<h4 class="font-normal size-19">Full Stack</h4>
					<p class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="center column third"><i class="icon ion-ios-flame-outline size-42"></i>
					<h4 class="font-normal size-19">Illustration</h4>
					<p class="text-center leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-08.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-42 text-center tracking-wider">OUR CAPABILITIES</h1>
					<p class="tracking-wider">SEE WHAT WE ARE GOOD AT</p>
					<p style="border-bottom: 2px solid #000; width: 50px; display: inline-block;"></p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column fourth flex flex-col justify-center items-center">
					<div class="flex flex-col justify-center items-center" style="width: 100px;height: 100px;border-radius: 50%;border: 3px solid #333;">
						<p class="size-21 font-normal">90%</p>
					</div>
					<p>WEB DESIGN</p>
				</div>
				<div class="column fourth flex flex-col justify-center items-center">
					<div class="flex flex-col justify-center items-center" style="width: 100px;height: 100px;border-radius: 50%;border: 3px solid #333;">
						<p class="font-normal size-21">78%</p>
					</div>
					<p>GRAPHIC DESIGN</p>
				</div>
				<div class="column fourth flex flex-col justify-center items-center">
					<div class="flex flex-col justify-center items-center" style="width: 100px;height: 100px;border-radius: 50%;border: 3px solid #333;">
						<p class="size-21 font-normal">70%</p>
					</div>
					<p>PHOTOGRAPHY</p>
				</div>
				<div class="column fourth flex flex-col justify-center items-center">
					<div class="flex flex-col justify-center items-center" style="width: 100px;height: 100px;border-radius: 50%;border: 3px solid #333;">
						<p class="size-21 font-normal">82%</p>
					</div>
					<p>MARKETING</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-09.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 text-center tracking-wider">OUR CAPABILITIES</h1>
					<p class="text-center tracking-wider">SEE WHAT WE ARE GOOD AT</p>
				</div>

			</div>
			<div class="row">
				<div class="column full center">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column center third"><i class="icon ion-ios-heart-outline size-28 leading-none"></i>
					<p class="size-54 leading-12">95%</p>
					<p class="size-16 tracking-75">WEB DESIGN</p>
				</div>
				<div class="column center third"><i class="icon ion-ios-gear-outline size-28 leading-none"></i>
					<p class="size-54 leading-12">90%</p>
					<p class="size-16 tracking-75">WEB DEVELOPMENT</p>
				</div>
				<div class="column center third"><i class="icon ion-ios-camera-outline size-28 leading-none"></i>
					<p class="size-54 leading-12">87%</p>
					<p class="size-16 tracking-75">PHOTOGRAPHY</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-10.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-normal">Our Expertise</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-ios-lightbulb-outline size-35"></i>
					<h4 class="font-normal size-19">UI/UX</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-heart-outline size-35"></i>
					<h4 class="font-normal size-19">Full Stack Development</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-list-outline size-35"></i>
					<h4 class="font-normal size-19">Illustration</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><i class="icon ion-ios-camera-outline size-35"></i>
					<h4 class="font-normal"><span class="size-19">Video Explainer</span></h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-locked-outline size-35"></i>
					<h4 class="font-normal"><span class="size-19">Branding</span></h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third"><i class="icon ion-ios-world-outline size-35"></i>
					<h4><span class="font-normal size-19">Marketing</span></h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/skills-11.png',
		    'category': '108',
		    'html': `
			<div class="row">
				<div class="column full" style="padding-right: 35px;">
					<h1 class="uppercase tracking-widest size-28 font-normal" style="margin-top: 0px;">What We're Good At</h1>

				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half"><i class="icon ion-ios-lightbulb-outline size-35 leading-none" style="color: rgb(216, 81, 56);"></i>
					<h4 class="font-normal size-19">Concept &amp; Ideas</h4>
					<p>Lorem ipsum is dummy text of printing industry.</p>

				</div>
				<div class="column half"><i class="icon ion-ios-heart-outline size-35 leading-none" style="color: rgb(216, 81, 56);"></i>
					<h4 class="font-normal size-19">Responsive Design</h4>
					<p>Lorem ipsum is dummy text of printing industry.</p>

				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">

					<i class="icon ion-ios-gear-outline size-35 leading-none" style="color: rgb(216, 81, 56);"></i>
					<h4 class="font-normal size-19">Web Development</h4>
					<p>Lorem ipsum is dummy text of printing industry.</p>
				</div>
				<div class="column half">

					<i class="icon ion-ios-list-outline size-35 leading-none" style="color: rgb(216, 81, 56);"></i>
					<h4 class="font-normal size-19">Marketing</h4>
					<p>Lorem ipsum is dummy text of printing industry.</p>
				</div>

			</div>
			`	
		},

		/* Achievements */
		{
		    'thumbnail': 'preview/achievements-01.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-light tracking-wide size-35">Achievements</h1>
					<p class="text-center tracking-widest size-14">WHAT MAKES US DIFFERENT</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth center"><i class="icon ion-android-people size-28"></i>
					<h1 class="is-title1-48 is-title-bold font-light size-35" style="margin-top: 0px;">400+</h1>
					<p class="size-16">HAPPY CLIENTS</p>
				</div>
				<div class="column fourth center"><i class="icon ion-android-checkbox-outline size-28"></i>
					<h1 class="is-title1-48 is-title-bold font-light size-35" style="margin-top: 0px;">234</h1>
					<p class="size-16">PROJECTS DONE</p>
				</div>
				<div class="column fourth center"><i class="icon ion-trophy size-28"></i>
					<h1 class="is-title1-48 is-title-bold font-light size-35" style="margin-top: 0px;">12</h1>
					<p class="size-16">AWARDS WON</p>
				</div>
				<div class="column fourth center"><i class="icon ion-android-favorite-outline size-28"></i>
					<h1 class="is-title1-48 is-title-bold font-light size-35" style="margin-top: 0px;">70k+</h1>
					<p class="size-16">FOLLOWERS</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-02.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column third">
					<div class="spacer height-80"></div>
				</div>
				<div class="column third">
					<p class="uppercase tracking-wider size-14 text-center" style="color: rgb(109, 109, 109);">Fun Facts</p>
					<h1 class="text-center font-light size-32">What Makes Us Different</h1>
				</div>
				<div class="column third">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h1 class="text-center leading-14 font-light size-48">100+</h1>
					<h4 class="text-center font-normal size-21">Happy Clients</h4>
					<p class="text-center leading-13" style="color: rgb(109, 109, 109);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<h1 class="text-center leading-14 font-light size-48">157</h1>
					<h4 class="text-center font-normal size-21">Completed Projects</h4>
					<p class="text-center leading-13" style="color: rgb(109, 109, 109);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<h1 class="text-center leading-14 font-light size-48">35</h1>
					<h4 class="text-center font-normal size-21">Countries Served</h4>
					<p class="text-center leading-13" style="color: rgb(109, 109, 109);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-03.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<p class="uppercase tracking-300 leading-18 size-12" style="color: rgb(109, 109, 109);">Achievements</p>
					<h1 class="font-light size-35">Why we are so awesome.</h1>
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
					<h3 class="leading-12 tracking-wide size-19 font-light">Satisfaction</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="text-left leading-14">
						<i class="icon ion-ios-people-outline size-48"></i>
					</div>
					<h2 class="leading-12 size-35">1.234</h2>
					<h3 class="leading-12 size-19 tracking-wide font-light">Happy Clients</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<div class="text-left leading-14">
						<i class="icon ion-ios-compose-outline size-48"></i>
					</div>
					<h2 class="leading-12 size-35">567</h2>
					<h3 class="leading-12 size-19 tracking-wide font-light">Projects Done</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);" class="leading-13">Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-04.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<p style="color: rgb(158, 158, 158);">Fun Facts</p>
					<h1 class="font-light tracking-wide size-32">WHAT MAKES US DIFFERENT</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<h1 class="size-42"><i class="icon ion-ios-world-outline size-35"></i>&nbsp;&nbsp;<span class="font-semibold size-35">11</span></h1>
					<p style="margin-bottom: 0px; letter-spacing: 1px;">YEAR OF EXPERIENCE</p>
					<p style="margin-top: 0px; color: rgb(158, 158, 158);" class="size-16 leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<h1 class="size-42"><i class="icon ion-ios-heart-outline size-35"></i>&nbsp;&nbsp;<span class="font-semibold size-35">100%</span></h1>
					<p style="margin-bottom: 0px; letter-spacing: 1px;">POSITIVE FEEDBACK</p>
					<p style="margin-top: 0px; color: rgb(158, 158, 158);" class="size-16 leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third">
					<h1 class="size-42"><i class="icon ion-ios-star-outline size-35"></i>&nbsp;&nbsp;<span class="font-semibold size-35">14</span></h1>
					<p style="margin-bottom: 0px; letter-spacing: 1px;">NATIONAL AWARDS</p>
					<p style="margin-top: 0px; color: rgb(158, 158, 158);" class="size-16 leading-13">Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-05.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column half">
					<h1 class="size-42 tracking-wide">Milestones</h1>
					<p class="size-16" style="color: rgb(158, 158, 158);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p>
				</div>
				<div class="center column fourth"><i class="icon ion-ios-list-outline size-42 leading-normal"></i>
					<h1 class="size-28 tracking-wide" style="font-family: Georgia, serif;">127</h1>
					<p class="size-16 leading-none" style="margin-top: 0px;">PROJECTS DONE</p>
					<div class="spacer height-20"></div>
					<i class="icon ion-ios-star size-42 leading-normal"></i>
					<h1 class="size-28 tracking-wide" style="font-family: Georgia, serif;">11</h1>
					<p class="size-16 leading-none" style="margin-top: 0px;">AWARDS WON</p>
				</div>
				<div class="center column fourth"><i class="icon ion-ios-people size-42 leading-normal"></i>
					<h1 class="size-28 tracking-wide" style="font-family: Georgia, serif;">300+</h1>
					<p class="size-16 leading-none" style="margin-top: 0px;">HAPPY CLIENTS</p>
					<div class="spacer height-20"></div>
					<i class="icon ion-ios-heart-outline size-42 leading-normal"></i>
					<h1 class="size-28 tracking-wide" style="font-family: Georgia, serif;">105k+</h1>
					<p class="size-16 leading-none" style="margin-top: 0px;">FOLLOWERS</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-06.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-light size-35 tracking-75">ACHIEVEMENTS</h1>
					<p style="color: rgb(102, 102, 102);" class="text-center size-17 tracking-wider">Disvover how good we are</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="center column fourth"><i class="icon ion-ios-paperplane-outline size-72 leading-13" style="color: rgb(220, 220, 220);"></i>
					<h1 class="size-35 tracking-wide" style="font-family: Georgia, serif;">267</h1>
					<p style="border-bottom: 3px solid rgb(0, 0, 0); width: 30px; display: inline-block; margin-top: 0px;" class="leading-none"></p>
					<p class="size-14 leading-none" style="margin-top: 0px;">PROJECTS DONE</p>
				</div>
				<div class="center column fourth"><i class="icon ion-ios-people size-72 leading-13" style="color: rgb(220, 220, 220);"></i>
					<h1 class="size-35 tracking-wide" style="font-family: Georgia, serif;">500+</h1>
					<p style="border-bottom: 3px solid rgb(0, 0, 0); width: 30px; display: inline-block; margin-top: 0px;" class="leading-none"></p>
					<p class="size-14 leading-none" style="margin-top: 0px;">HAPPY CUSTOMERS</p>
				</div>
				<div class="center column fourth"><i class="icon ion-ios-heart-outline size-72 leading-13" style="color: rgb(220, 220, 220);"></i>
					<h1 class="size-35 tracking-wide" style="font-family: Georgia, serif;">95k+</h1>
					<p style="border-bottom: 3px solid rgb(0, 0, 0); width: 30px; display: inline-block; margin-top: 0px;" class="leading-none"></p>
					<p class="size-14 leading-none" style="margin-top: 0px;">FOLLOWERS</p>
				</div>
				<div class="center column fourth"><i class="icon ion-ios-star size-72 leading-13" style="color: rgb(220, 220, 220);"></i>
					<h1 class="size-35 tracking-wide" style="font-family: Georgia, serif;">11</h1>
					<p style="border-bottom: 3px solid rgb(0, 0, 0); width: 30px; display: inline-block; margin-top: 0px;" class="leading-none"></p>
					<p class="size-14 leading-none" style="margin-top: 0px;">AWARDS WON</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-07.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center tracking-wide size-35">ACHIEVEMENTS</h1>
				</div>
			</div>
			<div class="row">
				<div class="column fourth">
					<div class="spacer height-60"></div>
				</div>
				<div class="column half">
					<p style="color: rgb(102, 102, 102);" class="text-center">Disvover how good we are</p>
				</div>
				<div class="column fourth">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<h1 class="text-center tracking-wide size-54">400+</h1>
					<h3 class="text-center tracking-widest size-16">HAPPY CLIENTS</h3>
				</div>
				<div class="column third">
					<h1 class="text-center tracking-wide size-54">123</h1>
					<h3 class="text-center tracking-widest size-16">PROJECTS DONE</h3>
				</div>
				<div class="column third">
					<h1 class="text-center tracking-wide size-54">79k+</h1>
					<h3 class="text-center tracking-widest size-16">FOLLOWERS</h3>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-08.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center tracking-wider size-35">ACHIEVEMENTS</h1>
					<p class="text-center tracking-75 size-15">WHAT MAKES US DIFFERENT</p>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-android-happy size-32" style="color: #f35b1c;"></i>
					<h3 class="leading-none tracking-wide size-18">4k+ HAPPY CLIENTS</h3>
					<p style="border-bottom: 2px solid #f35b1c; width: 50px; display: inline-block;"></p>
				</div>
				<div class="column third center"><i class="icon ion-edit size-32" style="color: #f35b1c"></i>
					<h3 class="leading-none tracking-wide size-18">98 PROJECTS DONE</h3>
					<p style="border-bottom: 2px solid #f35b1c; width: 50px; display: inline-block;"></p>
				</div>
				<div class="column third center"><i class="icon ion-trophy size-32" style="color: #f35b1c"></i>
					<h3 class="leading-none tracking-wide size-18">12 AWARDS WON</h3>
					<p style="border-bottom: 2px solid #f35b1c; width: 50px; display: inline-block;"></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-09.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div style="width: 40%; flex: 0 0 auto;" class="column half">
					<p class="uppercase tracking-wider size-14" style="color: rgb(109, 109, 109);">Fun Facts</p>
					<h1 class="font-medium">What makes us different.</h1>
				</div>
				<div style="width: 100%;" class="column half">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<h3 class="size-42 leading-14">100%</h3>
					<p class="font-semibold">Satisfaction</p>
					<p style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third">
					<h3 class="size-42 leading-14">45</h3>
					<p class="font-semibold">Awards</p>
					<p style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third">
					<h3 class="leading-14 size-42">1.234</h3>
					<p class="font-semibold">Happy Clients</p>
					<p style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/achievements-10.png',
		    'category': '109',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-35">FUN FACTS / <span style="color: rgb(143, 143, 143);">WHAT MAKES US DIFFERENT</span></h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column fourth">
					<h1 class="size-35">300+</h1>
					<h3 class="tracking-wider size-16">HAPPY CLIENTS</h3>
				</div>
				<div class="column fourth">
					<h1 class="size-35">123</h1>
					<h3 class="tracking-wider size-16">PROJECTS</h3>
				</div>
				<div class="column fourth">
					<h1 class="size-35">78K+</h1>
					<h3 class="tracking-wider size-16">SUBSCRIBERS</h3>
				</div>
				<div class="column fourth">
					<h1 class="size-35">12</h1>
					<h3 class="tracking-wider size-16">AWARDS WON</h3>
				</div>
			</div>
			`	
		},

		/* Quotes */
		{
		    'thumbnail': 'preview/quotes-01.png',
		    'category': '110',
		    'html': `
			<div class="row relative">

				<div class="flex flex-col justify-center column half">
					<div class="text-left leading-18">
						<i class="icon ion-quote size-28"></i>
					</div>

					<p class="size-21 leading-14">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

					<p style="color: rgb(138, 138, 138);">- A User</p>
				</div>

				<div class="flex flex-col justify-center column half">
					<div class="text-left leading-18">
						<i class="icon ion-quote size-28"></i>
					</div>

					<p class="size-21 leading-14">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

					<p style="color: rgb(138, 138, 138);">- A User</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-02.png',
		    'category': '110',
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
					<h1 class="size-32 leading-11">[Company Name] provide us with a forward thinking and well placed service. This has made significant impact on the efficiency and stability of our network.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<p class="italic tracking-wider">— A User</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-03.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column two-third"><img src="assets/minimalist-blocks/images/ai-r43cG.jpg" alt="" data-filename=" ai-49P75-editRkU0S4C.png"></div>

    <div class="flex flex-col justify-center column third py-3">
        <div class="text-left leading-18">
            <i class="icon ion-quote size-28"></i>
        </div>

        <p class="size-21 leading-14">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

        <p style="color: rgb(138, 138, 138);">- A User</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-04.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="flex flex-col justify-center column two-third">
					<h2 class="font-normal leading-11 size-32">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h2>
				</div>
				<div class="flex flex-col justify-center items-end column third">
				
					<p class="leading-14 text-right"><span class="font-normal size-19">Morten N. Andersen</span><br class="size-17">A User</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-05.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="text-center size-35 font-normal">Their Stories</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="text-center flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/ai-HIWv9.jpg" alt="" style="border-radius: 500px; width: 65%; height: auto;">
        <div class="spacer height-20"></div>
        <h3 class="size-19 font-light">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h3>
        <p class="tracking-wider size-16" style="color: rgb(138, 138, 138);">— A Client</p>
    </div>
    <div class="text-center flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/ai-enoP2.jpg" alt="" style="border-radius: 500px; width: 65%; height: auto;" data-filename="ai-KavP7-editqE13lyq.png">
        <div class="spacer height-20"></div>
        <h3 class="size-19 font-light">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h3>
        <p class="tracking-wider size-16" style="color: rgb(138, 138, 138);">— A Client</p>
    </div>
    <div class="text-center flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/ai-COmhJ.jpg" alt="" style="border-radius: 500px; width: 65%; height: auto;" data-filename="ai-R3Xui-editGGY45h3.png">
        <div class="spacer height-20"></div>
        <h3 class="size-19 font-light">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h3>
        <p class="tracking-wider size-16" style="color: rgb(138, 138, 138);">— A Client</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-06.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="text-center size-35 font-normal">Their Stories</h1>
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

        <h3 class="size-19 font-light">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h3>
        <p class="tracking-wider size-16" style="color: rgb(102, 102, 102);">— A Client</p>
    </div>
    <div class="text-center flex flex-col justify-center items-center column" style="width: 50%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-8ABNg.jpg" alt="" data-filename="ai-3A86k-edithSvRhPC.png">
        <div class="spacer height-20"></div>
        <div class="text-center">
            <i class="icon ion-quote size-28"></i>
        </div>

        <h3 class="size-19 font-light">"Lorem Ipsum is simply dummy text of the printing and typesetting industry"</h3>
        <p class="tracking-wider size-16" style="color: rgb(102, 102, 102);">— A Client</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-07.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="tracking-tight size-35 font-normal">Loving words.</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-Tf6Lf.jpg" alt="" data-filename="ai-4643D-editgoanILm.png"></div>

    <div class="flex flex-col justify-center column half">
        <p class="leading-14">"Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type."</p>
        <p class="italic size-16">— A User</p>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row relative xs-items-1 sm-column-reverse md-column-reverse desktop-column-reverse">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-PzIQ9.jpg" alt="" data-filename="ai-SZFTj-editdAfykdZ.png"></div>

    <div class="flex flex-col justify-center column half">
        <p class="leading-14">"Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type."</p>
        <p class="italic size-16">— A User</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-08.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center size-42 font-normal">Their Stories</h1>
				</div>

			</div>

			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row relative">
				<div class="flex flex-col justify-center column two-third">
					<div class="text-left leading-18">
						<i class="icon ion-quote size-28"></i>
					</div>

					<p class="size-35 leading-11">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

					<p style="color: rgb(138, 138, 138);">- A User</p>
				</div>
				<div class="flex flex-col justify-center column third">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row relative">

				<div class="flex flex-col justify-center column third">
					<div class="text-left leading-18">
						<i class="icon ion-quote size-28"></i>
					</div>

					<p class="size-21 leading-13">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

					<p style="color: rgb(138, 138, 138);">- A User</p>
				</div>
				<div class="flex flex-col justify-center column third">
					<div class="spacer height-80"></div>
				</div>

				<div class="flex flex-col justify-center column third">
					<div class="text-left leading-18">
						<i class="icon ion-quote size-28"></i>
					</div>

					<p class="size-21 leading-13">It's easy to use, customizable, and user-friendly. A truly amazing features.</p>

					<p style="color: rgb(138, 138, 138);">- A User</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-09.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-32 font-medium">Their Stories.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div style="width: 16.3883%; flex: 0 0 auto;" class="column fourth flex flex-col justify-start items-center">
					<div class="text-left">
						<i class="icon ion-quote size-32"></i>
					</div>
				</div>
				<div style="width: 100%;" class="column fourth">
					<p class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it.</p>
					<p class="italic size-15 tracking-wider">— A Client</p>
				</div>
				<div style="width: 16.3883%; flex: 0 0 auto;" class="column fourth flex flex-col justify-start items-center">
					<div class="text-left">
						<i class="icon ion-quote size-32"></i>
					</div>
				</div>
				<div style="width: 100%;" class="column fourth">
					<p class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it.</p>
					<p class="italic size-15 tracking-wider">— A Client</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-10.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="column third">
					<div class="spacer height-20"></div>
					<h1 class="font-normal leading-none size-21">Nina Mathiesen</h1>
					<p class="size-16">A Student</p>
				</div>
				<div class="column two-third">
					<h2 class="font-medium size-42 leading-12">I am thoroughly impressed with this course. It provided me with a comprehensive education and I am confident in my newfound abilities. I highly recommend this course for anyone who wants to enhance their skills.</h2>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<p class="text-right size-15"><a href="#" title="" class="no-underline font-normal">Read more stories&nbsp;</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-11.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="tracking-wide font-medium size-35">What they say.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<h2 class="leading-none size-32">I highly recommend [CompanyName]. I got a brand identity that truly feels timeless and impressive.</h2>
					<div class="spacer height-20"></div>
					<p class="not-italic tracking-75">— A Client</p>
				</div>
				<div class="column half">
					<h2 class="leading-none size-32">Super awesome products with great support!</h2>
					<div class="spacer height-20"></div>
					<p class="not-italic tracking-75">— A Client</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-12.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column half"><img src="assets/minimalist-blocks/images/ai-K9gej.jpg" alt="" data-filename="ai-rBr7f-editeNITo5O.png"></div>
    <div class="column half flex flex-col justify-center items-center">
        <h1 class="font-semibold text-center size-28">"Incredible services and awesome customer support."</h1>
        <div class="spacer height-80"></div>
        <p class="text-center size-16">BY MARTHA MASSEY<br>Project Manager at Company Name</p>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/quotes-13.png',
		    'category': '110',
		    'html': `
<div class="row">
    <div class="column flex flex-col justify-center items-start">
        <h2 class="font-semibold leading-11 tracking-wide size-32">"All products are awesome with strong attention to details."</h2>
        <p style="color: rgb(158, 158, 158); font-family: Georgia, serif; font-style: italic;">- Kyle Harrelson</p>
        <div class="spacer height-20"></div>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. <a href="#" title="">Read the Success Story</a></p>
    </div>
    <div class="column" style="width: 60%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-6eGW3.jpg" alt="" data-filename="ai-ZX06k-editlAqmkn9.png"></div>
</div>
			`	
		},

		{
		    'thumbnail': 'preview/quotes-14.png',
		    'category': '110',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-35 font-semibold">Building trust through experience.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<p class="text-justify">"All products are super awesome with strong attention to details, customizable tools which can help us improve our business."</p>
					<div class="list">
						<i class="icon ion-android-happy size-28"></i>
						<p><span class="font-semibold">Richard Allen</span></p>
						<p style="color: rgb(158, 158, 158);margin-top:0">CEO of CreativeStudio</p>
					</div>
				</div>
				<div class="column half">
					<p class="text-justify">"Has a bunch of amazing tools. Very easy to use and customizable. No need to make extra actions. It fits my requirements perfectly!"</p>
					<div class="list">
						<i class="icon ion-android-happy size-28"></i>
						<p><span class="font-semibold">Sandra Stephenson </span></p>
						<p style="color: rgb(158, 158, 158);margin-top:0">Director at Artive</p>
					</div>
				</div>

			</div>
			`	
		},


		/* Partners */
		{
		    'thumbnail': 'preview/partners-01.png',
		    'category': '111',
		    'html': `
			<div class="row">
				<div style="width: 40.2151%; flex: 0 0 auto;" class="flex flex-col justify-end column half">
					<h1 class="text-left leading-none font-light size-42">Our Lovely Clients</h1>
				</div>
				<div style="width: 100%;" class="column half xs-hidden">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row sm-autofit">
				<div class="column fourth sm-hidden xs-hidden">
					<div class="spacer height-60"></div>
				</div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/creative.png" alt=""></div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/steady.png" alt=""></div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/light-studio.png" alt=""></div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row sm-autofit">
				<div class="column fourth sm-hidden xs-hidden">
					<div class="spacer height-60"></div>
				</div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/infinitech.png" alt=""></div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/design-firm.png" alt=""></div>
				<div class="column fourth"><img src="assets/minimalist-blocks/images/sitepro.png" alt=""></div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/partners-02.png',
		    'category': '111',
		    'html': `
			<div class="row">
				<div class="column full text-center">
					<h1 class="leading-18 text-center tracking-wide size-35">Our Lovely Clients</h1>
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
		    'thumbnail': 'preview/partners-03.png',
		    'category': '111',
		    'html': `
			<div class="row">
				<div style="width: 29.3083%; flex: 0 0 auto;" class="column fourth flex flex-col justify-center items-start">
					<h1 class="leading-none size-35 font-normal">Our Partners</h1>

					<p>We are globally recognized and trusted by the world's best names.</p>
				</div>
				<div style="width: 100%;" class="column fourth">
					<div class="spacer height-40"></div>
				</div>
				<div class="column fourth flex flex-col justify-center items-center" style="width: 100%;">
					<img src="assets/minimalist-blocks/images/infinitech.png" alt="">
					<div class="spacer height-20"></div><img src="assets/minimalist-blocks/images/light-studio.png" alt="">
				</div>
				<div class="column fourth flex flex-col justify-center items-center" style="width: 100%;">
					<img src="assets/minimalist-blocks/images/steady.png" alt="">
					<div class="spacer height-20"></div><img src="assets/minimalist-blocks/images/sitepro.png" alt="">
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/partners-04.png',
		    'category': '111',
		    'html': `
			<div class="row sm-autofit">

				<div class="column third sm-hidden xs-hidden">
					<div class="spacer height-80"></div>
				</div>
				<div class="column third">

					<h1 class="text-center font-semibold size-32 leading-12">Our Lovely Clients</h1>
					<div class="spacer height-20"></div>
					<p class="text-center" style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

				</div>
				<div class="column third sm-hidden xs-hidden">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column fifth"><img src="assets/minimalist-blocks/images/creative.png" alt=""></div>
				<div class="column fifth"><img src="assets/minimalist-blocks/images/steady.png" alt=""></div>
				<div class="column fifth"><img src="assets/minimalist-blocks/images/light-studio.png" alt=""></div>
				<div class="column fifth"><img src="assets/minimalist-blocks/images/design-firm.png" alt=""></div>
				<div class="column fifth"><img src="assets/minimalist-blocks/images/sitepro.png" alt=""></div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/partners-05.png',
		    'category': '111',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42"><span class="font-semibold tracking-wide size-35">Serving Clients with Passion.</span></h1>
					<p class="size-16">We are globally recognized and trusted by the world's best names.</p>
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

		/* As Featured On */
		{
		    'thumbnail': 'preview/asfeaturedon-01.png',
		    'category': '112',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-light leading-none size-32">As Featured On</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="flex flex-col justify-center items-center column fifth"><img src="assets/minimalist-blocks/images/upclick.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column fifth"><img src="assets/minimalist-blocks/images/digitalmag.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column fifth"><img src="assets/minimalist-blocks/images/mmedia.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column fifth"><img src="assets/minimalist-blocks/images/bbuzz.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column fifth"><img src="assets/minimalist-blocks/images/prosource.png" alt=""></div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/asfeaturedon-02.png',
		    'category': '112',
		    'html': `
			<div class="row">
				<div class="column fifth" style="width: 25.2866%; flex: 0 0 auto;">
					<h1 class="leading-08 size-42 font-normal">as featured on</h1>
				</div>
				<div class="column fifth">
					<div class="spacer height-40"></div>
				</div>
				<div class="column fifth flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/onesight.png" alt=""></div>
				<div class="column fifth flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/mmedia.png" alt=""></div>
				<div class="column fifth flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/digitalmag.png" alt=""></div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/asfeaturedon-03.png',
		    'category': '112',
		    'html': `
			<div class="row sm-autofit">
				<div class="p-10 column third">
					<h1 class="leading-none text-left size-32 font-semibold">As Seen On</h1>
				</div>
				<div class="p-10 column third">
					<p class="text-left" style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

				</div>
				<div class="column third sm-hidden xs-hidden">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full xs-hidden">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third"><img src="assets/minimalist-blocks/images/upclick.png" alt=""></div>
				<div class="column third"><img src="assets/minimalist-blocks/images/digitalmag.png" alt=""></div>
				<div class="column third"><img src="assets/minimalist-blocks/images/mmedia.png" alt=""></div>
			</div>
			<div class="row">
				<div class="column third"><img src="assets/minimalist-blocks/images/prosource.png" alt=""></div>
				<div class="column third"><img src="assets/minimalist-blocks/images/worldwide.png" alt=""></div>
				<div class="column third"><img src="assets/minimalist-blocks/images/bbuzz.png" alt=""></div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/asfeaturedon-04.png',
		    'category': '112',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center leading-none size-32 font-normal">As Featured On</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/upclick.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/digitalmag.png" alt=""></div>
				<div class="flex flex-col justify-center items-center column third"><img src="assets/minimalist-blocks/images/mmedia.png" alt=""></div>

			</div>

			<div class="row">
				<div class="column third flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/prosource.png" alt=""></div>

				<div class="column third flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/nett.png" alt=""></div>
				<div class="column third flex flex-col justify-center items-center"><img src="assets/minimalist-blocks/images/worldwide.png" alt=""></div>

			</div>
			`	
		},

		/* 404 */
		{
		    'thumbnail': 'preview/404-01.png',
		    'category': '113',
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
					<h1 class="is-title1-48 is-title-lite leading-none font-light text-center size-42">Page Not Found</h1>
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<p class="size-19 text-center" style="color: rgb(109, 109, 109);">The page you requested couldn't be found. This could be a spelling error in the URL or a removed page.</p>
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
						<a href="#" role="button" class="transition-all inline-block cursor-pointer no-underline border-2 border-solid mr-1 mt-2 mb-2 tracking-75 py-2 border-current text-black hover:border-current font-normal ml-1 leading-relaxed rounded-full px-11 size-13" onmouseover="if(this.getAttribute('data-hover-bg'))this.style.backgroundColor=this.getAttribute('data-hover-bg');" onmouseout="if(this.getAttribute('data-bg'))this.style.backgroundColor=this.getAttribute('data-bg');else this.style.backgroundColor=''">Back to Home</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-02.png',
		    'category': '113',
		    'html': `
			<div class="row">
				<div class="column full center">
					<i class="icon ion-alert-circled size-64"></i>
					<h1 class="size-42 is-title2-48 is-title-lite">Oops, page not found.</h1>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);">The page you are looking for might have been removed, had its name changed, or temporarily unavailable.</p>
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="text-center button-group">
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full size-14 uppercase tracking-125">HomePage</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-03.png',
		    'category': '113',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="size-196 leading-none tracking-wider" style="margin-bottom: 10px;">404</h1>
					<h3 class="size-28 tracking-225">PAGE NOT FOUND</h3>
					<div class="spacer height-20"></div>
					<p style="color: rgb(109, 109, 109);">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
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
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 border-current hover:border-current font-normal leading-relaxed rounded size-14 uppercase pt-2 pb-2 px-8 tracking-75">Back to Home</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/404-04.png',
		    'category': '113',
		    'html': `
			<div class="row">
				<div class="column full"><i class="icon ion-android-sad size-64"></i>
					<h1 class="is-title1-48 is-title-lite size-42">Something's wrong here... </h1>
					<p class="size-21">The page you requested couldn't be found. This could be a spelling error in the URL or a removed page.</p>
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
						<a href="#" role="button" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-18 px-9 border-current hover:border-current font-normal leading-relaxed rounded-full tracking-wide">Back to Home</a>
					</div>
				</div>

			</div>
			`	
		},

		/* Coming Soon */
		{
		    'thumbnail': 'preview/comingsoon-01.png',
		    'category': '114',
		    'html': `
			<div class="row">
				<div class="column full">
					<div class="text-center leading-18">
						<i class="icon ion-alert-circled size-64"></i>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<h1 class="text-center leading-12 size-42 font-light">Sorry, our website is currently getting a face lift. Check back soon for the new awesome and improved site.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="button-group text-center">
						<a href="#" role="button" class="transition-all inline-block cursor-pointer no-underline border-2 border-solid mr-1 mt-2 mb-2 tracking-75 uppercase py-2 border-current text-black hover:border-current font-normal ml-1 leading-relaxed rounded-full px-11 size-13" onmouseover="if(this.getAttribute('data-hover-bg'))this.style.backgroundColor=this.getAttribute('data-hover-bg');" onmouseout="if(this.getAttribute('data-bg'))this.style.backgroundColor=this.getAttribute('data-bg');else this.style.backgroundColor=''">Contact</a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/comingsoon-02.png',
		    'category': '114',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h3 class="is-title1-32 is-title-lite size-21 leading-tight">STAY TUNED!</h3>
					<h1 class="size-64 is-title1-54 is-title-bold font-normal leading-none">OUR WEBSITE IS COMING VERY SOON</h1>
					<div class="spacer height-20"></div>
					<div class="is-social size-21">
                        <a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
                        <a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
                        <a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/comingsoon-03.png',
		    'category': '114',
		    'html': `
			<div class="row">
				<div class="column full center"><i class="icon ion-laptop size-64"></i>
					<h1 class="size-35 is-title2-48 is-title-lite font-semibold">SITE IS UNDER MAINTENANCE </h1>
					<p class="size-21">Please check back in sometime.</p>
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
		{
		    'thumbnail': 'preview/comingsoon-04.png',
		    'category': '114',
		    'html': `
			<div class="row">
				<div class="column full center">
					<p style="border-bottom: 2px solid #000;width: 210px;display: inline-block;"></p>
					<h1 class="size-35 tracking-wider">Sorry, our website is currently getting a face lift. Check back soon for the new awesome and improved site.</h1>
					<p style="border-bottom: 2px solid #000; width: 210px; display: inline-block; margin-top: 20px"></p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/comingsoon-05.png',
		    'category': '114',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-140 font-semibold leading-09 text-center tracking-wide">Coming Soon.</h1>
				</div>

			</div>
			`	
		},

		/* FAQ */
		{
		    'thumbnail': 'preview/faq-01.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">Can I create a website?</h2>
					<div class="spacer height-20"></div>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">How do I create an account?</h2>
					<div class="spacer height-20"></div>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-02.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column half">
					<div class="text-left">
						<i class="icon ion-ios-infinite-outline size-42" style="color: rgb(138, 138, 138);"></i>
					</div>
					<h2 class="size-21 font-normal">What does [CompanyName] do?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>

				<div class="column half">
					<div class="text-left">
						<i class="icon ion-ios-lightbulb-outline size-42" style="color: rgb(138, 138, 138);"></i>
					</div>
					<h2 class="size-21 font-normal">How [CompanyName] helps your business?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-03.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="tracking-tight size-42 font-normal">FAQ</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">Can I create a website?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">How do I create an account?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">How do I change style options?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

				<div class="column half">
					<h2 class="tracking-tight size-21 leading-none font-normal">How do I report an issue?</h2>
					<p style="color: rgb(72, 72, 72);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-04.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center size-64 font-normal">FAQ</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half" style="width: 67.1948%; flex: 0 0 auto;">
					<h2 class="size-21 font-medium">How [CompanyName] helps your business.</h2>
					<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half xs-hidden" style="width: 100%;">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h2 class="size-21 font-medium">Services we provide.</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half">
					<h2 class="size-21 font-medium">Benefits of IT consulting services.</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-05.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column two-third">
					<h1 class="text-left leading-09 font-light tracking-wide size-64">Frequently Asked Questions</h1>
				</div>
				<div class="xs-hidden column third">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-infinite-outline size-42"></i>
					</div>
					<h3 class="size-21 font-normal">What services does [CompanyName] offer?</h3>
					<p class="leading-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-chatboxes-outline size-42"></i>
					</div>
					<h3 class="size-21 font-normal">Why should we choose [CompanyName]?</h3>
					<p class="leading-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column third">
					<div class="text-left">
						<i class="icon ion-ios-people-outline size-42"></i>
					</div>
					<h3 class="size-21 font-normal">Who will be working on my account?</h3>
					<p class="leading-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-06.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 text-left font-medium">All you need to know</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div style="width: 100%;" class="column third xs-hidden">
					<div class="spacer height-60"></div>
				</div>
				<div class="column two-third" style="width: 66.7237%; flex: 0 0 auto;">
					<h2 class="size-24 font-medium">What does [CompanyName] do?</h2>
					<p class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div style="width: 39.8631%; flex: 0 0 auto;" class="column half">
					<h2 class="size-24 font-medium">Why should we choose [CompanyName]?</h2>
					<p class="leading-14">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
				<div class="column half xs-hidden" style="width: 100%;">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-20"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half xs-hidden" style="width: 100%;">
					<div class="spacer height-60"></div>
				</div>
				<div style="width: 52.9357%; flex: 0 0 auto;" class="column half">
					<h2 class="size-24 font-medium">What will be delivered and when?</h2>
					<p class="leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-07.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 style="max-width: 500px; width: 100%;" class="font-semibold tracking-wide">Frequently asked questions</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h3 class="size-21 font-medium">What do you do?</h3>
				</div>
				<div class="column half">
					<p class="text-justify leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h3 class="size-21 font-medium">How does this work?</h3>
				</div>
				<div class="column half">
					<p class="text-justify leading-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<h3 class="size-21 font-medium">What is the return policy?</h3>
				</div>
				<div class="column half">
					<p class="text-justify leading-14">An unknown printer took a galley of type &amp; scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
		{
		    'thumbnail': 'preview/faq-08.png',
		    'category': '115',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-28 text-center tracking-wide font-normal">Frequently Asked Questions</h1>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half"><i class="icon ion-android-cart size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">How can I buy your product?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column half"><i class="icon ion-earth size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">Do you ship internationally?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			<div class="row">
				<div class="column half"><i class="icon ion-card size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">What payment methods are accepted?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column half"><i class="icon ion-arrow-swap size-28" style="color: rgb(174, 174, 174);"></i>
					<p class="font-normal size-19">What should I do if my product arrives damaged or is not what I ordered?</p>
					<p style="color: rgb(138, 138, 138); max-width: 600px;">Lorem Ipsum is dummy text of the printing.</p>
				</div>
			</div>
			`	
		},

		/* Contact */
		{
		    'thumbnail': 'preview/contact-01.png',
		    'category': '116',
		    'html': `
			<div class="row relative sm-items-1">
				<div class="py-6 flex flex-col justify-center column half">
					<p class="uppercase size-12 tracking-125 text-left" style="color: rgb(102, 102, 102);">Your Company Name</p>
					<h1 class="leading-none size-42 text-left font-normal">Get In Touch</h1>
					<div class="spacer height-20"></div>

					<p style="color: rgb(109, 109, 109);" class="text-left">12345 Street Name, City. State 12345
						<br>P: (123) 456 7890 / 456 7891.
					</p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
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
		    'thumbnail': 'preview/contact-02.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column third center"><i class="icon ion-ios-book-outline size-50" style="color: rgb(136, 136, 136);"></i>
					<h6 class="font-semibold tracking-wider size-19">OUR LOCATION</h6>
					<p>12 Street Name, City</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-telephone-outline size-50" style="color: rgb(136, 136, 136);"></i>
					<h6 class="font-semibold tracking-wider size-19">CALL US</h6>
					<p>(123) 456 7890 / 456 7891</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-compose-outline size-50" style="color: rgb(136, 136, 136);"></i>
					<h6 class="font-semibold tracking-wider size-19">DROP US A LINE</h6>
					<p><a href="mailto:#" style="color: #333">first.last@example.com</a></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-03.png',
		    'category': '116',
		    'html': `
<div class="row relative sm-items-1">
    <div class="flex flex-col justify-center items-center column half" style="width: 55.3261%; flex: 0 0 auto;">
        <img src="assets/minimalist-blocks/images/ai-PCHEp.jpg" alt="">
    </div>
    <div class="py-6 flex flex-col justify-center column half" style="width: 100%;">
        <p class="uppercase size-12 tracking-125 text-left" style="color: rgb(102, 102, 102);">Your Company Name</p>
        <h1 class="leading-none text-left font-normal size-42">Get In Touch</h1>
        <div class="spacer height-20"></div>

        <p style="color: rgb(109, 109, 109);" class="text-left">12345 Street Name, City. State 12345
            <br>P: (123) 456 7890 / 456 7891.
        </p>
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

        <div class="is-social">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x size-18" style="margin-right: 1em"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook size-18" style="margin-right: 1em;"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope size-18"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-04.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div style="width: 46.8539%; flex: 0 0 auto;" class="column half">
					<p class="uppercase size-12 tracking-125 text-left" style="color: rgb(102, 102, 102);">Get In ToucH</p>
					<h1 class="leading-none text-left size-35 font-normal">Company Name</h1>
					<div class="spacer height-20"></div>

					<p style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<div class="is-social text-left">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
				<div style="width: 100%;" class="column half">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>
			</div>
			<div class="row">
				<div class="column half">
					<div class="text-left">
						<i class="icon ion-ios-alarm-outline size-42"></i>
					</div>
					<h3 class="size-19 font-normal">Opening Time</h3>
					<p style="color: rgb(72, 72, 72);">Monday – Friday: 9 AM – 4.30 PM. Saturday: 8 AM – 2 PM<br></p>
					<div class="spacer height-20"></div>
				</div>
				<div class="column half">
					<div class="text-left">
						<i class="icon ion-ios-home-outline size-42"></i>
					</div>
					<h3 class="size-19 font-normal">Find Us Here</h3>
					<p style="color: rgb(72, 72, 72);">123 Street Name, City. State 12345. Phone: (123) 456 7890<br></p>
					<div class="spacer height-20"></div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-05.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column half">
					<p class="uppercase size-12 tracking-125 text-left" style="color: rgb(102, 102, 102);">Get In ToucH</p>
					<h1 class="leading-none text-left size-35 font-normal">Company Name</h1>
					<div class="spacer height-20"></div>

					<p style="color: rgb(109, 109, 109);">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
					<div class="is-social text-left">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
				<div class="column half flex flex-col justify-center items-start">
					<div class="text-left">
						<i class="icon ion-ios-home-outline size-42"></i>
					</div>
					<h3 class="size-19 font-normal">Find Us Here</h3>
					<p style="color: rgb(72, 72, 72);">123 Street Name, City. State 12345. Phone: (123) 456 7890<br></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-06.png',
		    'category': '116',
		    'html': `
<div class="row">
    <div class="center column full">
        <h1 class="tracking-wider size-28 text-left font-normal">Contact Us</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-20"></div>
    </div>
</div>
<div class="row">
    <div class="column full"><img src="assets/minimalist-blocks/images/ai-9UXxW.jpg" alt=""></div>
</div>
<div class="row">
    <div class="column third center flex justify-center flex-col items-center">
        <h1 class="size-21 font-normal">Company Name</h1>
    </div>
    <div class="column third center flex justify-center flex-col items-center">
        <p style="color: rgb(109, 109, 109);" class="text-left">12345 Street Name, City. State 12345
            <br>P: (123) 456 7890 / 456 7891.
        </p>
    </div>
    <div class="column third center flex justify-center flex-col items-center">
        <div class="is-social" style="margin: 25px 0">
            <a href="https://twitter.com/"><i class="bi bi-twitter-x size-17"></i></a>
            <a href="https://www.facebook.com/"><i class="bi bi-facebook size-17"></i></a>
            <a href="https://www.instagram.com/"><i class="icon bi bi-instagram size-17"></i></a>
            <a href="mailto:you@example.com"><i class="bi bi-envelope size-17"></i></a>
        </div>
    </div>
</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-07.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-wider">CONTACT US</h3>
					<p style="border-bottom: 1px solid #333; width: 50px; display: inline-block; margin-top: 0"></p>
					<p class="size-16">
						<strong>Your Company Name</strong><br>
						12345 Street Name, City.
						State 12345<br>
						P: (123) 456 7890 / 456 7891.
					</p>
				</div>
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-wider">OPENING HOURS</h3>
					<p style="border-bottom: 1px solid #333; width: 50px; display: inline-block; margin-top: 0"></p>
					<p class="size-16">
						Monday - Friday: 9:00 AM - 10:00 PM<br>
						Saturday: 10:00 AM - 11:00 PM
					</p>
				</div>
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-wider">STAY UPDATED</h3>
					<p style="border-bottom: 1px solid #333; width: 50px; display: inline-block; margin-top: 0"></p>
					<p class="size-16">
						Follow us on:<br>
						Facebook: <a href="#">Company Name</a><br>
						Twitter: <a href="#">@companyname</a>
					</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-08.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column half">
					<h1 class="size-42 is-title-bold" style="margin-top:0">Do you have something to say? Contact us!</h1>
				</div>
				<div class="column half">
					<h1 class="size-21 font-semibold">Company Name</h1>
					<p>
						12345 Street Name, City.
						State 12345<br>
						P: (123) 456 7890 / 456 7891. <br>
						Email:<br><a href="#" style="color: #333">companyname@example.com</a>
					</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-09.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column full" style="filter: grayscale(1);">
					<div class="embed-responsive embed-responsive-16by9"><iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="mg1" src="https://maps.google.com/maps?q=Melbourne,+Victoria,+Australia&amp;hl=en&amp;sll=-7.981898,112.626504&amp;sspn=0.009084,0.016512&amp;oq=melbourne&amp;hnear=Melbourne+Victoria,+Australia&amp;t=m&amp;z=10&amp;output=embed"></iframe></div>
				</div>
			</div>
			<div class="row">
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-75">CONTACT</h3>
					<p class="size-16"><span class="font-semibold">Company Name</span><br>123 Street Name, City.</p>
				</div>
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-75">OPENING HOURS</h3>
					<p class="size-16">Monday - Friday: 8 AM - 5 PM<br>Saturday: 10 AM - 3 PM</p>
				</div>
				<div class="column third">
					<h3 class="size-18 is-title-lite font-normal tracking-75">STAY IN TOUCH</h3>
					<p class="size-16">Instagram: <a href="#">@companyname<br>Twitter: </a><a href="#">@companyname</a></p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-10.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 is-title1-48 is-title-bold font-normal tracking-wide">Drop In Our Office</h1>
					<div class="spacer height-20"></div>
					<p><i class="icon ion-android-home size-21"></i>&nbsp; &nbsp;Company Name, Inc. 12345 Street, City. State 12345.<br><i class="icon ion-ios-telephone size-21"></i>&nbsp; &nbsp;Phone: (123) 456 7890 / 456 7891</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-11.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="font-semibold text-center size-42 tracking-wide leading-11">Drop us a line to get the conversation started.</h1>
					<p class="text-center">Please kindly write to us at companyname@example.com&nbsp;or call us on +123 4567 890</p>
					<div class="center">
						<p style="border-bottom: 2px solid #000;width: 70px;display: inline-block;margin-bottom:0"></p>
					</div>
					<div class="spacer height-80"></div>
					<div class="is-social text-center">
						<a href="https://twitter.com/"><i class="bi bi-twitter-x" style="margin-right: 1em"></i></a>
						<a href="https://www.facebook.com/"><i class="bi bi-facebook" style="margin-right: 1em"></i></a>
						<a href="mailto:you@example.com"><i class="bi bi-envelope"></i></a>
					</div>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-12.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column third"><i class="icon ion-map size-48" style="color: #e74c3c"></i>
					<p class="size-14" style="color: rgb(136, 136, 136);">OUR LOCATION</p>
					<p>
						Your Company Name<br>
						12345 Street Name, City.
						P: (123) 456 7890
					</p>
				</div>
				<div class="column third"><i class="icon ion-clock size-48" style="color: #e74c3c"></i>
					<p class="size-14" style="color: rgb(136, 136, 136);">OPENING HOURS</p>
					<p>
						Monday - Friday: 9:00 AM - 10:00 PM<br>
						Sat: 10:00 AM - 11:00 PM
					</p>
				</div>
				<div class="column third"><i class="icon ion-chatbox-working size-48" style="color: #e74c3c"></i>
					<p class="size-14" style="color: rgb(136, 136, 136);">STAY UPDATED</p>
					<p>
						Follow us on:<br>
						Facebook: <a href="#" style="color: #333">Company Name</a><br>
						Twitter: <a href="#" style="color: #333">@companyname</a>
					</p>
				</div>
			</div>
			`	
		},
		{
		    'thumbnail': 'preview/contact-13.png',
		    'category': '116',
		    'html': `
			<div class="row">
				<div class="column full" style="width: 100%; flex: 0 0 auto;">
					<h1 class="size-28 font-normal text-center">Have questions? Give us a call <span style="color: rgb(230, 126, 34);">0 123 456 78 90</span></h1>
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
		
		/*  About */
		{
		    'thumbnail': 'preview/about-01.png',
		    'category': '103',
		    'html': `
			<div class="row">
                    <div class="column full">
						<h1 class="text-right tracking-wide size-68 font-normal">About.</h1>
                    </div>

                </div>
                <div class="row">
                    <div class="column full">
                        <div class="spacer height-80"></div>
                    </div>

                </div>
                <div class="row">
                    <div class="column third"><img src="assets/minimalist-blocks/images/sitepro.png" alt="" style="margin: 0;"></div>
                    <div class="column two-third">
                        <p style="margin-top: 0px;" class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>

                </div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-02.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="size-96"><span class="font-semibold size-96">About</span> us</h1>
        <h3 class="size-21 tracking-wide">Founded in 2019</h3>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-60"></div>
    </div>
</div>
<div class="row">
    <div class="column third">
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.</p>
    </div>
    <div class="column two-third"><img src="assets/minimalist-blocks/images/ai-ClsMt.jpg" alt="" data-filename="ai-t0Qu9-editcJfc1a3.png"></div>
</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-03.png',
		    'category': '103',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-42 font-semibold tracking-wide">Hello, we are [Company Name]. We are a team of passionate design-thinkers &amp; product strategist.</h1>
					<p style="color: rgb(138, 138, 138); font-family: serif; font-style: italic;" class="size-18">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p>
				</div>
				<div class="column half">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p>
				</div>

			</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-04.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full"><img src="assets/minimalist-blocks/images/ai-lClur.jpg" alt=""></div>
</div>
<div class="row">
    <div class="column full pt-2">
        <h1 class="tracking-wide">Our Story</h1>
        <p style="border-bottom: 2px solid #f49400;width: 70px;display: inline-block;margin-top: 0;"></p>
    </div>
</div>
<div class="row">
    <div class="column two-third">
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
    </div>
    <div class="column third">
        <p class="size-14" style="color: rgb(138, 138, 138);">1st floor, Building Name. <br>Street Name, City. State 456.<br>Phone: (123) 456 7890</p>
    </div>
</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-05.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="size-35 font-semibold text-center lowercase tracking-wide">Who We Are</h1>
        <p class="size-16 text-center" style="color: rgb(102, 102, 102);">read the story about us and discover what we do.</p>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-40"></div>
    </div>
</div>
<div class="row">
    <div class="column half" style="width: 59.5652%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-nNGF3.jpg" alt="" data-filename="ai-P2bmb-editaumdzm5.png"></div>
    <div class="column half flex flex-col justify-center items-start" style="width: 100%;">
        <h3 class="size-21 text-right lowercase tracking-wide">We're a team of passionate <span style="color: rgb(158, 158, 158);">design-thinkers</span></h3>
        <div class="spacer height-20"></div>
        <p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.</p>
        <p class="text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.</p>
    </div>
</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-06.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column third">
        <h1 class="size-28" style="margin-top: 15px;"><span class="font-semibold">Who</span> We Are</h1>
        <p style="border-bottom: 2px solid #000;width: 30px;display: inline-block;margin-top: 0;"></p>
    </div>
    <div class="column two-third pb-5">
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p>
    </div>
</div>
<div class="row">
    <div class="column full"><img src="assets/minimalist-blocks/images/ai-9F5nG.jpg" alt=""></div>
</div>
			`	
		},
		

		{
		    'thumbnail': 'preview/about-08.png',
		    'category': '103',
		    'html': `
			<div class="row">
				<div class="column full">
					<p style="color: rgb(102, 102, 102);" class="tracking-widest">ABOUT US</p>
					<h1 class="size-42 leading-11 font-semibold tracking-wide">We are CreativeStudio. We love to create and develop beautiful things.</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<p class="size-16" style="color: rgb(102, 102, 102); font-family: serif; font-style: italic;">1st floor, Building Name.<br>Street Name, City. State 456.<br>(123) 456 7890</p>
				</div>
				<div class="column two-third">
					<p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>

			</div>
			`	
		},
        
		{
		    'thumbnail': 'preview/about-07.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div style="padding-right: 30px;" class="column third">
        <p style="margin-bottom: 0px;" class="size-16 tracking-widest">ABOUT US</p>
        <p style="border-bottom: 1px solid #000;width: 90px;display: inline-block;margin-top: 0;"></p>
        <h1 class="size-28">We believe in simplicity</h1>
        <p style="color: rgb(102, 102, 102);" class="size-16 text-justify">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p>
    </div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-pu0f6.jpg" alt="" data-filename="ai-3NxD7-editeBaewl7.png"></div>
    <div class="column third"><img src="assets/minimalist-blocks/images/ai-P7nRp.jpg" alt="" data-filename="ai-yQngq-editzw6x76j.png"></div>
</div>
			`	
		},
		
		
		{
		    'thumbnail': 'preview/about-09.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="size-42 font-semibold tracking-wide" style="width: 100%; max-width: 220px;">About Us.</h1>
    </div>
</div>
<div class="row">
    <div class="column full">
        <div class="spacer height-60"></div>
    </div>
</div>
<div class="row">
    <div class="column half" style="width: 100%;">
        <p class="font-semibold text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div class="spacer height-20"></div>
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>
    </div>
    <div class="column half" style="width: 58.4783%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-t8SCz.jpg" alt="" data-filename="tDcXFaIVf5LDwABsv33LL-editVejtahq.png"></div>
</div>
			`	
		},
		
		{
		    'thumbnail': 'preview/about-10.png',
		    'category': '103',
		    'html': `
<div class="row">
    <div class="column full">
        <h1 class="size-42 font-semibold tracking-wide">Hello, we are [Company Name]. We are a team of passionate design-thinkers &amp; product strategist.</h1>
    </div>
</div>
<div class="row">
    <div class="column">
        <div class="spacer height-40"></div>
    </div>
</div>

<div class="row">
    <div class="column half" style="width: 60.4348%; flex: 0 0 auto;"><img src="assets/minimalist-blocks/images/ai-xUZGO.jpg" alt="" data-filename="ai-BNvw3-editYcTcTj4.png"></div>
    <div class="column half" style="width: 100%;">
        <p class="text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.</p>
    </div>
</div>
			`	
		},
		
		/*  Services */
		{
		    'thumbnail': 'preview/services-01.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column full center">
					<h1 class="is-title1-48 is-title-lite font-normal size-28">Our Services</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full code">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-ios-monitor-outline size-42"></i>
					<h4 class="size-18 font-normal">UI/UX</h4>
				</div>
				<div class="column third center"><i class="icon ion-ios-lightbulb-outline size-42"></i>
					<h4 class="size-18 font-normal">Full Stack Development</h4>
				</div>
				<div class="column third center"><i class="icon ion-ios-world-outline size-42"></i>
					<h4 class="size-18 font-normal">Video Explainer</h4>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-ios-infinite-outline size-42"></i>
					<h4 class="size-18 font-normal">Illustration</h4>
				</div>
				<div class="column third center"><i class="icon ion-ios-heart-outline size-42"></i>
					<h4 class="size-18 font-normal">Branding</h4>
				</div>
				<div class="column third center"><i class="icon ion-ios-gear-outline size-42"></i>
					<h4 class="size-18 font-normal">Marketing</h4>
				</div>

			</div>
			`	
		},

		{
		    'thumbnail': 'preview/services-02.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center font-medium tracking-wider size-32">Our Services</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-ios-monitor-outline size-42"></i>
					<h4 class="tracking-wide font-medium size-19">Service One</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-gear-outline size-42"></i>
					<h4 class="tracking-wide size-19 font-medium">Service Two</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-heart-outline size-42"></i>
					<h4 class="tracking-wide size-19 font-medium">Service Three</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third center"><i class="icon ion-ios-compose-outline size-42"></i>
					<h4 class="tracking-wide size-19 font-medium">Service Four</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-world-outline size-42"></i>
					<h4 class="tracking-wide size-19 font-medium">Service Five</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>
				<div class="column third center"><i class="icon ion-ios-calendar-outline size-42"></i>
					<h4 class="tracking-wide size-19 font-medium">Service Six</h4>
					<p>Lorem Ipsum is dummy text of the printing industry.</p>
				</div>

			</div>
			`	
		},

		{
		    'thumbnail': 'preview/services-03.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="text-center size-28 font-medium tracking-wider">Our Services</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-80"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third" style="width: 100%;"><i class="icon ion-ios-compose-outline size-28"></i>
					<h3 class="font-medium size-19">Web Development</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third" style="width: 100%;"><i class="icon ion-iphone size-28"></i>
					<h3 class="font-medium size-19">Mobile Development</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>
				<div class="column third" style="width: 33.3103%; flex: 0 0 auto;"><i class="icon ion-ios-world-outline size-28"></i>
					<h3 class="font-medium size-19">Branding &amp; Marketing</h3>
					<p>Lorem Ipsum is simply dummy text of the printing industry.</p>
				</div>

			</div>
			`	
		},

		{
		    'thumbnail': 'preview/services-04.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column full">
					<h2 class="tracking-tight size-42 font-normal">Services We Provide</h2>
				</div>
			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-40"></div>
				</div>
			</div>
			<div class="row">
				<div class="column third flex flex-col justify-center items-start">
					<h3 class="size-48 font-normal">01.</h3>
					<div class="spacer height-20"></div>
					<h4 class="size-21">Web Development</h4>
				
					<div class="spacer height-20"></div>
				
					<p class="leading-13">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it.</p>
				</div>
				<div class="column third">
					<h3 class="size-48 font-normal">02.</h3>
					<div class="spacer height-20"></div>
					<h4 class="size-21">Brand &amp; Identity</h4>
				
					<div class="spacer height-20"></div>
				
					<p class="leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
				</div>
				<div class="column third">
					<div class="spacer height-100"></div>
					<h3 class="size-48 font-normal">03.</h3>
					<div class="spacer height-20"></div>
					<h4 class="size-21">Content Marketing</h4>
				
					<div class="spacer height-20"></div>
				
					<p class="leading-13">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
				</div>
			</div>
			`	
		},

		{
		    'thumbnail': 'preview/services-05.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column half" style="width: 100%;">
					<h1 class="size-42 font-normal">We Create — Brands</h1>
				</div>
				<div class="column half" style="width: 30.9881%; flex: 0 0 auto;">
					<p>Corporate Identity Design<br>
						Visual Communication<br>
						Logo Design<br>
						Print Design<br>
						Brand Guidelines<br>
						Rebranding</p>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column half" style="width: 100%;">
					<h1 class="size-42 font-normal">We Build — Websites</h1>
				</div>
				<div class="column half" style="width: 30.9881%; flex: 0 0 auto;">
					<p>Web Design<br>
						User Interface Design<br>
						User Experience Design<br>
						Front-end Development<br>
						SEO Optimization</p>
				</div>

			</div>
			`	
		},

		{
		    'thumbnail': 'preview/services-06.png',
		    'category': '104',
		    'html': `
			<div class="row">
				<div class="column full">
					<h1 class="size-32 text-center font-normal">Services We Provide</h1>
				</div>

			</div>
			<div class="row">
				<div class="column full">
					<div class="spacer height-60"></div>
				</div>

			</div>
			<div class="row">
				<div class="column third">
					<p class="is-title1-64 is-title-bold size-48">01.</p>
					<h4 class="leading-normal font-medium size-19">UI/UX</h4>
					<p style="border-bottom: 2px solid #333; width: 40px;"></p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<p class="is-title1-64 is-title-bold size-42">02.</p>
					<h4 class="leading-normal font-medium size-19">Full Stack</h4>
					<p style="border-bottom: 2px solid #333; width: 40px;"></p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
				<div class="column third">
					<p class="is-title1-64 is-title-bold size-42">03.</p>
					<h4 class="leading-normal font-medium size-19">Branding</h4>
					<p style="border-bottom: 2px solid #333; width: 40px;"></p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</div>
			</div>
			`	
		},

		/*
        // Custom Module example (with just simple initial content) => Experimental
        {
        'thumbnail': 'preview/basic-code.png',
        'category': '120',
        'html':
			    '<div class="row">' +
                    '<div class="column full" data-noedit data-module="my-custom-module" data-module-desc="My Module" data-html="' + // module file will be: assets/modules/my-custom-module.html
                        // Default HTML
                        encodeURIComponent('<h2>My Custom Module</h2>') +
                        '" data-settings="">' +
		            '</div>' +
			    '</div>'
        },

        // Custom Module example with initial content (see default HTML) and custom variables (see default settings) => Experimental
        // Example of custom script is also embedded in the HTML.
        {
		'thumbnail': 'preview/element-module.png',
		'category': '120',
		'html':
			    '<div class="row">' +
                    '<div class="column full" data-noedit data-module="my-custom-module" data-module-desc="My Module" data-html="' + // module file will be: assets/modules/my-custom-module.html
                        // Default HTML
                        encodeURIComponent('<h2>My Custom Module - Id: <span id="{id}">{id}</span></h2>' +
                        '<div class="is-subblock" data-subblock style="border:#efefef 1px solid;padding: 10px 30px;margin: 15px 0;background: #fff;">' + // a Sub Block is an editable area
                            '<p>' +
                                'This is an editable area inside a custom module.' +
                            '</p>' +
                        '</div>' +
                        '<scr' + 'ipt>' +
                            'document.querySelector("#{id}").style.color = "red";' +
                        '</scr' + 'ipt>' +
                        '') +

                        '" data-settings="' +
                        // Default Settings (Custom Variables)
                        encodeURIComponent('{"variable1": true, "variable2": "Hello World"}') + '"' +

                    '>' +

		            '</div>' +
			    '</div>'
        },

		// Quiz Builder module example
		{
			'thumbnail': 'preview/element-module.png',
			'category': '120',
			'html':
				`<div class="row">
					<div class="column full" data-noedit data-module="quiz-builder" data-module-desc="Quiz Builder" data-html="${encodeURIComponent(`

							<h3>Your question here</h3>
							<div class="flex flex-col mt-4 mb-4">
								<label><input type="radio" name="answer{id}" value="One">One</label>
								<label><input type="radio" name="answer{id}" value="Two">Two</label>
								<label><input type="radio" name="answer{id}" value="Three">Three</label>
								<label><input type="radio" name="answe{id}" value="Four">Four</label>
							</div>
							<button id="{id}" class="transition-all inline-block whitespace-nowrap cursor-pointer no-underline border-2 border-solid mr-2 mt-2 mb-1 py-2 size-17 border-current hover:border-current font-normal leading-14 rounded-full tracking-wide px-10" style="background-color: rgb(255, 255, 255);">Submit</button>

							<p id="result{id}"></p>

							<scr`+`ipt>
							(function() {
								let docReady = function(fn) {
									let stateCheck = setInterval(function() {
										if (document.readyState !== "complete") return;
										clearInterval(stateCheck);
										try {
											fn()
										} catch (e) {}
									}, 1);
								};
								docReady(function() {
									let btnSubmit = document.querySelector("#{id}");
									btnSubmit.addEventListener('click', ()=>{
										getSelectedChoice();
									});
								});
								function getSelectedChoice() {
									const radioButtons = document.getElementsByName("answer{id}");
									let selectedChoice = "";
									for (let i = 0; i < radioButtons.length; i++) {
										if (radioButtons[i].checked) {
										selectedChoice = radioButtons[i].value;
										break; // Exit the loop once a checked radio button is found
										}
									}
									if (selectedChoice !== "") {
										const divResult = document.querySelector("#result{id}");
										if(selectedChoice === 'Three') {
											divResult.innerHTML = 'Your answer: '+selectedChoice+'. <b>That is correct!</b>'
										} else {
											divResult.innerHTML = 'Your answer: '+selectedChoice+'. That is incorrect!'
										}
									} else {
										alert("No choice selected");
									}
								}
							})();
							</scr`+`ipt>

						`)}" 
						
						data-settings="${encodeURIComponent(`
							
							{
								"question": "Your question here",
								"choices": "One, Two, Three, Four",
								"answer": "Three"
							}

						`)}">
					</div>
				</div>`
		}, 
		*/

		{
			'thumbnail': 'preview/basic-codeview.png',
			'category': '120',
			'html':
				`<div class="row">
					<div class="column full" data-noedit data-module="codeview" data-module-desc="Code" data-dialog-height="570px" data-html="${encodeURIComponent(`

						<div class="hide-on-print" style="display: flex;justify-content: flex-end;margin-bottom:5px"><button id="_copycode{id}" style="font-family:system-ui;font-size:13px;font-weight:300;padding:0;border:none;background:transparent;display:flex;cursor:pointer;">
							<svg width="16" height="16" style="margin-right:3px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path>
							</svg>
							Copy Code</button><!-- Tooltip element below the button -->
                            <div id="tooltip{id}" style="display: none; margin-top: 25px; background-color: #333; color: #fff; padding: 5px 10px; border-radius: 4px; position: absolute; z-index: 1; font-size: 12px;">Copied.</div>
						</div>
						<pre id="{id}" class="language-markup" style="font-size:14px;background-color: #f4f4f4;padding: 12px 16px;text-wrap: wrap;">&lt;h1>Hello World&lt;/h1></pre>
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
								"code": "<h1>Hello World<h1>",
								"theme": "none"
							}

						`)}">
					</div>
				</div>`
		}, 

        /*
        {
		'thumbnail': 'preview/element-module.png',
		'category': '120',
		'html':
			    `<div class="row">
                    <div class="column" data-module="my-module" data-dialog-width="500px" data-module-desc="My Module" data-html="${encodeURIComponent(`

                        <div><b>Dynamic Content From Fetch</b></div>

                        <h3 id="post_title_{id}"></h3>
                        <div id="post_body_{id}"></div>

                        <script>
                            var docReady = function(fn) {
                                var stateCheck = setInterval(function () {
                                    if (document.readyState !== "complete") return;
                                    clearInterval(stateCheck);
                                    fn()
                                }, 1);
                            };
                            docReady(async function() {
                                const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
                                const data = await response.json();
                                document.getElementById("post_title_{id}").innerHTML = data.title;
                                document.getElementById("post_body_{id}").innerHTML= data.body;
                            });
                        </script>
                        `)}" data-settings="${encodeURIComponent(`
                            {
                            "description": "Dynamic Content From Fetch", 
                            "requestUrl": "https://jsonplaceholder.typicode.com/posts/1"
                            }
                        `)}"
                        >

		            </div>
			    </div>`
        }
        */
	]

};