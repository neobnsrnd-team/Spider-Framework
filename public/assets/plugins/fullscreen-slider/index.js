/*
Usage (in ContentBox):

<div class="is-section is-box is-light-text is-section-100 type-poppins">

    <div class="is-overlay">
        <div class="is-overlay-content" style="z-index: 1;">

            <div data-cb-type="fullscreen-slider" style="--transition-speed: 2200ms; --zoom-scale: 1.06; --overlay-opacity: 0.25;" data-cb-autoplay-duration="5000" data-cb-transition-speed="2200" data-cb-enable-keyboard="true" data-cb-pause-on-hover="false" data-cb-show-counter="true" data-cb-show-nav-buttons="true" data-cb-show-pagination="true" data-cb-show-keyboard-hint="true" data-cb-zoom-effect="true" data-cb-zoom-scale="106" data-cb-overlay-opacity="25">
                <div class="media-overlay"></div>
                <div class="media-slide" data-slide-id="slide-1760990477250-1">
                    <div class="media-slide-inner">
                        <img src="assets/templates-quick/images/ai-RVMvr.jpg" alt="Mountain view">
                    </div>
                </div>
                <div class="media-slide" data-slide-id="slide-1760990477251-3">
                    <div class="media-slide-inner">
                        <img src="assets/templates-quick/images/ai-Dv3Cv.jpg" alt="Technology">
                    </div>
                </div>
                <div class="media-slide" data-slide-id="slide-1760990477251-4">
                    <div class="media-slide-inner">
                        <img src="assets/templates-quick/images/ai-2ANoV.jpg" alt="People working">
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="is-container v2 leading-13 size-17 is-content-720">
        <div class="row">
            <div class="column full">
                <p class="size-14 tracking-75">Branding &amp; Digital Marketing</p>
            </div>
        </div>
        <div class="row">
            <div class="column full">
                <h1 class="leading-none text-left font-semibold size-54">We've put together a special combination of design, strategy, and digital expertise.</h1>
            </div>
        </div>
        <div class="row">
            <div class="column full">
                <div class="spacer height-20"></div>
            </div>
        </div>
        <div class="row">
            <div class="column" style="width: 70%; flex: 0 0 auto;">
                <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type.</p>
            </div>
            <div class="column">
                <div class="spacer height-80"></div>
            </div>
        </div>
        <div class="row">
            <div class="column full">
                <p><a href="#" title="" class="no-underline font-semibold">Start a Project</a>&nbsp;<i class="icon ion-android-arrow-forward"></i></p>
            </div>
        </div>
    </div>
</div>
*/

