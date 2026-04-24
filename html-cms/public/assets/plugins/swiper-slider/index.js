export default {
    name: 'swiper-slider',
    displayName: 'Slider',
    version: '2.0.0',

    contentbox: {
        bg: false,
        text: false,
        title: false
    },

    settings: {
        _groups: [
            {
                id: 'behavior',
                label: 'Behavior',
                fields: ['autoplay', 'pauseOnHover', 'delay', 'transitionSpeed', 'loop', 'effect', 'zoomEffect', 'zoomScale']
            },
            {
                id: 'layout',
                label: 'Layout',
                fields: ['aspectRatio', 'slidesPerView', 'spaceBetween', 'roundedCorners', 'textPosition', 'textMaxWidth', 'topOverlayOpacity', 'bottomOverlayOpacity', 'navigation', 'navigationButtonSize', 'navigationArrowSize', 'navigationRoundedCorners', 'navigationOffset', 'navigationStyle', 'pagination', 'paginationStyle']
            }
        ],
        autoplay: {
            type: 'boolean',
            label: 'Enable Autoplay',
            default: true,
            group: 'behavior'
        },
        delay: {
            type: 'number',
            label: 'Autoplay Delay',
            default: 3000,
            min: 500,
            step: 500,
            unit: 'ms',
            group: 'behavior'
        },
        transitionSpeed: {
            type: 'number',
            label: 'Transition Speed',
            default: 800,
            min: 300,
            max: 3000,
            step: 100,
            unit: 'ms',
            group: 'behavior'
        },
        loop: {
            type: 'boolean',
            label: 'Loop Slides',
            default: true,
            group: 'behavior'
        },
        pauseOnHover: {
            type: 'boolean',
            label: 'Pause on Hover',
            default: true,
            group: 'behavior'
        },
        effect: {
            type: 'select',
            label: 'Transition Effect',
            default: 'slide',
            options: [
                { value: 'slide', label: 'Slide' },
                { value: 'fade', label: 'Fade' },
                { value: 'cube', label: 'Cube' },
                { value: 'coverflow', label: 'Coverflow' },
                { value: 'flip', label: 'Flip' }
            ],
            group: 'behavior'
        },
        zoomEffect: {
            type: 'boolean',
            label: 'Enable Zoom Effect',
            default: true,
            group: 'behavior'
        },
        zoomScale: {
            type: 'range',
            label: 'Zoom Scale',
            default: 108,
            min: 100,
            max: 120,
            step: 1,
            unit: '%',
            group: 'behavior'
        },
        aspectRatio: {
            type: 'select',
            label: 'Aspect Ratio',
            default: '16/9',
            options: [
                { value: '16/9', label: '16:9 (Landscape)' },
                { value: '4/3', label: '4:3 (Standard)' },
                { value: '1/1', label: '1:1 (Square)' },
                { value: '3/4', label: '3:4 (Portrait)' },
                { value: 'auto', label: 'Auto (Content Height)' }
            ],
            group: 'layout'
        },
        slidesPerView: {
            type: 'number',
            label: 'Slides Per View',
            default: 1,
            min: 1,
            max: 4,
            group: 'layout'
        },
        spaceBetween: {
            type: 'number',
            label: 'Gap',
            default: 0,
            min: 0,
            max: 100,
            step: 1,
            unit: 'px',
            group: 'layout'
        },
        roundedCorners: {
            type: 'range',
            label: 'Rounded Corners',
            default: 0,
            min: 0,
            max: 500,
            step: 1,
            unit: 'px',
            group: 'layout'
        },
        textPosition: {
            type: 'select',
            label: 'Text Position',
            default: 'position-bottom-left',
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
            group: 'layout'
        },
        textMaxWidth: {
            type: 'number',
            label: 'Text Max Width',
            default: 700,
            unit: 'px',
            group: 'layout'
        },
        topOverlayOpacity: {
            type: 'range',
            label: 'Top Overlay Opacity',
            default: 0.3,
            min: 0,
            max: 1,
            step: 0.1,
            group: 'layout'
        },
        bottomOverlayOpacity: {
            type: 'range',
            label: 'Bottom Overlay Opacity',
            default: 0.3,
            min: 0,
            max: 1,
            step: 0.1,
            group: 'layout'
        },
        navigation: {
            type: 'boolean',
            label: 'Show Navigation',
            default: true,
            group: 'layout'
        },
        navigationStyle: {
            type: 'select',
            label: 'Navigation Style',
            default: 'transparent',
            options: [
                { value: 'transparent', label: 'Transparent' },
                { value: 'solid', label: 'Solid' },
                { value: 'arrow', label: 'Arrow' },
            ],
            group: 'layout'
        },
        navigationButtonSize: {
            type: 'number',
            label: 'Navigation Size',
            default: 48,
            unit: 'px',
            group: 'layout'
        },
        navigationArrowSize: {
            type: 'number',
            label: 'Navigation Arrow Size',
            default: 16,
            unit: 'px',
            group: 'layout'
        },
        navigationOffset: {
            type: 'number',
            label: 'Navigation Offset',
            default: 20,
            unit: 'px',
            group: 'layout'
        },
        navigationRoundedCorners: {
            type: 'range',
            label: 'Navigation Corners',
            default: 50,
            min: 0,
            max: 50,
            step: 1,
            unit: '%',
            group: 'layout'
        },
        pagination: {
            type: 'boolean',
            label: 'Show Pagination',
            default: true,
            group: 'layout'
        },
        paginationStyle: {
            type: 'select',
            label: 'Pagination Style',
            default: 'dots',
            options: [
                { value: 'dots', label: 'Dots' },
                { value: 'rounded-rectangle', label: 'Rounded Rectangle' },
                { value: 'lines', label: 'Lines' }
            ],
            group: 'layout'
        },

    },

    editor: {
        openContentEditor: function(element, builder, onChange) {
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

            const container = document.createElement('div');

            const wrapper = element.querySelector('.swiper-wrapper');
            let slides = Array.from(wrapper.querySelectorAll('.swiper-slide'))
                .filter(s => !s.classList.contains('swiper-slide-duplicate'));

            const createItemEditor = (item, itemIndex) => {
                // Item root
                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';

                const itemId = item.dataset.slideId || `slide-${Date.now()}-${itemIndex}`;
                item.dataset.slideId = itemId;
                itemEditor.dataset.itemId = itemId;

                // Detect media type
                const slideImage = item.querySelector('.slide-image');
                const imgEl = slideImage.querySelector('img');
                const videoEl = slideImage.querySelector('video');
                const isVideo = !!videoEl;

                // Header
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

                const dragHandle = document.createElement('span');
                dragHandle.className = 'drag-handle';
                dragHandle.innerHTML = '⠿';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;

                const thumb = document.createElement('img');
                thumb.className = 'item-thumb';
                thumb.src = isVideo ? 'https://placehold.co/40x40?text=Video' : (imgEl?.src || 'https://placehold.co/40x40?text=No+Media');
                thumb.onerror = () => {
                    thumb.src = 'https://placehold.co/40x40?text=Media';
                };

                const itemTitle = document.createElement('span');
                itemTitle.textContent = `Slide ${itemIndex + 1} (${isVideo ? 'Video' : 'Image'})`;

                const deleteBtn = document.createElement('button');
                deleteBtn.style.cssText = 'width: 45px; background: transparent; color: #dc2626;';
                deleteBtn.className = 'item-delete-btn';
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.type = 'button';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    item.remove();
                    itemEditor.remove();
                    onChange?.();
                };

                itemHeader.appendChild(dragHandle);
                itemHeader.appendChild(thumb);
                itemHeader.appendChild(itemTitle);
                itemHeader.appendChild(deleteBtn);

                // Body
                const itemBody = document.createElement('div');
                itemBody.className = 'item-body';
                itemBody.style.display = 'none';

                // Get existing video sources from data attributes
                const getVideoSources = () => {
                    if (!videoEl) return { large: '', desktop: '', tablet: '', mobile: '' };
                    
                    return {
                        large: videoEl.dataset.srcLarge || '',
                        desktop: videoEl.dataset.srcDesktop || videoEl.querySelector('source')?.src || '',
                        tablet: videoEl.dataset.srcTablet || '',
                        mobile: videoEl.dataset.srcMobile || ''
                    };
                };

                const videoSources = getVideoSources();

                // Media Type Selection
                const typeLabel = document.createElement('label');
                typeLabel.textContent = 'Media Type';

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
                previewImg.src = isVideo ? 'https://placehold.co/200x120?text=Video' : (imgEl?.src || 'https://placehold.co/200x120?text=No+Img');
                previewImg.style.cssText = 'width: 100%; height: 120px; object-fit: cover; border-radius: 6px; display: block;';
                preview.appendChild(previewImg);

                // Media URL Input (for images or desktop video)
                const mediaLabel = document.createElement('label');
                mediaLabel.textContent = isVideo ? 'Video URL (Desktop)' : 'Image URL';

                const mediaGroup = document.createElement('div');
                mediaGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';

                const mediaInput = document.createElement('input');
                mediaInput.type = 'text';
                mediaInput.value = isVideo ? videoSources.desktop : (imgEl?.getAttribute('src') || '');
                mediaInput.style.cssText = 'flex: 1;';
                mediaInput.placeholder = isVideo ? 'Video URL (Desktop)' : 'Image URL';

                const browseBtn = document.createElement('button');
                browseBtn.style.cssText = 'width: 45px;';
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';

                mediaGroup.appendChild(mediaInput);
                mediaGroup.appendChild(browseBtn);

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
                const altLabel = document.createElement('label');
                altLabel.textContent = 'Alt Text';

                const altInput = document.createElement('input');
                altInput.type = 'text';
                altInput.value = imgEl?.alt || '';
                altInput.style.display = isVideo ? 'none' : 'block';

                // Helper functions
                const detectMediaType = (url) => {
                    const videoExtensions = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i;
                    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
                    
                    if (videoExtensions.test(url)) return 'video';
                    if (imageExtensions.test(url)) return 'image';
                    return null;
                };

                const updateVideoSources = () => {
                    const vid = slideImage.querySelector('video');
                    if (!vid) return;
                    
                    const largeSrc = largeInput.value.trim();
                    const desktopSrc = mediaInput.value.trim();
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
                    
                    vid.innerHTML = '';
                    const source = document.createElement('source');
                    source.src = desktopSrc;
                    source.type = 'video/mp4';
                    vid.appendChild(source);
                    vid.load();
                };

                const updateMediaType = () => {
                    const selectedType = typeSelect.value;
                    mediaLabel.textContent = selectedType === 'video' ? 'Video URL (Desktop)' : 'Image URL';
                    mediaInput.placeholder = selectedType === 'video' ? 'Video URL (Desktop)' : 'Image URL';
                    altLabel.style.display = selectedType === 'image' ? 'block' : 'none';
                    altInput.style.display = selectedType === 'image' ? 'block' : 'none';
                    responsiveVideoContainer.style.display = selectedType === 'video' ? 'block' : 'none';
                    itemTitle.textContent = `Slide ${itemIndex + 1} (${selectedType === 'video' ? 'Video' : 'Image'})`;
                };

                // Event handlers
                typeSelect.addEventListener('change', () => {
                    const newType = typeSelect.value;
                    // slideImage.innerHTML = '';
                    
                    if (newType === 'video') {
                        const oldElm = slideImage.querySelector('img');
                        const newVideo = document.createElement('video');
                        newVideo.setAttribute('autoplay', '');
                        newVideo.setAttribute('loop', '');
                        newVideo.setAttribute('muted', '');
                        newVideo.setAttribute('playsinline', '');
                        // slideImage.appendChild(newVideo);
                        oldElm.outerHTML = newVideo.outerHTML;
                        updateVideoSources();
                        previewImg.src = 'https://placehold.co/200x120?text=Video';
                        thumb.src = 'https://placehold.co/40x40?text=Video';
                    } else {
                        const oldElm = slideImage.querySelector('video');
                        const newImg = document.createElement('img');
                        newImg.src = 'https://placehold.co/600x400?text=New+Slide'; // mediaInput.value || 'https://placehold.co/600x400?text=New+Slide';
                        newImg.alt = altInput.value || '';
                        // slideImage.appendChild(newImg);
                        oldElm.outerHTML = newImg.outerHTML;
                        previewImg.src = newImg.src;
                        thumb.src = newImg.src;
                    }
                    
                    // Preserve caption if it exists
                    const caption = item.querySelector('.slide-caption');
                    if (caption) {
                        slideImage.appendChild(caption);
                    }
                    
                    updateMediaType();
                    onChange?.();
                });

                mediaInput.addEventListener('input', () => {
                    const detectedType = detectMediaType(mediaInput.value);
                    if (detectedType && typeSelect.value !== detectedType) {
                        typeSelect.value = detectedType;
                        typeSelect.dispatchEvent(new Event('change'));
                        return;
                    }
                    
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                    } else {
                        const image = slideImage.querySelector('img');
                        if (image) {
                            image.src = mediaInput.value;
                            previewImg.src = mediaInput.value;
                            thumb.src = mediaInput.value;
                        }
                    }
                    onChange?.();
                });

                largeInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange?.();
                    }
                });
                
                tabletInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange?.();
                    }
                });
                
                mobileInput.addEventListener('input', () => {
                    if (typeSelect.value === 'video') {
                        updateVideoSources();
                        onChange?.();
                    }
                });

                altInput.addEventListener('input', () => {
                    const image = slideImage.querySelector('img');
                    if (image) image.alt = altInput.value;
                    onChange?.();
                });

                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    const pickerType = typeSelect.value === 'video' ? 'video' : 'image';
                    if (builder && builder.openFilePicker) {
                        builder.openFilePicker(pickerType, (url) => {
                            mediaInput.value = url;
                            
                            const detectedType = detectMediaType(url);
                            if (detectedType && typeSelect.value !== detectedType) {
                                typeSelect.value = detectedType;
                                typeSelect.dispatchEvent(new Event('change'));
                                return;
                            }
                            
                            if (typeSelect.value === 'video') {
                                updateVideoSources();
                            } else {
                                const image = slideImage.querySelector('img');
                                if (image) {
                                    image.src = url;
                                    previewImg.src = url;
                                    thumb.src = url;
                                }
                            }
                            onChange?.();
                        }, browseBtn);
                    }
                };

                largeBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    if (builder && builder.openFilePicker) {
                        builder.openFilePicker('video', (url) => {
                            largeInput.value = url;
                            updateVideoSources();
                            onChange?.();
                        }, largeBrowseBtn);
                    }
                };

                tabletBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    if (builder && builder.openFilePicker) {
                        builder.openFilePicker('video', (url) => {
                            tabletInput.value = url;
                            updateVideoSources();
                            onChange?.();
                        }, tabletBrowseBtn);
                    }
                };
                
                mobileBrowseBtn.onclick = (e) => {
                    e.preventDefault();
                    if (builder && builder.openFilePicker) {
                        builder.openFilePicker('video', (url) => {
                            mobileInput.value = url;
                            updateVideoSources();
                            onChange?.();
                        }, mobileBrowseBtn);
                    }
                };

                // Toggling
                itemHeader.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle') || e.target.closest('.item-delete-btn')) return;
                    const isOpen = itemBody.style.display === 'block';
                    itemBody.style.display = isOpen ? 'none' : 'block';
                });

                // Build body
                itemBody.appendChild(typeLabel);
                itemBody.appendChild(typeSelect);
                itemBody.appendChild(preview);
                itemBody.appendChild(mediaLabel);
                itemBody.appendChild(mediaGroup);
                itemBody.appendChild(responsiveVideoContainer);
                itemBody.appendChild(altLabel);
                itemBody.appendChild(altInput);

                itemEditor.appendChild(itemHeader);
                itemEditor.appendChild(itemBody);

                updateMediaType();

                return itemEditor;
            };

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';

            slides.forEach((item, i) => itemsContainer.appendChild(createItemEditor(item, i)));

            container.appendChild(itemsContainer);

            // Add text overlay checkbox
            const withTextCheckbox = document.createElement('label');
            withTextCheckbox.style.cssText = 'display: flex; align-items: center; margin: 12px 0 8px 0; gap: 6px; cursor: pointer';
            withTextCheckbox.innerHTML = `
                <input type="checkbox" class="chk-with-text"> Include text overlay
            `;
            container.appendChild(withTextCheckbox);

            // Add button
            const addBtn = document.createElement('button');
            addBtn.className = 'add-item-btn';
            addBtn.textContent = '+ Add Slide';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const includeText = withTextCheckbox.querySelector('.chk-with-text')?.checked || false;
                
                const newItem = document.createElement('div');
                newItem.className = 'swiper-slide';
                
                if (includeText) {
                    newItem.innerHTML = `
                        <div class="slide-image">
                            <img src="https://placehold.co/800x450?text=New+Slide" alt="New Slide">
                            <div class="slide-overlay"></div>
                            <div class="slide-caption">
                                <div class="is-subblock edit">
                                    <h3 class="slide-caption-title">New Slide</h3>
                                    <p class="slide-caption-description">Add your description here</p>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    newItem.innerHTML = `
                        <div class="slide-image">
                            <img src="https://placehold.co/800x450?text=New+Slide" alt="New Slide">
                        </div>
                    `;
                }
                
                wrapper.appendChild(newItem);
                const editorItem = createItemEditor(newItem, itemsContainer.children.length);
                itemsContainer.appendChild(editorItem);
                onChange?.();
            };
            container.appendChild(addBtn);

            // Sortable
            loadSortable().then(Sortable => {
                new Sortable(itemsContainer, {
                    handle: '.drag-handle',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function() {
                        const editorItems = Array.from(itemsContainer.children);
                        const itemMap = new Map();
                        Array.from(wrapper.children).forEach(item => {
                            if (item.dataset.slideId) itemMap.set(item.dataset.slideId, item);
                        });
                        editorItems.forEach(editorItem => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);
                            if (actualItem) wrapper.appendChild(actualItem);
                        });
                        onChange?.();
                    }
                });

                const style = document.createElement('style');
                style.textContent = `
                    .sortable-ghost {
                        opacity: 0.4;
                        background: #f0f0f0;
                    }
                    .sortable-chosen {
                        background: #f9f9f9;
                    }
                    .sortable-drag {
                        opacity: 0.8;
                    }
                `;
                container.appendChild(style);
            }).catch((error) => {
                console.error('Failed to load SortableJS:', error);
            });

            // Style
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
                    padding: 5px 5px 5px 12px;
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
                    border-radius: 4px;
                    object-fit: cover;
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
                    margin-top: 8px;
                    margin-bottom: 4px;
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

            return container;
        }

    },

    mount: function(element, options) {
        // 1. Asset Loading Helpers
        const loadSwiperCSS = () => {
            return new Promise((resolve, reject) => {
                if (document.querySelector('link[href*="swiper-bundle.min.css"]')) {
                    resolve();
                    return;
                }
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        };

        const loadSwiperJS = () => {
            return new Promise((resolve, reject) => {
                if (window.Swiper) {
                    resolve(window.Swiper);
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                script.onload = () => resolve(window.Swiper);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        // Helper functions for responsive video
        const getBreakpoint = () => {
            const width = window.innerWidth;
            if (width <= 760) return 'mobile';
            if (width <= 1280) return 'tablet';
            if (width < 1920) return 'desktop';
            return 'large';
        };

        const updateVideoSource = (video) => {
            const breakpoint = getBreakpoint();
            
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
            
            const currentSource = video.querySelector('source');
            const currentSrc = currentSource ? currentSource.src : '';
            
            if (currentSrc !== selectedSrc) {
                const wasPlaying = !video.paused;
                const currentTime = video.currentTime;
                
                video.innerHTML = '';
                const newSource = document.createElement('source');
                newSource.src = selectedSrc;
                newSource.type = 'video/mp4';
                video.appendChild(newSource);
                
                video.load();
                
                if (wasPlaying) {
                    video.currentTime = currentTime;
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {});
                    }
                }
            }
        };

        const setupResponsiveVideos = () => {
            const slides = element.querySelectorAll('.swiper-slide');
            slides.forEach(slide => {
                const video = slide.querySelector('video');
                if (!video) return;
                
                if (!video.dataset.srcDesktop && !video.dataset.srcMobile && !video.dataset.srcTablet) {
                    const source = video.querySelector('source');
                    if (source && source.src) {
                        video.dataset.srcDesktop = source.src;
                    }
                }
                
                updateVideoSource(video);
            });
        };

        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        const setupTextPosition = () => {
            const positions = [
                'position-top-left', 'position-top-center', 'position-top-right',
                'position-center-left', 'position-center', 'position-center-right',
                'position-bottom-left', 'position-bottom-center', 'position-bottom-right'
            ];
            const slides = element.querySelectorAll('.swiper-slide');
            slides.forEach(slide => {
                const content = slide.querySelector('.slide-caption');
                if (content && !content.classList.contains(options.textPosition)) {
                    content.classList.remove(...positions);
                    content.classList.add(options.textPosition);
                }
            });
        }

        // 2. Initialization
        const init = async () => {
            try {
                await loadSwiperCSS();
                const Swiper = await loadSwiperJS();

                const swiperContainer = element.querySelector('.swiper');
                if (!swiperContainer) return;

                // Cleanup existing instance if re-mounting
                if (element.swiperInstance) {
                    element.swiperInstance.destroy(true, true);
                }

                element.style.setProperty('--top-overlay-opacity', `${options.topOverlayOpacity}`);
                element.style.setProperty('--bottom-overlay-opacity', `${options.bottomOverlayOpacity}`);
                element.style.setProperty('--aspect-ratio', `${options.aspectRatio}`);
                element.style.setProperty('--border-radius', `${options.roundedCorners}px`);
                element.style.setProperty('--swiper-navigation-border-radius', `${options.navigationRoundedCorners}%`);
                element.style.setProperty('--zoom-scale', `${options.zoomScale / 100}`);
                element.style.setProperty('--text-max-width', `${options.textMaxWidth}px`);

                element.style.setProperty('--swiper-navigation-size', `${options.navigationButtonSize || 48 }px`);
                element.style.setProperty('--swiper-navigation-font-size', `${options.navigationArrowSize || 16}px`);
                element.style.setProperty('--swiper-navigation-sides-offset', `${options.navigationOffset || 20}px`);

                /*
                const slides = element.querySelectorAll('.swiper-slide');
                if (options.zoomEffect) {
                    element.style.setProperty('--zoom-scale', `${options.zoomScale / 100}`);
                    slides.forEach(slide => {
                        const media = slide.querySelector('img, video');
                        if (media) {
                            media.style.transition = '';
                        }
                    });
                } else {
                    element.style.setProperty('--zoom-scale', '1');
                    slides.forEach(slide => {
                        const media = slide.querySelector('img, video');
                        if (media) {
                            media.style.transition = 'none';
                        }
                    });
                }
                */
                if (options.zoomEffect) {
                    element.classList.add('zoom-effect');
                } else {
                    element.classList.remove('zoom-effect');
                }
                
                // Add pagination style class
                const paginationEl = element.querySelector('.swiper-pagination');
                if (paginationEl) {
                    paginationEl.className = 'swiper-pagination';
                    paginationEl.classList.add(`pagination-style-${options.paginationStyle || 'dots'}`);
                }

                // Add navigation style class
                const nextBtn = element.querySelector('.swiper-button-next');
                const prevBtn = element.querySelector('.swiper-button-prev');
                if (nextBtn && prevBtn) {
                    const navStyle = options.navigationStyle || 'transparent';
                    nextBtn.className = 'swiper-button-next';
                    prevBtn.className = 'swiper-button-prev';
                    nextBtn.classList.add(`nav-style-${navStyle}`);
                    prevBtn.classList.add(`nav-style-${navStyle}`);
                }

                setupTextPosition();

                // Setup responsive videos before initializing swiper
                setupResponsiveVideos();

                const config = {
                    effect: options.effect || 'slide',
                    slidesPerView: parseInt(options.slidesPerView) || 1,
                    spaceBetween: options.spaceBetween || 0,
                    loop: options.loop === true,
                    // pagination: {
                    //     el: element.querySelector('.swiper-pagination'),
                    //     clickable: true,
                    // },
                    // navigation: {
                    //     nextEl: element.querySelector('.swiper-button-next'),
                    //     prevEl: element.querySelector('.swiper-button-prev'),
                    // },
                    speed: options.transitionSpeed || 800,
                    observer: true,
                    observeParents: true,
                };

                if (options.pagination) {
                    config.pagination = {
                        el: element.querySelector('.swiper-pagination'),
                        clickable: true
                    };
                } else {
                    const p = element.querySelector('.swiper-pagination');
                    if (p) p.style.display = 'none';
                }

                if (options.navigation) {
                    config.navigation = {
                        nextEl: element.querySelector('.swiper-button-next'),
                        prevEl: element.querySelector('.swiper-button-prev')
                    };
                } else {
                    const next = element.querySelector('.swiper-button-next');
                    const prev = element.querySelector('.swiper-button-prev');
                    if (next) next.style.display = 'none';
                    if (prev) prev.style.display = 'none';
                }

                // Autoplay Logic
                if (options.autoplay) {
                    config.autoplay = {
                        delay: parseInt(options.delay) || 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: options.pauseOnHover === true,
                    };
                } else {
                    config.autoplay = false;
                }

                // Fade effect tweaks
                if (options.effect === 'fade') {
                    config.fadeEffect = { crossFade: true };
                }

                const swiper = new Swiper(swiperContainer, config);
                element.swiperInstance = swiper;

                // Handle responsive video switching
                let currentBreakpoint = getBreakpoint();
                const resizeHandler = debounce(() => {
                    const newBreakpoint = getBreakpoint();
                    if (newBreakpoint !== currentBreakpoint) {
                        currentBreakpoint = newBreakpoint;
                        const videos = element.querySelectorAll('video');
                        videos.forEach(video => updateVideoSource(video));
                    }
                }, 250);
                
                window.addEventListener('resize', resizeHandler);
                element.resizeHandler = resizeHandler;

                const overlays = element.querySelectorAll('.slide-overlay');
                overlays.forEach(elm => {
                    elm.addEventListener('click', () => {
                        const active = document.activeElement;
                        if (active instanceof HTMLElement) {
                            active.blur();
                        }
                    });
                });

            } catch (err) {
                console.error('Basic Slider: Failed to load Swiper', err);
            }
        };

        init();

        // 3. Return Instance Data (Cleanup)
        return {
            unmount: () => {
                if (element.swiperInstance) {
                    element.swiperInstance.destroy(true, true);
                }
                if (element.resizeHandler) {
                    window.removeEventListener('resize', element.resizeHandler);
                }
            }
        };
    }
};