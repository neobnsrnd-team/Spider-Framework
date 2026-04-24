/*
Usage:

<div data-cb-type="media-slider" data-cb-items-per-slide="2" data-cb-gap="26" data-cb-aspect-ratio="4/3" tabindex="0" role="region" aria-label="Media slider" aria-roledescription="carousel" style="position: relative; overflow: hidden; --accent-color: rgba(255, 133, 33, 1); --accent-color-light: rgb(255, 203, 161);" data-cb-accent-color="rgba(255, 133, 33, 1)" data-cb-autoplay="true" data-cb-autoplay-speed="3000" data-cb-loop="true" data-cb-pause-on-hover="true" data-cb-show-arrows="true" data-cb-show-dots="true" data-cb-show-counter="false">
    <div class="media-slider-track">
        <div class="slider-item" data-item-id="item-1760757493999-0">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-Vr5N2.jpg" alt="Product showcase">
            </div>
            <div class="item-content">
                <h3 class="item-title">Premium Widget</h3>
                <p class="item-description">High-quality craftsmanship</p>
                <a href="/product/1" class="item-link">Learn More →</a>
            </div>
        </div>

        <div class="slider-item" data-item-id="item-1760757493999-1">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-sFtJP2.jpg" alt="Another product">
            </div>
            <div class="item-content">
                <h3 class="item-title">Deluxe Gadget</h3>
                <p class="item-description">Innovation meets design</p>
                <a href="/product/2" class="item-link">Learn More →</a>
            </div>
        </div>

        <div class="slider-item" data-item-id="item-1760757493999-2">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-LUjJw.jpg" alt="Third product">
            </div>
            <div class="item-content">
                <h3 class="item-title">Essential Tool</h3>
                <p class="item-description">Everyday excellence</p>
                <a href="/product/3" class="item-link">Learn More →</a>
            </div>
        </div>

        <div class="slider-item" data-item-id="item-1760757493999-3">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-yBliz.jpg" alt="Fourth product">
            </div>
            <div class="item-content">
                <h3 class="item-title">Smart Device</h3>
                <p class="item-description">Technology simplified</p>
                <a href="/product/4" class="item-link">Learn More →</a>
            </div>
        </div>
    </div>
</div>
*/