export default {
    name: 'fullscreen-slider',
    displayName: 'Media Slider',
    version: '1.1.0',

    contentbox: {
        bg: false,
        text: false,
        title: false
    },
    
    settings: {
        _groups: [
            {
                id: 'general',
                label: 'General Settings',
                fields: ['textPosition', 'autoplayDuration', 'transitionSpeed', 'enableKeyboard', 'pauseOnHover']
            },
            {
                id: 'controls',
                label: 'Controls',
                fields: ['showCounter', 'showNavButtons', 'showPagination', 'showKeyboardHint']
            },
            {
                id: 'animation',
                label: 'Animation',
                fields: ['zoomEffect', 'zoomScale', 'overlayOpacity']
            }
        ],
        textPosition: {
            type: 'select',
            label: 'Text Position',
            default: 'position-center',
            options: [
                { value: 'position-top-left', label: 'Top Left' },
                { value: 'position-top-center', label: 'Top Center' },
                { value: 'position-top-right', label: 'Top Right' },
                { value: 'position-center-left', label: 'Center Left' },
                { value: 'position-center', label: 'Center' },
                { value: 'position-center-right', label: 'Center Right' },
                { value: 'position-bottom-left', label: 'Bottom Left' },
                { value: 'position-bottom-center', label: 'Bottom Center' },
                { value: 'position-bottom-right', label: 'Bottom Right' },
            ],
            group: 'general'
        },
        autoplayDuration: {
            type: 'number',
            label: 'Autoplay Duration',
            default: 6000,
            min: 2000,
            max: 15000,
            step: 500,
            unit: 'ms',
            group: 'general'
        },
        transitionSpeed: {
            type: 'number',
            label: 'Transition Speed',
            default: 1200,
            min: 300,
            max: 3000,
            step: 100,
            unit: 'ms',
            group: 'general'
        },
        enableKeyboard: {
            type: 'boolean',
            label: 'Enable Keyboard Navigation',
            default: true,
            group: 'general'
        },
        pauseOnHover: {
            type: 'boolean',
            label: 'Pause on Hover',
            default: true,
            group: 'general'
        },
        showCounter: {
            type: 'boolean',
            label: 'Show Slide Counter',
            default: true,
            group: 'controls'
        },
        showNavButtons: {
            type: 'boolean',
            label: 'Show Navigation Buttons',
            default: true,
            group: 'controls'
        },
        showPagination: {
            type: 'boolean',
            label: 'Show Pagination Dots',
            default: true,
            group: 'controls'
        },
        showKeyboardHint: {
            type: 'boolean',
            label: 'Show Keyboard Hint',
            default: true,
            group: 'controls'
        },
        zoomEffect: {
            type: 'boolean',
            label: 'Enable Zoom Effect',
            default: true,
            group: 'animation'
        },
        zoomScale: {
            type: 'range',
            label: 'Zoom Scale',
            default: 108,
            min: 100,
            max: 120,
            step: 1,
            unit: '%',
            group: 'animation'
        },
        overlayOpacity: {
            type: 'range',
            label: 'Overlay Opacity',
            default: 30,
            min: 0,
            max: 70,
            step: 5,
            unit: '%',
            group: 'animation'
        }
    },
    
    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');
            container.style.marginBottom = '22px';
            const slides = element.querySelectorAll('.media-slide');
            
            const loadSortable = (() => {
                let sortablePromise = null;

                return () => {
                    if (window.Sortable) return Promise.resolve(window.Sortable);
                    if (sortablePromise) return sortablePromise; // already loading

                    sortablePromise = new Promise((resolve, reject) => {
                        // Check if a <script> already exists (maybe partially loaded)
                        const existing = document.querySelector('script[data-sortable-loader]');
                        if (existing) {
                            existing.addEventListener('load', () => resolve(window.Sortable));
                            existing.addEventListener('error', () => reject(new Error('SortableJS failed')));
                            return;
                        }

                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
                        script.dataset.sortableLoader = 'true';
                        script.onload = () => {
                            resolve(window.Sortable);
                        };
                        script.onerror = () => {
                            // console.warn('SortableJS failed to load, retrying in 1s...');
                            sortablePromise = null; // clear cache to allow retry
                            setTimeout(() => loadSortable(), 1000); // retry once after delay
                            reject(new Error('Failed to load SortableJS'));
                        };
                        document.head.appendChild(script);
                    });

                    return sortablePromise;
                };
            })();
            
            const createSlideEditor = (slide, index) => {
                const section = document.createElement('div');
                section.className = 'item-editor';
                section.dataset.slideId = slide.dataset.slideId || `slide-${Date.now()}-${index}`;
                slide.dataset.slideId = section.dataset.slideId;
                
                const mediaInner = slide.querySelector('.media-slide-inner');
                const img = mediaInner.querySelector('img');
                const video = mediaInner.querySelector('video');
                const isVideo = !!video;
                
                // Item header
                const header = document.createElement('div');
                header.className = 'item-header';
                
                const thumb = document.createElement('img');
                thumb.src = isVideo ? 'https://placehold.co/40x40?text=Video' : (img?.src || 'https://placehold.co/40x40?text=No+Img');
                thumb.className = 'item-thumb';

                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.className = 'drag-handle';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;
                
                const headerTitle = document.createElement('span');
                headerTitle.textContent = `Slide ${index + 1} (${isVideo ? 'Video' : 'Image'})`;
                
                const left = document.createElement('div');
                left.style.display = 'flex';
                left.style.alignItems = 'center';
                left.appendChild(dragHandle);
                left.appendChild(thumb);
                left.appendChild(headerTitle);
                
                const toggle = document.createElement('span');
                toggle.innerHTML = '<svg style="width: 20px; height: 20px; transform: rotate(360deg); transition: all 0.2s ease"><use xlink:href="#icon-chevron-down"></use></svg>';
                
                header.appendChild(left);
                header.appendChild(toggle);
                
                // Body
                const body = document.createElement('div');
                body.className = 'item-body';
                
                // Media Type Selection
                const typeLabel = document.createElement('label');
                typeLabel.textContent = 'Media Type';
                typeLabel.style.cssText = 'display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;';
                
                const typeSelect = document.createElement('select');
                typeSelect.style.cssText = 'width: 100%; margin-bottom: 12px;';
                typeSelect.innerHTML = `
                    <option value="image" ${!isVideo ? 'selected' : ''}>Image</option>
                    <option value="video" ${isVideo ? 'selected' : ''}>Video</option>
                `;
                
                // Media Preview
                const preview = document.createElement('div');
                preview.style.cssText = 'margin-bottom: 12px; position: relative;';
                
                const previewImg = document.createElement('img');
                previewImg.src = isVideo ? 'https://placehold.co/200x120?text=Video' : (img?.src || 'https://placehold.co/200x120?text=No+Img');
                previewImg.style.cssText = 'width: 100%; height: 120px; object-fit: cover; border-radius: 6px; display: block;';
                preview.appendChild(previewImg);
                
                // Get existing video sources from data attributes
                const getVideoSources = () => {
                    if (!video) return { large: '', desktop: '', tablet: '', mobile: '' };
                    
                    return {
                        large: video.dataset.srcLarge || '',
                        desktop: video.dataset.srcDesktop || video.querySelector('source')?.src || '',
                        tablet: video.dataset.srcTablet || '',
                        mobile: video.dataset.srcMobile || ''
                    };
                };
                
                const videoSources = getVideoSources();
                
                // Media URL Input (for images or desktop video)
                const urlInput = document.createElement('input');
                urlInput.type = 'text';
                urlInput.placeholder = isVideo ? 'Video URL (Desktop)' : 'Image URL';
                urlInput.value = isVideo ? videoSources.desktop : (img?.getAttribute('src') || '');
                urlInput.style.cssText = 'flex: 1; margin-bottom: 8px;';
                
                const urlGroup = document.createElement('div');
                urlGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';
                
                const browseBtn = document.createElement('button');
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                browseBtn.style.cssText = 'width: 45px;';
                
                urlGroup.appendChild(urlInput);
                urlGroup.appendChild(browseBtn);
                
                // Responsive video sources container
                const responsiveVideoContainer = document.createElement('div');
                responsiveVideoContainer.style.cssText = 'margin-bottom: 12px; display: ' + (isVideo ? 'block' : 'none') + ';';
                
                // Large screen (4K) video input
                const largeLabel = document.createElement('label');
                largeLabel.textContent = 'Video URL (4K/Large - above 1920px)';
                largeLabel.style.cssText = 'display: block; font-size: 12px; color: #666; margin-bottom: 4px;';
                
                const largeInput = document.createElement('input');
                largeInput.type = 'text';
                largeInput.placeholder = 'Optional: 4K video URL for large displays';
                largeInput.value = videoSources.large;
                largeInput.style.cssText = 'flex: 1; margin-bottom: 8px; font-size: 13px;';
                
                const largeGroup = document.createElement('div');
                largeGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 12px;';
                
                const largeBrowseBtn = document.createElement('button');
                largeBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                largeBrowseBtn.style.cssText = 'width: 45px;';
                
                largeGroup.appendChild(largeInput);
                largeGroup.appendChild(largeBrowseBtn);
                
                // Tablet video input
                const tabletLabel = document.createElement('label');
                tabletLabel.textContent = 'Video URL (Tablet - max 1280px)';
                tabletLabel.style.cssText = 'display: block; font-size: 12px; color: #666; margin-bottom: 4px;';
                
                const tabletInput = document.createElement('input');
                tabletInput.type = 'text';
                tabletInput.placeholder = 'Optional: Tablet video URL';
                tabletInput.value = videoSources.tablet;
                tabletInput.style.cssText = 'flex: 1; margin-bottom: 8px; font-size: 13px;';
                
                const tabletGroup = document.createElement('div');
                tabletGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 12px;';
                
                const tabletBrowseBtn = document.createElement('button');
                tabletBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                tabletBrowseBtn.style.cssText = 'width: 45px;';
                
                tabletGroup.appendChild(tabletInput);
                tabletGroup.appendChild(tabletBrowseBtn);
                
                // Mobile video input
                const mobileLabel = document.createElement('label');
                mobileLabel.textContent = 'Video URL (Mobile - max 970px)';
                mobileLabel.style.cssText = 'display: block; font-size: 12px; color: #666; margin-bottom: 4px;';
                
                const mobileInput = document.createElement('input');
                mobileInput.type = 'text';
                mobileInput.placeholder = 'Optional: Mobile video URL';
                mobileInput.value = videoSources.mobile;
                mobileInput.style.cssText = 'flex: 1; margin-bottom: 8px; font-size: 13px;';
                
                const mobileGroup = document.createElement('div');
                mobileGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';
                
                const mobileBrowseBtn = document.createElement('button');
                mobileBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                mobileBrowseBtn.style.cssText = 'width: 45px;';
                
                mobileGroup.appendChild(mobileInput);
                mobileGroup.appendChild(mobileBrowseBtn);
                
                const responsiveHint = document.createElement('small');
                responsiveHint.textContent = '💡 Tip: Upload progressively larger videos for better quality on bigger screens';
                responsiveHint.style.cssText = 'display: block; font-size: 11px; color: #666; margin-top: -4px;';
                
                responsiveVideoContainer.appendChild(largeLabel);
                responsiveVideoContainer.appendChild(largeGroup);
                responsiveVideoContainer.appendChild(tabletLabel);
                responsiveVideoContainer.appendChild(tabletGroup);
                responsiveVideoContainer.appendChild(mobileLabel);
                responsiveVideoContainer.appendChild(mobileGroup);
                responsiveVideoContainer.appendChild(responsiveHint);
                
                // Alt text for images
                const altInput = document.createElement('input');
                altInput.type = 'text';
                altInput.placeholder = 'Alt text (for accessibility)';
                altInput.value = img?.alt || '';
                altInput.style.cssText = 'width: 100%; margin-bottom: 8px;';
                
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    slide.remove();
                    section.remove();
                    onChange();
                };
                
                // Update UI based on media type
                const updateMediaType = () => {
                    const selectedType = typeSelect.value;
                    urlInput.placeholder = selectedType === 'video' ? 'Video URL (Desktop)' : 'Image URL';
                    altInput.style.display = selectedType === 'image' ? 'block' : 'none';
                    responsiveVideoContainer.style.display = selectedType === 'video' ? 'block' : 'none';
                    headerTitle.textContent = `Slide ${index + 1} (${selectedType === 'video' ? 'Video' : 'Image'})`;
                };
                
                // Update video with responsive sources
                const updateVideoSources = () => {
                    const vid = mediaInner.querySelector('video');
                    if (!vid) return;
                    
                    // Store sources as data attributes instead of multiple <source> tags
                    const largeSrc = largeInput.value.trim();
                    const desktopSrc = urlInput.value.trim();
                    const tabletSrc = tabletInput.value.trim();
                    const mobileSrc = mobileInput.value.trim();
                    
                    if (largeSrc) vid.dataset.srcLarge = largeSrc;
                    else delete vid.dataset.srcLarge;
                    
                    if (desktopSrc) vid.dataset.srcDesktop = desktopSrc;
                    else delete vid.dataset.srcDesktop;
                    
                    if (tabletSrc) vid.dataset.srcTablet = tabletSrc;
                    else delete vid.dataset.srcTablet;
                    
                    if (mobileSrc) vid.dataset.srcMobile = mobileSrc;
                    else delete vid.dataset.srcMobile;
                    
                    // Set initial source (desktop by default)
                    vid.innerHTML = '';
                    const source = document.createElement('source');
                    source.src = desktopSrc;
                    source.type = 'video/mp4';
                    vid.appendChild(source);
                    
                    // Force video to reload
                    vid.load();
                };
                
                typeSelect.addEventListener('change', () => {
                    const newType = typeSelect.value;
                    mediaInner.innerHTML = '';
                    
                    if (newType === 'video') {
                        const newVideo = document.createElement('video');
                        newVideo.setAttribute('autoplay', '');
                        newVideo.setAttribute('loop', '');
                        newVideo.setAttribute('muted', '');
                        newVideo.setAttribute('playsinline', '');
                        mediaInner.appendChild(newVideo);
                        updateVideoSources();
                        previewImg.src = 'https://placehold.co/200x120?text=Video';
                    } else {
                        const newImg = document.createElement('img');
                        newImg.src = 'https://placehold.co/600x400?text=New+Slide'; //urlInput.value || 'https://placehold.co/600x400?text=New+Slide';
                        newImg.alt = altInput.value || '';
                        mediaInner.appendChild(newImg);
                        previewImg.src = newImg.src;
                    }
                    
                    updateMediaType();
                    onChange();
                });

                const detectMediaType = (url) => {
                    const videoExtensions = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i;
                    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
                    
                    if (videoExtensions.test(url)) return 'video';
                    if (imageExtensions.test(url)) return 'image';
                    return null;
                };
                
                urlInput.addEventListener('input', () => {
                    const detectedType = detectMediaType(urlInput.value);
                    if (detectedType && typeSelect.value !== detectedType) {
                        typeSelect.value = detectedType;
                        typeSelect.dispatchEvent(new Event('change'));
                        return;
                    }
                    
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                    } else {
                        const image = mediaInner.querySelector('img');
                        if (image) {
                            image.src = urlInput.value;
                            previewImg.src = urlInput.value;
                            thumb.src = urlInput.value;
                        }
                    }
                    onChange();
                });
                
                largeInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange();
                    }
                });
                
                tabletInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange();
                    }
                });
                
                mobileInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange();
                    }
                });
                
                altInput.addEventListener('input', () => {
                    const image = mediaInner.querySelector('img');
                    if (image) image.alt = altInput.value;
                    onChange();
                });
                
                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    const pickerType = typeSelect.value === 'video' ? 'video' : 'image';
                    builder.openFilePicker(pickerType, (url) => {
                        urlInput.value = url;
                        
                        const detectedType = detectMediaType(url);
                        if (detectedType && typeSelect.value !== detectedType) {
                            typeSelect.value = detectedType;
                            typeSelect.dispatchEvent(new Event('change'));
                            return;
                        }
                        
                        if (typeSelect.value === 'video') {
                            updateVideoSources();
                        } else {
                            const image = mediaInner.querySelector('img');
                            if (image) {
                                image.src = url;
                                previewImg.src = url;
                                thumb.src = url;
                            }
                        }
                        onChange();
                    }, browseBtn);
                };
                
                largeBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    builder.openFilePicker('video', (url) => {
                        largeInput.value = url;
                        updateVideoSources();
                        onChange();
                    }, largeBrowseBtn);
                };

                tabletBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    builder.openFilePicker('video', (url) => {
                        tabletInput.value = url;
                        updateVideoSources();
                        onChange();
                    }, tabletBrowseBtn);
                };
                
                mobileBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    builder.openFilePicker('video', (url) => {
                        mobileInput.value = url;
                        updateVideoSources();
                        onChange();
                    }, mobileBrowseBtn);
                };
                
                updateMediaType();
                
                body.appendChild(typeLabel);
                body.appendChild(typeSelect);
                body.appendChild(preview);
                body.appendChild(urlGroup);
                body.appendChild(responsiveVideoContainer);
                body.appendChild(altInput);
                body.appendChild(deleteBtn);
                
                // Toggle logic
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle')) return;
                    header.style.cursor = 'pointer';
                    const open = body.style.display === 'block';
                    body.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    icon.style.transform = open ? 'rotate(360deg)' : 'rotate(180deg)';
                });
                
                section.appendChild(header);
                section.appendChild(body);
                
                return section;
            };
            
            const sortableContainer = document.createElement('div');
            sortableContainer.className = 'sortable-slides-container';
            
            slides.forEach((slide, i) => {
                sortableContainer.appendChild(createSlideEditor(slide, i));
            });
            
            container.appendChild(sortableContainer);
            
            // Initialize SortableJS
            loadSortable().then((Sortable) => {
                new Sortable(sortableContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    onEnd: function() {
                        const editorSlides = Array.from(sortableContainer.children).filter(s => s.dataset.slideId);
                        const elementSlides = Array.from(element.querySelectorAll('.media-slide'));
                        
                        const slideMap = new Map();
                        elementSlides.forEach(slide => {
                            const slideId = slide.dataset.slideId;
                            if (slideId) slideMap.set(slideId, slide);
                        });
                        
                        editorSlides.forEach((editorSlide) => {
                            const slideId = editorSlide.dataset.slideId;
                            const actualSlide = slideMap.get(slideId);
                            if (actualSlide && actualSlide.parentElement === element) {
                                element.appendChild(actualSlide);
                            }
                        });
                        
                        onChange();
                    }
                });
            });

            const withTextCheckbox = document.createElement('label');
            withTextCheckbox.style.cssText = 'display: flex; align-items: center; margin: 8px 0; gap: 6px; cursor: pointer';
            withTextCheckbox.innerHTML = `
                <input type="checkbox" class="chk-with-text"> Include text overlay
            `;
            container.appendChild(withTextCheckbox);

            // Add Slide button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Slide';
            addBtn.className = 'add-item-btn';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const includeText = withTextCheckbox.querySelector('.chk-with-text')?.checked || false;

                const newSlide = document.createElement('div');
                // newSlide.className = 'media-slide';
                newSlide.className = 'media-slide' + (element.querySelectorAll('.media-slide').length === 0 ? ' active' : '');
                newSlide.dataset.slideId = `slide-${Date.now()}`;
                // newSlide.innerHTML = `
                //     <div class="media-slide-inner">
                //         <img src="https://placehold.co/1920x1080?text=New+Slide" alt="">
                //     </div>
                // `;
                
                if (includeText) {
                    newSlide.innerHTML = `
                        <div class="media-slide-inner">
                            <img src="https://placehold.co/600x400/c9cacd/c9cacd/png" alt="">
                        </div>
                        <div class="item-content position-center is-container">
                            <div class="is-subblock edit">
                                <p class="uppercase tracking-225 size-12">New Collection</p>
                                <h2>Discover Timeless Elegance</h2>
                                <p>Experience minimalist design and exceptional craftsmanship.</p>
                            </div>
                        </div>
                    `;
                } else {
                    newSlide.innerHTML = `
                        <div class="media-slide-inner">
                            <img src="https://placehold.co/1920x1080?text=New+Slide" alt="">
                        </div>
                    `;
                }
                element.appendChild(newSlide);
                const editor = createSlideEditor(newSlide, sortableContainer.children.length);
                sortableContainer.appendChild(editor);
                onChange();
            };
            
            // Add editor styles
            const style = document.createElement('style');
            style.textContent = `
                .items-container {
                    margin-bottom: 12px;
                }
                .item-editor {
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    background: #fff;
                }
                .item-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px 4px 5px 12px;
                    background: #f9f9f9;
                    cursor: pointer;
                    border-radius: 6px 6px 0 0;
                }
                .item-header:hover {
                    background: #f3f3f3;
                }
                .item-thumb {
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 10px;
                }
                .item-header span:nth-child(3) {
                    flex: 1;
                    font-weight: 500;
                }
                .item-body {
                    padding: 12px;
                    display: none;
                }
                .cb-settings-form label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 4px;
                    margin-top: 8px;
                }
                .cb-settings-form label:first-child {
                    margin-top: 0;
                }
                .add-item-btn {
                    width: 100%;
                    padding: 10px;
                    margin-top: 8px;
                }
            `;
            container.appendChild(style);

            container.appendChild(addBtn);
            return container;
        }
    },
    
    mount: function(element, options) {
        const slider = new FullscreenMediaSlider(element, options);
        return slider;
    },
    
    unmount: function(element, instance) {
        if (instance && instance.destroy) {
            instance.destroy();
        }
    }
};

