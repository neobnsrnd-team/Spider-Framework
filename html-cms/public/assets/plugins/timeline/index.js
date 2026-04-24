export default {
    name: 'timeline',
    displayName: 'Interactive Timeline',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'layout',
                label: 'Layout',
                fields: ['orientation', 'animate']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['accentColor', 'lineWidth', 'dotSize']
            }
        ],

        orientation: {
            type: 'select',
            label: 'Orientation',
            default: 'vertical',
            options: [
                { value: 'vertical', label: 'Vertical' },
                { value: 'horizontal', label: 'Horizontal' }
            ],
            group: 'layout'
        },
        animate: {
            type: 'boolean',
            label: 'Animate on Scroll',
            default: true,
            group: 'layout'
        },
        accentColor: {
            type: 'color',
            label: 'Accent Color',
            default: '#3b82f6',
            group: 'appearance'
        },
        lineWidth: {
            type: 'number',
            label: 'Line Width',
            default: 2,
            min: 1,
            max: 6,
            step: 1,
            unit: 'px',
            group: 'appearance'
        },
        dotSize: {
            type: 'number',
            label: 'Dot Size',
            default: 12,
            min: 8,
            max: 24,
            step: 2,
            unit: 'px',
            group: 'appearance'
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: 25px;
            `;
            const items = element.querySelectorAll('.timeline-item');

            const createItemEditor = (item, index) => {
                const section = document.createElement('div');
                section.dataset.itemId = item.dataset.itemId || `item-${Date.now()}-${index}`;
                item.dataset.itemId = section.dataset.itemId;

                // Header
                const header = document.createElement('div');

                const title = item.querySelector('.timeline-title')?.textContent || `Event ${index + 1}`;
                const date = item.querySelector('.timeline-date')?.textContent || '';

                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;
                dragHandle.className = 'drag-handle';

                const left = document.createElement('div');
                left.style.display = 'flex';
                left.style.alignItems = 'center';
                left.style.gap = '8px';

                const headerText = document.createElement('div');
                headerText.style.display = 'flex';
                headerText.style.flexDirection = 'column';
                headerText.style.gap = '2px';

                const headerTitle = document.createElement('span');
                headerTitle.textContent = title;
                headerTitle.style.fontSize = '14px';

                const headerDate = document.createElement('span');
                headerDate.textContent = date;
                headerDate.style.cssText = 'font-size: 11px; opacity: 0.6; font-weight: 400;';

                headerText.appendChild(headerTitle);
                headerText.appendChild(headerDate);

                left.appendChild(dragHandle);
                left.appendChild(headerText);

                const toggle = document.createElement('span');
                toggle.innerHTML = '<svg style="width: 20px; height: 20px; transform: rotate(360deg); transition: all 0.2s ease"><use xlink:href="#icon-chevron-down"></use></svg>';

                header.appendChild(left);
                header.appendChild(toggle);

                // Body
                const body = document.createElement('div');
                body.style.cssText = `
                    padding: 12px;
                    display: none;
                `;

                // Date input
                const dateInput = document.createElement('input');
                dateInput.type = 'text';
                dateInput.placeholder = 'Date (e.g., Q1 2024, Jan 2024)';
                dateInput.value = date;
                dateInput.style.cssText = 'width: 100%; margin-bottom: 8px; font-size: 13px;';

                dateInput.addEventListener('input', () => {
                    const dateEl = item.querySelector('.timeline-date');
                    if (dateEl) {
                        dateEl.textContent = dateInput.value;
                        headerDate.textContent = dateInput.value;
                    }
                    onChange?.();
                });

                // Title input
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.placeholder = 'Title';
                titleInput.value = title;
                titleInput.style.cssText = 'width: 100%; margin-bottom: 8px; font-size: 13px;';

                titleInput.addEventListener('input', () => {
                    const titleEl = item.querySelector('.timeline-title');
                    if (titleEl) {
                        titleEl.textContent = titleInput.value;
                        headerTitle.textContent = titleInput.value || 'Untitled Event';
                    }
                    onChange?.();
                });

                // Description textarea
                const descInput = document.createElement('textarea');
                descInput.placeholder = 'Description';
                descInput.value = item.querySelector('.timeline-desc')?.textContent || '';
                descInput.rows = 4;
                descInput.style.cssText = 'width: 100%; margin-bottom: 8px; font-size: 13px; resize: vertical;';

                let descTimer;
                descInput.addEventListener('input', () => {
                    clearTimeout(descTimer);
                    descTimer = setTimeout(() => {
                        const descEl = item.querySelector('.timeline-desc');
                        if (descEl) {
                            descEl.textContent = descInput.value;
                        }
                        onChange?.();
                    }, 400);
                });

                // Status select
                const statusLabel = document.createElement('label');
                statusLabel.textContent = 'Status';
                statusLabel.style.cssText = 'display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #333;';

                const statusSelect = document.createElement('select');
                statusSelect.style.cssText = 'width: 100%; margin-bottom: 12px; padding: 6px; font-size: 13px;';
                
                const statuses = [
                    { value: 'completed', label: '✓ Completed' },
                    { value: 'current', label: '→ Current' },
                    { value: 'upcoming', label: '○ Upcoming' }
                ];

                statuses.forEach(status => {
                    const option = document.createElement('option');
                    option.value = status.value;
                    option.textContent = status.label;
                    statusSelect.appendChild(option);
                });

                const currentStatus = item.dataset.status || 'upcoming';
                statusSelect.value = currentStatus;

                statusSelect.addEventListener('change', () => {
                    item.dataset.status = statusSelect.value;
                    onChange?.();
                });

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                // deleteBtn.style.cssText = 'width: 100%; padding: 8px; background: #fee; color: #c00; border: 1px solid #fcc; border-radius: 4px; cursor: pointer;';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    item.remove();
                    section.remove();
                    onChange?.();
                };

                body.appendChild(dateInput);
                body.appendChild(titleInput);
                body.appendChild(descInput);
                body.appendChild(statusLabel);
                body.appendChild(statusSelect);
                body.appendChild(deleteBtn);

                // Toggle logic
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle')) return;
                    const open = body.style.display === 'block';
                    body.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    icon.style.transform = open ? 'rotate(360deg)' : 'rotate(180deg)';
                });

                section.appendChild(header);
                section.appendChild(body);

                return section;
            };

            // Sortable container
            const sortableContainer = document.createElement('div');
            sortableContainer.className = 'sortable-timeline-container is-accordion';

            items.forEach((item, i) => {
                sortableContainer.appendChild(createItemEditor(item, i));
            });

            container.appendChild(sortableContainer);

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

            loadSortable().then((Sortable) => {
                new Sortable(sortableContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function(evt) {
                        const editorItems = Array.from(sortableContainer.children).filter(c => c.dataset.itemId);

                        // target DIV wrapper
                        let elementItems = Array.from(element.children[0].children);
                        
                        const itemMap = new Map();
                        elementItems.forEach(item => {
                            const itemId = item.dataset.itemId;
                            if (itemId) itemMap.set(itemId, item);
                        });

                        editorItems.forEach((editorItem) => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);

                            // target DIV wrapper
                            if (actualItem && actualItem.parentElement === element.children[0]) {
                                element.children[0].appendChild(actualItem);
                            }
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

            // Add Item button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Timeline Item';
            addBtn.style.cssText = 'width: 100%; padding: 10px; margin-top: 10px;';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newItem = document.createElement('div');
                newItem.className = 'timeline-item';
                newItem.dataset.itemId = `item-${Date.now()}`;
                newItem.dataset.status = 'upcoming';
                newItem.innerHTML = `
                    <div class="timeline-marker" aria-hidden="true"></div>
                    <div class="timeline-content">
                        <span class="timeline-date">TBD</span>
                        <h3 class="timeline-title">New Event</h3>
                        <p class="timeline-desc">Add description here</p>
                    </div>
                `;

                // target DIV wrapper
                const wrapper = element.firstElementChild;
                if (wrapper && wrapper.tagName === 'DIV') {
                    wrapper.appendChild(newItem);
                } else {
                    // Fallback: create wrapper if missing
                    const newWrapper = document.createElement('div');
                    element.appendChild(newWrapper);
                    newWrapper.appendChild(newItem);
                }

                // element.appendChild(newItem);
                const editor = createItemEditor(newItem, sortableContainer.children.length);
                sortableContainer.appendChild(editor);
                onChange?.();
            };

            container.appendChild(addBtn);
            return container;
        }
    },

    mount: function (element, options) {
        const orientation = options.orientation || 'vertical';
        const animate = options.animate !== false;
        const accentColor = options.accentColor || '#3b82f6';
        const lineWidth = options.lineWidth || 2;
        const dotSize = options.dotSize || 12;

        // Set CSS variables
        element.style.setProperty('--timeline-accent', accentColor);
        element.style.setProperty('--timeline-line-width', `${lineWidth}px`);
        element.style.setProperty('--timeline-dot-size', `${dotSize}px`);

        // Set orientation class
        element.classList.remove('timeline-vertical', 'timeline-horizontal');
        element.classList.add(`timeline-${orientation}`);

        // Intersection Observer for animations
        if (animate && 'IntersectionObserver' in window) {
            const items = element.querySelectorAll('.timeline-item');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('timeline-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            items.forEach(item => {
                item.classList.add('timeline-animated');
                observer.observe(item);
            });

            return {
                unmount: () => observer.disconnect()
            };
        }

        return {};
    }
};