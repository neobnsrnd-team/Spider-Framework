/*
Usage:
<div data-cb-type="card-list" data-cb-items-per-row="2" data-cb-gap="26" data-cb-aspect-ratio="16/9" data-cb-accent-color="#3b82f6" tabindex="0" role="region" aria-label="Card list" style="position: relative; --accent-color: #3b82f6; --accent-color-light: rgb(181, 208, 252);">
    <div class="card-list-grid">
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-cvlfg.jpg" alt="Sample Title 1">
            </div>
            <div class="item-content">
                <h3 class="item-title">Sample Title 1</h3>
                <p class="item-description">Description</p>
                <a href="/product/1" class="item-link">Learn More →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-XUe84.jpg" alt="Sample Title 2">
            </div>
            <div class="item-content">
                <h3 class="item-title">Sample Title 2</h3>
                <p class="item-description">Description</p>
                <a href="/product/2" class="item-link">Learn More →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-HzKor.jpg" alt="Sample Title 3">
            </div>
            <div class="item-content">
                <h3 class="item-title">Sample Title 3</h3>
                <p class="item-description">Description</p>
                <a href="/product/3" class="item-link">Learn More →</a>
            </div>
        </div>
        <div class="card-item">
            <div class="item-media">
                <img src="assets/minimalist-blocks/images/ai-iNSwQ.jpg" alt="Sample Title 4">
            </div>
            <div class="item-content">
                <h3 class="item-title">Sample Title 4</h3>
                <p class="item-description">Description</p>
                <a href="/product/4" class="item-link">Learn More →</a>
            </div>
        </div>
    </div>
</div>
*/