class FullscreenMediaSlider {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.slides = element.querySelectorAll('.media-slide');
        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.isAutoplayPaused = false;
        this.currentBreakpoint = this.getBreakpoint();
        this.hoverPauseActive = false;
        this.editModePaused = false;
        this.wasAutoplayingBeforeEdit = false;
        this.init();
    }
    
    init() {
        // Don't add active class immediately - let it be added after setup
        const needsActiveClass = this.slides.length > 0 && !this.element.querySelector('.media-slide.active');
        
        this.setupResponsiveVideos();
        this.setupTextPosition();
        this.createControls();
        this.createScreenReaderAnnouncer();
        this.attachEvents();
        this.setupTouchSupport();
        
        if (this.options.pauseOnHover) {
            this.setupHoverPause();
        }

        // Always setup edit mode pause for page builder
        this.setupEditModePause();

        this.applyZoomEffect();
        
        // Add active class after everything is set up to trigger animation
        // if (needsActiveClass) {
        //     setTimeout(() => {
        //         this.slides[0].classList.add('active');
        //     }, 50);
        // }
        if (needsActiveClass) {
            setTimeout(() => {
                // Add active class immediately without transition for first load
                this.slides[0].style.transition = 'none';
                this.slides[0].classList.add('active');
                
                // Re-enable transitions after initial display
                setTimeout(() => {
                    this.slides[0].style.transition = '';
                }, 50);
                            
            }, 50);
        }

        this.startAutoplay();
    }
    
    getBreakpoint() {
        const width = window.innerWidth;
        if (width <= 760) return 'mobile';
        if (width <= 1280) return 'tablet';
        if (width < 1920) return 'desktop';
        return 'large';
    }

    setupTextPosition() {
        const positions = [
            'position-top-left', 'position-top-center', 'position-top-right',
            'position-center-left', 'position-center', 'position-center-right',
            'position-bottom-left', 'position-bottom-center', 'position-bottom-right'
        ];
        this.slides.forEach(slide => {
            const content = slide.querySelector('.item-content');
            if (content && !content.classList.contains(this.options.textPosition)) {
                content.classList.remove(...positions);
                content.classList.add(this.options.textPosition);
            }
        });
    }
    
    setupResponsiveVideos() {
        // Process all video slides and set up responsive switching
        this.slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (!video) return;
            
            // Check if video has responsive sources stored
            if (!video.dataset.srcDesktop && !video.dataset.srcMobile && !video.dataset.srcTablet) {
                // Legacy video with single source - store it as desktop
                const source = video.querySelector('source');
                if (source && source.src) {
                    video.dataset.srcDesktop = source.src;
                }
            }
            
            // Set initial video source based on current breakpoint
            this.updateVideoSource(video);
        });
        
        // Listen for window resize
        this.resizeHandler = this.debounce(() => {
            const newBreakpoint = this.getBreakpoint();
            if (newBreakpoint !== this.currentBreakpoint) {
                this.currentBreakpoint = newBreakpoint;
                this.updateAllVideoSources();
            }
        }, 250);
        
        window.addEventListener('resize', this.resizeHandler);
    }
    
    updateVideoSource(video) {
        const breakpoint = this.getBreakpoint();
        
        // Determine which source to use
        let selectedSrc = null;
        
        if (breakpoint === 'mobile' && video.dataset.srcMobile) {
            selectedSrc = video.dataset.srcMobile;
        } else if ((breakpoint === 'mobile' || breakpoint === 'tablet') && video.dataset.srcTablet) {
            selectedSrc = video.dataset.srcTablet;
        } else if (breakpoint === 'large' && video.dataset.srcLarge) {
            selectedSrc = video.dataset.srcLarge;
        } else if (video.dataset.srcDesktop) {
            selectedSrc = video.dataset.srcDesktop;
        } 
        
        if (!selectedSrc) return;
        
        // Check current source
        const currentSource = video.querySelector('source');
        const currentSrc = currentSource ? currentSource.src : '';
        
        // Only update if source changed
        if (currentSrc !== selectedSrc) {
            const wasPlaying = !video.paused;
            const currentTime = video.currentTime;
            
            // Update source
            video.innerHTML = '';
            const newSource = document.createElement('source');
            newSource.src = selectedSrc;
            newSource.type = 'video/mp4';
            video.appendChild(newSource);
            
            // Reload video
            video.load();
            
            // Try to restore playback state
            if (wasPlaying) {
                video.currentTime = currentTime;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Autoplay prevented, that's ok
                    });
                }
            }
        }
    }
    
    updateAllVideoSources() {
        this.slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) {
                this.updateVideoSource(video);
            }
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // applyZoomEffect() {
    //     if (!this.options.zoomEffect) {
    //         this.element.style.setProperty('--zoom-scale', '1');
    //         this.slides.forEach(slide => {
    //             const media = slide.querySelector('img, video');
    //             if (media) {
    //                 media.style.transition = 'none';
    //             }
    //         });
    //     }
    // }
    applyZoomEffect() {
        if (!this.options.zoomEffect) {
            this.element.style.setProperty('--zoom-scale', '1');
            this.slides.forEach(slide => {
                const media = slide.querySelector('img, video');
                if (media) {
                    media.style.transition = 'none';
                }
            });
        }
    }

    createControls() {
        if (this.options.showCounter) {
            const counter = document.createElement('div');
            counter.className = 'slide-counter';
            counter.innerHTML = `<span class="current">01</span> / <span class="total">${String(this.slides.length).padStart(2, '0')}</span>`;
            this.element.appendChild(counter);
            this.currentCounter = counter.querySelector('.current');
        }
        
        if (this.options.showKeyboardHint && this.options.enableKeyboard) {
            const hint = document.createElement('div');
            hint.className = 'keyboard-hint';
            hint.textContent = 'USE ARROW KEYS TO NAVIGATE';
            this.element.appendChild(hint);
        }
        
        if (this.options.showNavButtons) {
            const controls = document.createElement('div');
            controls.className = 'slider-controls';
            controls.innerHTML = `
                <button class="control-btn prev-btn" aria-label="Previous slide">‹</button>
                <button class="control-btn next-btn" aria-label="Next slide">›</button>
            `;
            this.element.appendChild(controls);
            this.prevBtn = controls.querySelector('.prev-btn');
            this.nextBtn = controls.querySelector('.next-btn');
        }

        if (!this.options.pauseOnHover) {
            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'play-pause-btn';
            playPauseBtn.setAttribute('aria-label', 'Play/Pause');
            playPauseBtn.innerHTML = '❚❚';
            this.element.appendChild(playPauseBtn);
            this.playPauseBtn = playPauseBtn;
        }

        if (this.options.showPagination) {
            const pagination = document.createElement('div');
            pagination.className = 'slider-pagination';
            for (let i = 0; i < this.slides.length; i++) {
                const dot = document.createElement('button');
                dot.className = 'pagination-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.setAttribute('type', 'button');
                pagination.appendChild(dot);
            }
            this.element.appendChild(pagination);
            this.dots = pagination.querySelectorAll('.pagination-dot');
        }
        
        this.element.style.setProperty('--transition-speed', `${this.options.transitionSpeed}ms`);
        this.element.style.setProperty('--zoom-scale', `${this.options.zoomScale / 100}`);
        this.element.style.setProperty('--overlay-opacity', `${this.options.overlayOpacity / 100}`);
    }
        
    createScreenReaderAnnouncer() {
        const announcer = document.createElement('div');
        announcer.className = 'sr-only';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        this.element.appendChild(announcer);
        this.announcer = announcer;
    }

    announceSlideChange() {
        if (this.announcer) {
            this.announcer.textContent = `Slide ${this.currentSlide + 1} of ${this.slides.length}`;
        }
    }

    attachEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.toggleAutoplay());
        }
        
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        if (this.options.enableKeyboard) {
            this.keyboardHandler = (e) => {
                // Ignore if the active element is an input, textarea, or contenteditable
                const activeEl = document.activeElement;
                if (
                    activeEl?.matches?.('input, textarea, [contenteditable="true"], [contenteditable=""]') ||
                    activeEl?.closest?.('.edit') // add known editor containers if needed
                ) {
                    return;
                }

                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoplay();
                }
            };
            document.addEventListener('keydown', this.keyboardHandler);
        }
    }
    
    setupHoverPause() {
        this.hoverPauseActive = false;
        
        this.mouseEnterHandler = () => {
            if (!this.isAutoplayPaused && this.autoplayInterval) {
                this.stopAutoplay();
                this.hoverPauseActive = true;
            }
        };
        
        this.mouseLeaveHandler = () => {
            if (this.hoverPauseActive) {
                this.startAutoplay();
                this.hoverPauseActive = false;
            }
        };
        
        this.element.addEventListener('mouseenter', this.mouseEnterHandler);
        this.element.addEventListener('mouseleave', this.mouseLeaveHandler);

        // Check if element is currently being hovered using :hover pseudo-class
        setTimeout(() => {
            if (this.element.matches(':hover')) {
                this.stopAutoplay();
                this.hoverPauseActive = true;
            }
        }, 100);
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        const currentVideo = this.slides[this.currentSlide].querySelector('video');
        if (currentVideo) currentVideo.pause();
        
        this.slides[this.currentSlide].classList.remove('active');
        if (this.dots) this.dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        this.slides[this.currentSlide].classList.add('active');
        if (this.dots) this.dots[this.currentSlide].classList.add('active');
        
        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }

        this.announceSlideChange();
        
        const newVideo = this.slides[this.currentSlide].querySelector('video');
        if (newVideo) {
            newVideo.currentTime = 0;  // to restart from beginning
            newVideo.play();
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
        
        // this.resetAutoplay();
        if (!this.hoverPauseActive) {
            this.resetAutoplay();
        }
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
        if (!this.hoverPauseActive) {
            this.resetAutoplay();
        }
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
        if (!this.hoverPauseActive) {
            this.resetAutoplay();
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayDuration);
        if (this.playPauseBtn) this.playPauseBtn.innerHTML = '❚❚';
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        if (this.playPauseBtn) this.playPauseBtn.innerHTML = '▶';
    }
    
    resetAutoplay() {
        if (!this.isAutoplayPaused && !this.manuallyPaused) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    toggleAutoplay() {
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.isAutoplayPaused = true;
            this.manuallyPaused = true;
        } else {
            this.startAutoplay();
            this.isAutoplayPaused = false;
            this.manuallyPaused = false;
        }
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        this.touchStartHandler = (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };
        
        this.touchEndHandler = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
        
        this.element.addEventListener('touchstart', this.touchStartHandler, { passive: true });
        this.element.addEventListener('touchend', this.touchEndHandler, { passive: true });
    }

    setupEditModePause() {
        const editableElements = this.element.querySelectorAll('.edit');
        if (editableElements.length === 0) return;
        editableElements.forEach(editEl => {
            editEl.addEventListener('focus', () => {
                if (this.autoplayInterval) {
                    this.stopAutoplay();
                }
            }, true);
        });
    }

    destroy() {
        this.stopAutoplay();
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        if (this.mouseEnterHandler) {
            this.element.removeEventListener('mouseenter', this.mouseEnterHandler);
            this.element.removeEventListener('mouseleave', this.mouseLeaveHandler);
        }
        if (this.touchStartHandler) {
            this.element.removeEventListener('touchstart', this.touchStartHandler);
            this.element.removeEventListener('touchend', this.touchEndHandler);
        }
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        if (this.editModeObserver) {
            this.editModeObserver.disconnect();
        }
    }
}