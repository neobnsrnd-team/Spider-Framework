var EditPanel = (function () {
    'use strict';

    class EditPanel {
      constructor(opts = {}) {
        let defaults = {
          src: '',
          page: '',
          container: '.container',
          onReady: () => {}
        };
        this.opts = Object.assign(this, defaults, opts);
        let editPanel = document.querySelector('#editPanel');

        if (!editPanel) {
          const html = `
                <style>
                  #editPanel {
                      display:flex;
                      flex-direction:column;
                      justify-content:center;
                      align-items:center;
                      width: 100vw;
                      height:100vh;
                      position:fixed;
                      top:0;
                      left:0;
                      background:#f5f5f5;
                  }

                  .is-responsive-tool {
                      background-color: rgb(255 255 255 / 1);
                      position:fixed;
                      /*
                      bottom:20px;
                      left:70px;
                      */
                      top: 30px;
                      right: 50px;
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      padding:3px;
                      border-radius:4px;
                      width: 248px;
                  }
                  .is-responsive-tool button {
                      display:flex;
                      align-items: center;
                      justify-content: center;
                      border-radius: 0.375rem;
                      border-width: 1px;
                      border-color: transparent;
                      width: 58px;
                      height: 42px;
                      background: transparent;
                      cursor: pointer;
                  }
                  .is-responsive-tool button:focus{
                      outline: #3e93f7 2px solid;
                      outline-offset: 2px;
                  }
                  .is-responsive-tool button svg {
                      width: 24px;
                      height: 24px;
                      fill: transparent;
                  }
                  .is-responsive-tool button.active {
                      background: #0674f5;
                  }
                  .is-responsive-tool button.active svg {
                      stroke: #fff;
                  }

                  .is-content-view {
                      /*
                      width: 1680px;
                      height: calc(100vh - 190px);
                      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                      border-radius: 1rem;
                      */
                      transition: all 300ms ease 0s;
                      overflow: hidden;
                      margin-top: 1.5rem;
                      background: #f5f5f5;
                      position: relative;
                  }
                  .is-content-view > div {
                      background-color: rgb(230 231 233);
                      border-top-left-radius: 8px;
                      border-top-right-radius: 8px;
                      height: 1.75rem;
                  }
                  .is-content-view iframe {
                      width: 100%;
                      height: calc(100% - 28px);
                      position: absolute;
                      border:none;
                  }
                </style>

                <div id="editPanel">

                    <div class="is-content-view desktop">
                        <div></div>
                        <iframe id="ifrBuilder" src="about:blank"></iframe>
                    </div>

                </div>

                <div class="is-responsive-tool">
                    
                    <button title="Desktop" class="active" data-command="desktop">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-desktop" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <rect x="3" y="4" width="18" height="12" rx="1"></rect>
                            <line x1="7" y1="20" x2="17" y2="20"></line>
                            <line x1="9" y1="16" x2="9" y2="20"></line>
                            <line x1="15" y1="16" x2="15" y2="20"></line>
                        </svg>
                    </button>

                    <button title="tablet" data-command="tablet-landscape">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-tablet-landscape" style="transform:rotate(-90deg)" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <rect x="5" y="3" width="14" height="18" rx="1"></rect>
                            <circle cx="12" cy="17" r="1"></circle>
                        </svg>
                    </button>

                    <button title="tablet" data-command="tablet">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-tablet" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <rect x="5" y="3" width="14" height="18" rx="1"></rect>
                            <circle cx="12" cy="17" r="1"></circle>
                        </svg>
                    </button>

                    <button title="mobile" data-command="mobile">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-mobile" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <rect x="6" y="3" width="12" height="18" rx="2"></rect>
                            <line x1="11" y1="4" x2="13" y2="4"></line>
                            <line x1="12" y1="17" x2="12" y2="17.01"></line>
                        </svg>
                    </button>

                </div>
                
                `;
          document.body.insertAdjacentHTML('beforeend', html);
          editPanel = document.querySelector('#editPanel');
          this.editPanel = editPanel;
          this.loadIframe();
          const tool = document.querySelector('.is-responsive-tool');
          const btns = tool.querySelectorAll('button');
          btns.forEach(btn => {
            btn.addEventListener('click', e => {
              const command = e.target.getAttribute('data-command');
              const contentView = editPanel.querySelector('.is-content-view');
              let elm = tool.querySelector('button.active');
              if (elm) elm.classList.remove('active');

              contentView.classList.remove('desktop');
              contentView.classList.remove('tablet-landscape');
              contentView.classList.remove('tablet');
              contentView.classList.remove('mobile');
              
              if(command==='desktop') {
                  contentView.classList.add('desktop');
              } else if(command==='tablet-landscape') {
                  contentView.classList.add('tablet-landscape');
              } else if(command==='tablet') {
                  contentView.classList.add('tablet');
              } else if(command==='mobile') {
                  contentView.classList.add('mobile');
              } 

              e.target.classList.add('active');
            });
          });
        }
      }

      loadIframe() {
        const iframeHtml = `
        <!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="utf-8">
            <title></title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="shortcut icon" href="#" /> 

            <link href="assets/minimalist-blocks/content.css" rel="stylesheet" type="text/css" />
        
            <link href="assets/scripts/glide/css/glide.core.css" rel="stylesheet" type="text/css" />
            <link href="assets/scripts/glide/css/glide.theme.css" rel="stylesheet" type="text/css" />
            <script src="assets/scripts/glide/glide.js" type="text/javascript"></script>
        
            <style>
                .container {  margin: 150px auto; max-width: 800px; width:100%; padding:0 35px; box-sizing: border-box;}
            </style>
        </head>
        <body>
        
        <div class="container" style="opacity:0">
        </div>
        
        </body>
        </html>
        `;
        let iframe = this.editPanel.querySelector('iframe');

        if (this.src !== '') {
          iframe.setAttribute('src', this.src);
        } else {
          let doc = iframe.contentWindow.document;
          doc.open();
          doc.write(iframeHtml);
          doc.close();
        }

        document.body.style.overflowY = 'hidden';
        let checkLoad = setInterval(() => {
          if (iframe.contentDocument.readyState === 'complete') {
            // Check if editable container is ready
            if (this.opts.page !== '') {
              let wrapper = iframe.contentDocument.querySelector(this.opts.page);

              if (wrapper) {
                clearInterval(checkLoad);
                this.onReady(iframe);
              }
            } else {
              let container = iframe.contentDocument.querySelector(this.opts.container);

              if (container) {
                clearInterval(checkLoad);
                this.onReady(iframe);
              }
            }
          }
        }, 200);
      }

    }

    return EditPanel;

})();