export default {
    name: 'media-slider',
    displayName: 'Media Slider',
    version: '2.0.0',

    settings: {
        _groups: [
            {
                id: 'layout',
                label: 'Layout Settings',
                fields: ['itemsPerSlide', 'gap', 'aspectRatio']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['accentColor']
            },
            {
                id: 'behavior',
                label: 'Behavior',
                fields: ['autoplay', 'autoplaySpeed', 'loop', 'pauseOnHover']
            },
            {
                id: 'controls',
                label: 'Controls',
                fields: ['showArrows', 'showDots', 'showCounter']
            }
        ],
        itemsPerSlide: {
            type: 'number',
            label: 'Items Per View',
            default: 1,
            min: 1,
            max: 6,
            group: 'layout'
        },
        gap: {
            type: 'number',
            label: 'Gap Between Items',
            default: 16,
            min: 0,
            max: 48,
            unit: 'px',
            group: 'layout'
        },
        aspectRatio: {
            type: 'select',
            label: 'Card Aspect Ratio',
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
        accentColor: {
            type: 'color',
            label: 'Accent Color',
            default: '#0066cc',
            group: 'appearance'
        },
        autoplay: {
            type: 'boolean',
            label: 'Autoplay',
            default: false,
            group: 'behavior'
        },
        autoplaySpeed: {
            type: 'number',
            label: 'Autoplay Speed',
            default: 5000,
            min: 1000,
            max: 10000,
            step: 500,
            unit: 'ms',
            group: 'behavior'
        },
        loop: {
            type: 'boolean',
            label: 'Loop Items',
            default: true,
            group: 'behavior'
        },
        pauseOnHover: {
            type: 'boolean',
            label: 'Pause on Hover',
            default: true,
            group: 'behavior'
        },
        showArrows: {
            type: 'boolean',
            label: 'Show Navigation Arrows',
            default: true,
            group: 'controls'
        },
        showDots: {
            type: 'boolean',
            label: 'Show Dots Indicator',
            default: true,
            group: 'controls'
        },
        showCounter: {
            type: 'boolean',
            label: 'Show Item Counter',
            default: false,
            group: 'controls'
        }
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

            // Helper: Detect if URL is video
            const isVideoUrl = (url) => {
                return /\.(mp4|webm|ogg|mov)$/i.test(url);
            };

            // Helper: Get media src from item
            const getMediaSrc = (item) => {
                const media = item.querySelector('img, video, video source');
                let src = '';
                if (media) {
                    if (media.tagName === 'IMG') {
                        src = media.getAttribute('src') || '';
                    } else if (media.tagName === 'VIDEO') {
                        src = media.getAttribute('src') ||
                            media.querySelector('source')?.getAttribute('src') || '';
                    } else if (media.tagName === 'SOURCE') {
                        src = media.getAttribute('src') || '';
                    }
                }
                return src;
            };

            // Helper: Switch media type based on URL
            const switchMediaType = (item, url, onChange) => {
                const mediaWrapper = item.querySelector('.item-media');
                const isVideo = isVideoUrl(url);
                const currentMedia = mediaWrapper.querySelector('img, video');
                const currentIsVideo = currentMedia?.tagName === 'VIDEO';

                if (isVideo && !currentIsVideo) {
                    // Switch to video
                    const video = document.createElement('video');
                    // video.controls = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.autoplay = true;
                    // setTimeout(() => {
                    //     const p = video.play();
                    //     if (p && p.catch) p.catch(() => {});
                    // }, 50);
                    const source = document.createElement('source');
                    source.src = url;
                    source.type = 'video/' + url.split('.').pop().toLowerCase();
                    video.appendChild(source);
                    mediaWrapper.innerHTML = '';
                    mediaWrapper.appendChild(video);
                    onChange?.();
                } else if (!isVideo && currentIsVideo) {
                    // Switch to image
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = item.querySelector('.item-title')?.textContent || '';
                    mediaWrapper.innerHTML = '';
                    mediaWrapper.appendChild(img);
                    onChange?.();
                } else {
                    // Same type, just update src
                    if (currentMedia.tagName === 'IMG') {
                        currentMedia.src = url;
                    } else {
                        const source = currentMedia.querySelector('source');
                        if (source) {
                            source.src = url;
                            source.type = 'video/' + url.split('.').pop().toLowerCase();
                            currentMedia.load();
                        }
                    }
                    onChange?.();
                }
            };

            const container = document.createElement('div');
            const track = element.querySelector('.media-slider-track');
            const items = track ? track.querySelectorAll('.slider-item') : [];

            // Create item editor
            const createItemEditor = (item, itemIndex) => {
                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';
                itemEditor.dataset.itemId = item.dataset.itemId || `item-${Date.now()}-${itemIndex}`;
                item.dataset.itemId = itemEditor.dataset.itemId;

                // Item header
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.className = 'drag-handle';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;

                const thumb = document.createElement('img');
                const mediaSrc = getMediaSrc(item);
                thumb.src = mediaSrc || 'https://placehold.co/40x40?text=No+Media';
                thumb.className = 'item-thumb';
                thumb.onerror = () => {
                    thumb.src = 'https://placehold.co/40x40?text=Media';
                };

                const titleText = item.querySelector('.item-title')?.textContent || `Item ${itemIndex + 1}`;
                const itemTitle = document.createElement('span');
                itemTitle.textContent = titleText;

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.style.cssText = 'width: 45px; background: transparent;';
                deleteBtn.className = 'item-delete-btn';
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

                // Item body
                const itemBody = document.createElement('div');
                itemBody.className = 'item-body';
                itemBody.style.display = 'none';

                // Media URL input
                const mediaLabel = document.createElement('label');
                mediaLabel.textContent = 'Media URL';
                const mediaGroup = document.createElement('div');
                mediaGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';

                const mediaInput = document.createElement('input');
                mediaInput.type = 'text';
                mediaInput.placeholder = 'Image or video URL';
                mediaInput.style.cssText = 'flex: 1;';
                mediaInput.value = getMediaSrc(item) || '';

                mediaInput.addEventListener('input', () => {
                    const url = mediaInput.value.trim();
                    if (url) {
                        switchMediaType(item, url, onChange);
                        thumb.src = isVideoUrl(url) ? 'https://placehold.co/40x40?text=Video' : url;
                        thumb.onerror = () => {
                            thumb.src = 'https://placehold.co/40x40?text=Media';
                        };
                    }
                });

                const browseBtn = document.createElement('button');
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                browseBtn.style.cssText = 'width: 45px;';
                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    // Open file picker for both image and video
                    builder.openFilePicker('media', (url) => {
                        mediaInput.value = url;
                        switchMediaType(item, url, onChange);
                        thumb.src = isVideoUrl(url) ? 'https://placehold.co/40x40?text=Video' : url;
                        thumb.onerror = () => {
                            thumb.src = 'https://placehold.co/40x40?text=Media';
                        };
                    }, browseBtn);
                };

                mediaGroup.appendChild(mediaInput);
                mediaGroup.appendChild(browseBtn);

                // Title input
                const titleLabel = document.createElement('label');
                titleLabel.textContent = 'Title';
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.placeholder = 'Item title';
                titleInput.value = item.querySelector('.item-title')?.textContent || '';

                titleInput.addEventListener('input', () => {
                    let titleEl = item.querySelector('.item-title');
                    if (!titleEl && titleInput.value) {
                        titleEl = document.createElement('h3');
                        titleEl.className = 'item-title';
                        const content = item.querySelector('.item-content');
                        if (!content) {
                            const newContent = document.createElement('div');
                            newContent.className = 'item-content';
                            newContent.appendChild(titleEl);
                            item.appendChild(newContent);
                        } else {
                            content.prepend(titleEl);
                        }
                    }
                    if (titleEl) titleEl.textContent = titleInput.value;
                    itemTitle.textContent = titleInput.value || `Item ${itemIndex + 1}`;
                    
                    // Update alt text if it matches old title
                    const imgEl = item.querySelector('img');
                    if (imgEl) {
                        imgEl.alt = titleInput.value;
                    }
                    onChange?.();
                });

                // Description input
                const descLabel = document.createElement('label');
                descLabel.textContent = 'Description';
                const descInput = document.createElement('textarea');
                descInput.placeholder = 'Item description (optional)';
                descInput.rows = 3;
                descInput.value = item.querySelector('.item-description')?.textContent || '';

                let descTimer;
                descInput.addEventListener('input', () => {
                    clearTimeout(descTimer);
                    descTimer = setTimeout(() => {
                        let descEl = item.querySelector('.item-description');
                        if (!descEl && descInput.value) {
                            descEl = document.createElement('p');
                            descEl.className = 'item-description';
                            const content = item.querySelector('.item-content');
                            if (!content) {
                                const newContent = document.createElement('div');
                                newContent.className = 'item-content';
                                newContent.appendChild(descEl);
                                item.appendChild(newContent);
                            } else {
                                content.appendChild(descEl);
                            }
                        }
                        if (descEl) descEl.textContent = descInput.value;
                        onChange?.();
                    }, 400);
                });

                // Alt text input (only for images)
                const altLabel = document.createElement('label');
                altLabel.textContent = 'Alt Text (Accessibility)';
                const altInput = document.createElement('input');
                altInput.type = 'text';
                altInput.placeholder = 'Describe the image for screen readers';
                const imgEl = item.querySelector('img');
                altInput.value = imgEl?.alt || titleInput.value;

                altInput.addEventListener('input', () => {
                    const img = item.querySelector('img');
                    if (img) img.alt = altInput.value;
                    onChange?.();
                });

                // Link input
                const linkLabel = document.createElement('label');
                linkLabel.textContent = 'Link URL (Optional)';
                const linkInput = document.createElement('input');
                linkInput.type = 'text';
                linkInput.placeholder = 'https://example.com';
                const linkEl = item.querySelector('.item-content a.item-link');
                linkInput.value = linkEl?.href || '';

                // Link text input
                const linkTextLabel = document.createElement('label');
                linkTextLabel.textContent = 'Link Text';
                const linkTextInput = document.createElement('input');
                linkTextInput.type = 'text';
                linkTextInput.placeholder = 'Learn More';
                linkTextInput.value = linkEl?.textContent || 'Learn More →';

                linkInput.addEventListener('input', () => {
                    const url = linkInput.value.trim();
                    const content = item.querySelector('.item-content');
                    if (!content) return;
                    
                    const existingLink = content.querySelector('a.item-link');
                    
                    if (url && !existingLink) {
                        const a = document.createElement('a');
                        a.href = url;
                        a.className = 'item-link';
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.textContent = linkTextInput.value || 'Learn More →';
                        content.appendChild(a);
                    } else if (url && existingLink) {
                        existingLink.href = url;
                    } else if (!url && existingLink) {
                        existingLink.remove();
                    }
                    onChange?.();
                });

                linkTextInput.addEventListener('input', () => {
                    const content = item.querySelector('.item-content');
                    if (!content) return;
                    
                    const existingLink = content.querySelector('a.item-link');
                    if (existingLink) {
                        existingLink.textContent = linkTextInput.value || 'Learn More →';
                        onChange?.();
                    }
                });

                // Assemble item body
                itemBody.appendChild(mediaLabel);
                itemBody.appendChild(mediaGroup);
                itemBody.appendChild(titleLabel);
                itemBody.appendChild(titleInput);
                itemBody.appendChild(descLabel);
                itemBody.appendChild(descInput);
                
                // Only show alt text for images
                const currentMedia = item.querySelector('img, video');
                if (currentMedia?.tagName === 'IMG') {
                    itemBody.appendChild(altLabel);
                    itemBody.appendChild(altInput);
                }
                
                itemBody.appendChild(linkLabel);
                itemBody.appendChild(linkInput);
                itemBody.appendChild(linkTextLabel);
                itemBody.appendChild(linkTextInput);

                // Toggle
                itemHeader.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle') || e.target.closest('.item-delete-btn')) return;
                    const isOpen = itemBody.style.display === 'block';
                    itemBody.style.display = isOpen ? 'none' : 'block';
                });

                itemEditor.appendChild(itemHeader);
                itemEditor.appendChild(itemBody);

                return itemEditor;
            };

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';

            items.forEach((item, i) => {
                itemsContainer.appendChild(createItemEditor(item, i));
            });

            container.appendChild(itemsContainer);

            // Initialize SortableJS for items
            loadSortable().then((Sortable) => {
                new Sortable(itemsContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function() {
                        const editorItems = Array.from(itemsContainer.children);
                        const trackItems = Array.from(track.children);
                        const itemMap = new Map();
                        
                        trackItems.forEach(item => {
                            if (item.dataset.itemId) itemMap.set(item.dataset.itemId, item);
                        });

                        editorItems.forEach(editorItem => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);
                            if (actualItem) track.appendChild(actualItem);
                        });

                        onChange?.();
                    }
                });

                // Add CSS for sortable states
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

            // Add item button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Item';
            addBtn.className = 'add-item-btn';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newItem = document.createElement('div');
                newItem.className = 'slider-item';
                newItem.dataset.itemId = `item-${Date.now()}`;
                newItem.innerHTML = `
                    <div class="item-media">
                        <img src="https://placehold.co/800x450?text=New+Item" alt="New item">
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">New Item</h3>
                        <p class="item-description">Item description</p>
                    </div>
                `;
                track.appendChild(newItem);
                const editor = createItemEditor(newItem, itemsContainer.children.length);
                itemsContainer.appendChild(editor);
                onChange?.();
            };

            container.appendChild(addBtn);

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
                    padding: 12px;
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

            return container;
        }
    },

    mount: function(element, options) {
        const opts = {
            itemsPerSlide: parseInt(options.itemsPerSlide) || 1,
            gap: parseInt(options.gap) || 16,
            aspectRatio: options.aspectRatio || '16/9',
            accentColor: options.accentColor || '#0066cc',
            autoplay: options.autoplay === true || options.autoplay === 'true',
            autoplaySpeed: parseInt(options.autoplaySpeed) || 5000,
            loop: options.loop !== false && options.loop !== 'false',
            pauseOnHover: options.pauseOnHover !== false && options.pauseOnHover !== 'false',
            showArrows: options.showArrows !== false && options.showArrows !== 'false',
            showDots: options.showDots !== false && options.showDots !== 'false',
            showCounter: options.showCounter === true || options.showCounter === 'true'
        };

        const track = element.querySelector('.media-slider-track');
        const items = track.querySelectorAll('.slider-item');
        
        if (items.length === 0) return {};

        let currentIndex = 0;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        // Apply styles
        element.style.cssText = `
            position: relative;
            overflow: hidden;
        `;

        track.style.cssText = `
            display: flex;
            gap: ${opts.gap}px;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
        `;

        // Calculate item width based on itemsPerSlide and gap
        const itemWidth = `calc((100% - ${opts.gap * (opts.itemsPerSlide - 1)}px) / ${opts.itemsPerSlide})`;
        
        items.forEach(item => {
            item.style.cssText = `
                flex-shrink: 0;
                width: ${itemWidth};
            `;

            const media = item.querySelector('.item-media');
            if (media && opts.aspectRatio !== 'auto') {
                media.style.aspectRatio = opts.aspectRatio;
            }
        });

        // Navigation
        const goToIndex = (index) => {
            currentIndex = Math.max(0, Math.min(index, items.length - opts.itemsPerSlide));
            
            // Use pixel-based calculation for precision
            if (items.length > 0) {
                const firstItem = items[0];
                const itemWidth = firstItem.offsetWidth;
                const totalGap = opts.gap;
                const moveDistance = currentIndex * (itemWidth + totalGap);
                
                track.style.transform = `translateX(-${moveDistance}px)`;
            }
            
            updateControls();
            
            // Announce to screen readers
            const liveRegion = element.querySelector('.slider-live-region');
            if (liveRegion) {
                liveRegion.textContent = `Showing items ${currentIndex + 1} to ${Math.min(currentIndex + opts.itemsPerSlide, items.length)} of ${items.length}`;
            }
        };

        const nextSlide = () => {
            if (currentIndex < items.length - opts.itemsPerSlide) {
                goToIndex(currentIndex + 1);
            } else if (opts.loop) {
                goToIndex(0);
            }
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                goToIndex(currentIndex - 1);
            } else if (opts.loop) {
                goToIndex(items.length - opts.itemsPerSlide);
            }
        };

        // Controls
        const updateControls = () => {
            if (opts.showArrows) {
                const prevBtn = element.querySelector('.slider-prev');
                const nextBtn = element.querySelector('.slider-next');
                
                if (!opts.loop) {
                    prevBtn.disabled = currentIndex === 0;
                    nextBtn.disabled = currentIndex >= items.length - opts.itemsPerSlide;
                }
            }

            if (opts.showDots) {
                const dots = element.querySelectorAll('.slider-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                    dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
                });
            }

            if (opts.showCounter) {
                const counter = element.querySelector('.slider-counter');
                if (counter) {
                    counter.textContent = `${currentIndex + 1}-${Math.min(currentIndex + opts.itemsPerSlide, items.length)} / ${items.length}`;
                }
            }
        };

        // Create controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'slider-controls';

        // Arrows
        if (opts.showArrows && items.length > opts.itemsPerSlide) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-prev';
            prevBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            `;
            prevBtn.setAttribute('aria-label', 'Previous items');
            prevBtn.onclick = () => {
                prevSlide();
                resetAutoplay();
            };

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-next';
            nextBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            `;
            nextBtn.setAttribute('aria-label', 'Next items');
            nextBtn.onclick = () => {
                nextSlide();
                resetAutoplay();
            };

            element.appendChild(prevBtn);
            element.appendChild(nextBtn);
        }

        // Dots
        if (opts.showDots && items.length > opts.itemsPerSlide) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            dotsContainer.setAttribute('role', 'tablist');
            dotsContainer.setAttribute('aria-label', 'Item navigation');

            const totalDots = items.length - opts.itemsPerSlide + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Go to item ${i + 1}`);
                dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
                dot.onclick = () => {
                    goToIndex(i);
                    resetAutoplay();
                };
                dotsContainer.appendChild(dot);
            }

            controlsContainer.appendChild(dotsContainer);
        }

        // Counter
        if (opts.showCounter) {
            const counter = document.createElement('div');
            counter.className = 'slider-counter';
            counter.setAttribute('aria-live', 'polite');
            counter.textContent = `1-${Math.min(opts.itemsPerSlide, items.length)} / ${items.length}`;
            controlsContainer.appendChild(counter);
        }

        element.appendChild(controlsContainer);

        // Live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.className = 'slider-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        element.appendChild(liveRegion);

        // Helper: Convert any color format to RGB values
        const parseColor = (color) => {
            // Create a temporary element to parse the color
            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);
            const computed = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            
            // Extract RGB values from computed style (returns "rgb(r, g, b)" or "rgba(r, g, b, a)")
            const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3])
                };
            }
            return { r: 0, g: 102, b: 204 }; // fallback to default blue
        };

        // Helper: Convert RGB to HSL
        const rgbToHsl = (r, g, b) => {
            r /= 255;
            g /= 255;
            b /= 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }

            return { h: h * 360, s: s * 100, l: l * 100 };
        };

        // Helper: Convert HSL to RGB
        const hslToRgb = (h, s, l) => {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        };

        // Helper: Lighten a color by increasing lightness
        const lightenColor = (color, amount = 25) => {
            const rgb = parseColor(color);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            // Increase lightness, cap at 90% to avoid white
            hsl.l = Math.min(90, hsl.l + amount);
            
            const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
        };

        // Apply accent color via CSS custom property
        const accentColorLight = lightenColor(opts.accentColor, 25);
        element.style.setProperty('--accent-color', opts.accentColor);
        element.style.setProperty('--accent-color-light', accentColorLight);

        // Autoplay
        const startAutoplay = () => {
            stopAutoplay(); // Clear any existing timer first
            if (opts.autoplay && items.length > opts.itemsPerSlide) {
                autoplayTimer = setInterval(nextSlide, opts.autoplaySpeed);
            }
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        const resetAutoplay = () => {
            if (opts.autoplay && items.length > opts.itemsPerSlide) {
                stopAutoplay();
                // Add a small delay before restarting to prevent immediate firing
                setTimeout(startAutoplay, 100);
            }
        };

        // Touch support
        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            const diff = touchStartX - touchEndX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        };

        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchmove', handleTouchMove, { passive: true });
        track.addEventListener('touchend', handleTouchEnd);

        // Keyboard navigation
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', 'Media slider');
        element.setAttribute('aria-roledescription', 'carousel');

        element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoplay();
            }
        });

        // Pause on hover
        if (opts.pauseOnHover) {
            element.addEventListener('mouseenter', stopAutoplay);
            element.addEventListener('mouseleave', startAutoplay);
        }

        // Initialize
        goToIndex(0); // Set initial position
        updateControls();
        startAutoplay();

        // Cleanup
        return {
            destroy: () => {
                stopAutoplay();
                track.removeEventListener('touchstart', handleTouchStart);
                track.removeEventListener('touchmove', handleTouchMove);
                track.removeEventListener('touchend', handleTouchEnd);
            }
        };
    },

    unmount: function(element, instance) {
        if (instance && instance.destroy) {
            instance.destroy();
        }
    }
};