export default {
    name: 'card-list',
    displayName: 'Card List',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'layout',
                label: 'Layout Settings',
                fields: ['itemsPerRow', 'gap', 'aspectRatio']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['accentColor']
            }
        ],
        itemsPerRow: {
            type: 'number',
            label: 'Items Per Row',
            default: 3,
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
        }
    },

    editor: {
        // PATTERN: Load external library on-demand (Sortable.js for drag & drop)
        // Check if already loaded to avoid duplicate script tags
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

            // PATTERN: Helper function to detect if URL is video
            const isVideoUrl = (url) => {
                return /\.(mp4|webm|ogg|mov)$/i.test(url);
            };

            // PATTERN: Helper to extract media source from various element structures
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

            // PATTERN: Helper to switch media type based on URL
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

            // PATTERN: Container element for custom editor
            const container = document.createElement('div');
            // No container styling needed - builder automatically handles panel layout
            
            const grid = element.querySelector('.card-list-grid');
            const items = grid ? grid.querySelectorAll('.card-item') : [];

            // PATTERN: Factory function to create editor UI for each card item
            const createItemEditor = (item, itemIndex) => {
                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';
                // No inline styling needed - all styles defined in <style> block below
                
                itemEditor.dataset.itemId = item.dataset.itemId || `item-${Date.now()}-${itemIndex}`; // PATTERN: Always use itemId
                item.dataset.itemId = itemEditor.dataset.itemId;

                // PATTERN: Collapsible header with drag handle, thumbnail, title, and delete button
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

                // PATTERN: Drag handle for sortable items (styled with inline CSS)
                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.className = 'drag-handle';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;

                // PATTERN: Thumbnail preview in header
                const thumb = document.createElement('img');
                const mediaSrc = getMediaSrc(item);
                thumb.src = mediaSrc || 'https://placehold.co/40x40?text=No+Media';
                thumb.className = 'item-thumb';
                thumb.onerror = () => {
                    thumb.src = 'https://placehold.co/40x40?text=Media';
                };

                // PATTERN: Display item title or fallback in header
                const titleText = item.querySelector('.item-title')?.textContent || `Item ${itemIndex + 1}`;
                const itemTitle = document.createElement('span');
                itemTitle.textContent = titleText;

                const deleteBtn = document.createElement('button');
                deleteBtn.style.cssText = 'width: 45px; background: transparent; color: #dc2626;';
                deleteBtn.className = 'item-delete-btn';
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.setAttribute('aria-label', 'Delete link');
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

                // PATTERN: Collapsible body containing all form fields (hidden by default)
                const itemBody = document.createElement('div');
                itemBody.className = 'item-body';
                itemBody.style.display = 'none';

                // PATTERN: Media URL input with browse button
                const mediaLabel = document.createElement('label');
                mediaLabel.textContent = 'Media URL';
                const mediaGroup = document.createElement('div');
                mediaGroup.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';

                // PATTERN: Text input for media URL
                const mediaInput = document.createElement('input');
                mediaInput.type = 'text';
                mediaInput.placeholder = 'Image or video URL';
                // Only add custom styles when needed - builder handles default input UI
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

                // PATTERN: Browse button with file picker integration
                const browseBtn = document.createElement('button');
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                browseBtn.style.cssText = 'width: 45px;';
                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    // Use 'media' type to allow both image and video selection
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

                // PATTERN: Text input for title with real-time DOM updates
                // Builder handles default label styling - no custom styles needed
                const titleLabel = document.createElement('label');
                titleLabel.textContent = 'Title';
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.placeholder = 'Item title';
                titleInput.value = item.querySelector('.item-title')?.textContent || '';

                // PATTERN: Update both DOM element and header title on input
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

                // PATTERN: Textarea for description with debounced updates
                const descLabel = document.createElement('label');
                descLabel.textContent = 'Description';
                const descInput = document.createElement('textarea');
                descInput.placeholder = 'Item description (optional)';
                descInput.rows = 3;
                descInput.value = item.querySelector('.item-description')?.textContent || '';

                // PATTERN: Debounce input to avoid excessive DOM updates while typing
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

                // PATTERN: Alt text input for accessibility (image only)
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

                // PATTERN: Optional link URL input
                const linkLabel = document.createElement('label');
                linkLabel.textContent = 'Link URL (Optional)';
                const linkInput = document.createElement('input');
                linkInput.type = 'text';
                linkInput.placeholder = 'https://example.com';
                const linkEl = item.querySelector('.item-content a.item-link');
                linkInput.value = linkEl?.href || '';

                // PATTERN: Link text input (customizes the clickable text)
                const linkTextLabel = document.createElement('label');
                linkTextLabel.textContent = 'Link Text';
                const linkTextInput = document.createElement('input');
                linkTextInput.type = 'text';
                linkTextInput.placeholder = 'Learn More';
                linkTextInput.value = linkEl?.textContent || 'Learn More →';

                // PATTERN: Create or update link element when URL changes
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

                // PATTERN: Assemble all form fields into collapsible body
                itemBody.appendChild(mediaLabel);
                itemBody.appendChild(mediaGroup);
                itemBody.appendChild(titleLabel);
                itemBody.appendChild(titleInput);
                itemBody.appendChild(descLabel);
                itemBody.appendChild(descInput);
                
                // PATTERN: Conditionally show alt text field for images only
                const currentMedia = item.querySelector('img, video');
                if (currentMedia?.tagName === 'IMG') {
                    itemBody.appendChild(altLabel);
                    itemBody.appendChild(altInput);
                }
                
                itemBody.appendChild(linkLabel);
                itemBody.appendChild(linkInput);
                itemBody.appendChild(linkTextLabel);
                itemBody.appendChild(linkTextInput);

                // PATTERN: Click header to toggle visibility of item body (except drag handle and delete)
                itemHeader.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle') || e.target.closest('.item-delete-btn')) return;
                    const isOpen = itemBody.style.display === 'block';
                    itemBody.style.display = isOpen ? 'none' : 'block';
                });

                itemEditor.appendChild(itemHeader);
                itemEditor.appendChild(itemBody);

                return itemEditor;
            };

            // PATTERN: Create container for all item editors
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';

            // PATTERN: Generate editor UI for each existing item
            items.forEach((item, i) => {
                itemsContainer.appendChild(createItemEditor(item, i));
            });

            container.appendChild(itemsContainer);

            // PATTERN: Initialize drag-and-drop sorting with Sortable.js
            loadSortable().then((Sortable) => {
                new Sortable(itemsContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function() {
                        const editorItems = Array.from(itemsContainer.children);
                        const gridItems = Array.from(grid.children);
                        const itemMap = new Map();
                        
                        gridItems.forEach(item => {
                            if (item.dataset.itemId) itemMap.set(item.dataset.itemId, item);
                        });

                        editorItems.forEach(editorItem => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);
                            if (actualItem) grid.appendChild(actualItem);
                        });

                        onChange?.();
                    }
                });

                // PATTERN: Add visual feedback styles for drag states
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

            // PATTERN: Add button to create new items dynamically
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Item';
            addBtn.className = 'add-item-btn';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newItem = document.createElement('div');
                newItem.className = 'card-item';
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
                grid.appendChild(newItem);
                const editor = createItemEditor(newItem, itemsContainer.children.length);
                itemsContainer.appendChild(editor);
                onChange?.();
            };

            container.appendChild(addBtn);

            // PATTERN: Scoped styles for custom editor UI
            // These are reusable style patterns for item-based editor interfaces
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

    // PATTERN: mount function applies runtime behavior and styling
    mount: function(element, options) {
        // Parse and set default values for plugin options
        const opts = {
            itemsPerRow: parseInt(options.itemsPerRow) || 3,
            gap: parseInt(options.gap) || 16,
            aspectRatio: options.aspectRatio || '16/9',
            accentColor: options.accentColor || '#0066cc'
        };

        const grid = element.querySelector('.card-list-grid');
        const items = grid.querySelectorAll('.card-item');
        
        if (items.length === 0) return {};

        // Apply styles to element
        element.style.cssText = `
            position: relative;
        `;

        // Apply grid styles
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${opts.itemsPerRow}, 1fr);
            gap: ${opts.gap}px;
        `;

        // Apply aspect ratio to items
        items.forEach(item => {
            const media = item.querySelector('.item-media');
            if (media && opts.aspectRatio !== 'auto') {
                media.style.aspectRatio = opts.aspectRatio;
            }
        });

        // Helper: Convert any color format to RGB values
        const parseColor = (color) => {
            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);
            const computed = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            
            const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3])
                };
            }
            return { r: 0, g: 102, b: 204 };
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
            
            hsl.l = Math.min(90, hsl.l + amount);
            
            const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
        };

        // PATTERN: Apply accent color using CSS custom properties for theming
        // This allows the CSS to reference --accent-color and --accent-color-light
        const accentColorLight = lightenColor(opts.accentColor, 25);
        element.style.setProperty('--accent-color', opts.accentColor);
        element.style.setProperty('--accent-color-light', accentColorLight);

        // PATTERN: Add accessibility attributes for keyboard navigation
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', 'Card list');

        return {};
    },

    unmount: function(element, instance) {
        // No cleanup needed for static grid
    }
};