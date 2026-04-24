export default {
    name: 'media-grid',
    displayName: 'Media Grid',
    version: '1.1.0',

    contentbox: {
        // configure contentbox panel
        bgImage: false,
        boxTabContent: false,
        boxTabOnClick: false,
    },

    settings: {
        columns: {
            type: 'range',
            label: 'Columns',
            default: 3,
            min: 1,
            max: 6,
            step: 1
        },
        gap: {
            type: 'number',
            label: 'Gap',
            default: 16,
            min: 0,
            max: 48,
            step: 1,
            unit: 'px'
        },
        padding: {
            type: 'number',
            label: 'Padding',
            default: 0,
            min: 0,
            max: 48,
            step: 1,
            unit: 'px'
        },
        rounded: {
            type: 'number',
            label: 'Rounded Corners',
            default: 8,
            min: 0,
            max: 24,
            step: 1,
            unit: 'px'
        },
        contentTheme: {
            type: 'select',
            label: 'Caption Theme',
            default: 'dark',
            options: [
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' }
            ]
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
                        // Use raw attribute to preserve relative paths
                        src = media.getAttribute('src') || '';
                    } else if (media.tagName === 'VIDEO') {
                        // Try to get from video tag first, then its source child
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
                const mediaWrapper = item;
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
            const items = element.querySelectorAll('.gallery-item');

            const createItemEditor = (item, itemIndex) => {
                item.dataset.itemId = item.dataset.itemId || `item-${Date.now()}-${itemIndex}`;

                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';
                itemEditor.dataset.itemId = item.dataset.itemId; 

                const img = item.querySelector('img');
                const content = item.querySelector('.item-content');
                const titleEl = content?.querySelector('h4');
                const descEl = content?.querySelector('div');

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

                // --- Image ---
                const thumb = document.createElement('img');
                thumb.src = img?.src || 'https://placehold.co/60x60?text=No+Img';
                thumb.className = 'item-thumb';
                thumb.onerror = () => {
                    thumb.src = 'https://placehold.co/40x40?text=Media';
                };

                // --- Delete ---
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

                const div = document.createElement('div');
                div.style.cssText = 'display:flex; align-items: center';
                div.appendChild(dragHandle);
                div.appendChild(thumb);
                itemHeader.appendChild(div);
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

                const constructContent = (item) => {
                    const content = document.createElement('div');
                    content.className = 'item-content';
                    item.appendChild(content);
                    return content;
                }
                const cleanupContent = (item) => {
                    if(titleInput.value==='' && descInput.value==='' && linkInput.value==='') {
                        const content = item.querySelector('.item-content');
                        if(content) content.remove();
                    }
                }
                const enforceContentOrder = (content) => {
                    const h4 = content.querySelector('h4');
                    const div = content.querySelector('div');
                    const link = content.querySelector('a.item-link');

                    // Desired order
                    const ordered = [h4, div, link].filter(Boolean);

                    ordered.forEach(el => content.appendChild(el)); // appending again reorders without duplication
                };
                const setTitle = (item, title) => {
                    let content = item.querySelector('.item-content') || constructContent(item);
                    let h4 = content.querySelector('h4');
                    if (!h4) {
                        h4 = document.createElement('h4');
                        content.appendChild(h4);
                    }
                    h4.textContent = title;

                    enforceContentOrder(content);
                    cleanupContent(item);
                };
                const setDesc = (item, desc) => {
                    let content = item.querySelector('.item-content') || constructContent(item);
                    let div = content.querySelector('div');
                    if (!div) {
                        div = document.createElement('div');
                        content.appendChild(div);
                    }
                    div.textContent = desc;

                    enforceContentOrder(content);
                    cleanupContent(item);
                };

                // Title input
                const titleLabel = document.createElement('label');
                titleLabel.textContent = 'Title';
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.placeholder = 'Caption title';
                titleInput.value = titleEl?.textContent || '';
                titleInput.addEventListener('input', () => {
                    setTitle(item, titleInput.value);
                    onChange();
                });

                // Description input
                const descLabel = document.createElement('label');
                descLabel.textContent = 'Description';
                const descInput = document.createElement('textarea');
                descInput.placeholder = 'Caption description';
                descInput.value = descEl?.textContent || '';
                descInput.style.cssText = 'height: 140px;';
                descInput.addEventListener('input', () => {
                    setDesc(item, descInput.value);
                    onChange();
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
                    let content = item.querySelector('.item-content') || constructContent(item);
                    
                    const existingLink = content.querySelector('a.item-link');
                    
                    if (url && !existingLink) {
                        const a = document.createElement('a');
                        a.href = url;
                        a.className = 'item-link';
                        // a.target = '_blank';
                        // a.rel = 'noopener noreferrer';
                        a.textContent = linkTextInput.value || 'Learn More →';
                        content.appendChild(a);
                    } else if (url && existingLink) {
                        existingLink.href = url;
                    } else if (!url && existingLink) {
                        existingLink.remove();
                    }
                    enforceContentOrder(content);
                    cleanupContent(item);
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

                itemBody.appendChild(mediaLabel);
                itemBody.appendChild(mediaGroup);

                // --- Lightbox URL (only for images) ---
                const currentMediaEl = item.querySelector('img, video');
                if (currentMediaEl?.tagName === 'IMG') {
                    const lightboxLabel = document.createElement('label');
                    lightboxLabel.textContent = 'Open in a lightbox:';

                    const lightboxGroup = document.createElement('div');
                    lightboxGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';

                    const lightboxInput = document.createElement('input');
                    lightboxInput.type = 'text';
                    lightboxInput.placeholder = 'Image URL for lightbox';
                    lightboxInput.style.cssText = 'flex: 1;';

                    // Detect if image is already wrapped
                    const existingWrap = item.querySelector('a.is-lightbox');
                    if (existingWrap) {
                        lightboxInput.value = existingWrap.getAttribute('href') || '';
                    }

                    const lightboxBrowseBtn = document.createElement('button');
                    lightboxBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                    lightboxBrowseBtn.style.cssText = 'width: 45px;';

                    // Function to update wrapping
                    const updateLightboxLink = (url) => {
                        const img = item.querySelector('img');
                        if (!img) return;

                        const currentWrap = img.closest('a.is-lightbox');
                        if (url) {
                            if (currentWrap) {
                                currentWrap.href = url;
                            } else {
                                const wrapper = document.createElement('a');
                                wrapper.href = url;
                                wrapper.className = 'is-lightbox';
                                wrapper.appendChild(img.cloneNode(true));
                                img.replaceWith(wrapper);
                            }
                        } else if (currentWrap) {
                            currentWrap.replaceWith(currentWrap.querySelector('img'));
                        }
                        onChange?.();
                    };

                    // Manual input
                    lightboxInput.addEventListener('input', () => {
                        const url = lightboxInput.value.trim();
                        updateLightboxLink(url);
                    });

                    // File picker
                    lightboxBrowseBtn.onclick = (e) => {
                        e.preventDefault();
                        builder.openFilePicker('media', (url) => {
                            lightboxInput.value = url;
                            updateLightboxLink(url);
                        }, lightboxBrowseBtn);
                    };

                    lightboxGroup.appendChild(lightboxInput);
                    lightboxGroup.appendChild(lightboxBrowseBtn);

                    itemBody.appendChild(lightboxLabel);
                    itemBody.appendChild(lightboxGroup);
                }

                // Assemble item body
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

            items.forEach((item, i) => {
                container.appendChild(createItemEditor(item, i));
            });

            // Initialize SortableJS for items
            loadSortable().then((Sortable) => {
                new Sortable(container, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function() {
                        const editorItems = Array.from(container.children);
                        const gridItems = Array.from(element.querySelectorAll('.gallery-item'));
                        const itemMap = new Map();

                        // Map existing gallery items by their data-item-id
                        gridItems.forEach(item => {
                            if (item.dataset.itemId) itemMap.set(item.dataset.itemId, item);
                        });

                        // Reorder .gallery-item elements inside the grid container
                        editorItems.forEach(editorItem => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);
                            if (actualItem) element.appendChild(actualItem);
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
                newItem.dataset.itemId = `item-${Date.now()}`;
                newItem.className = 'gallery-item';
                newItem.innerHTML = `<img src="https://placehold.co/600x800?text=New+Image" alt="">`;

                element.appendChild(newItem);
                const editor = createItemEditor(newItem);
                container.insertBefore(editor, addBtn);
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
        const cols = Math.max(1, Math.min(6, parseInt(options.columns) || 3));
        const gap = Math.max(0, Math.min(48, isNaN(parseInt(options.gap)) ? 16 : parseInt(options.gap)));
        const padding = Math.max(0, Math.min(48, isNaN(parseInt(options.padding)) ? 0 : parseInt(options.padding)));
        const rounded = Math.max(0, Math.min(24, isNaN(parseInt(options.rounded)) ? 8 : parseInt(options.rounded)));
        const contentTheme = options.contentTheme === 'light' ? 'light' : 'dark';
        
        element.style.setProperty('--column-count', cols);
        element.style.setProperty('--column-gap', gap + 'px');
        element.style.setProperty('--padding', padding + 'px');
        element.style.setProperty('--border-radius', rounded + 'px');

        if(contentTheme === 'light') {
            element.style.setProperty('--caption-background', 'rgba(255, 255, 255, 0.96)');
            element.style.setProperty('--caption-color', '#000');
        } else {
            element.style.setProperty('--caption-background', 'rgba(0, 0, 0, 0.45)');
            element.style.setProperty('--caption-color', 'white');
        }

        return {};
    }
};