export default {
    name: 'accordion',
    displayName: 'Accordion / FAQ',
    version: '1.0.0',

    settings: {
        allowMultiple: {
            type: 'boolean',
            label: 'Allow Multiple Open',
            default: false
        },
        openFirst: {
            type: 'boolean',
            label: 'Open First Item by Default',
            default: true
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            // Load SortableJS dynamically
            const loadSortable = () => {
                return new Promise((resolve, reject) => {
                    if (window.Sortable) {
                        resolve(window.Sortable);
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
                    script.onload = () => resolve(window.Sortable);
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            };

            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: 23px;
            `;
            const items = element.querySelectorAll('.accordion-item');

            // Collapsible Accordion Item Editor
            const createItemEditor = (item, index) => {
                const section = document.createElement('div');
                section.style.cssText = `
                    overflow: hidden;
                `;
                section.dataset.itemId = item.dataset.itemId || `item-${Date.now()}-${index}`;
                item.dataset.itemId = section.dataset.itemId;

                // Header
                const header = document.createElement('div');
                // header.style.cssText = `
                //     display: flex;
                //     align-items: center;
                //     justify-content: space-between;
                //     padding: 10px 12px;
                //     font-weight: 500;
                // `;

                const questionText = item.querySelector('.accordion-question')?.textContent || `Question ${index + 1}`;

                const left = document.createElement('div');
                left.style.cssText = `
                    display: flex;
                    align-items: center;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                `;

                // Drag handle icon
                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.style.cssText = `
                    margin-right: 8px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;
                dragHandle.className = 'drag-handle';
                dragHandle.setAttribute('aria-label', 'Drag to reorder');

                const headerTitle = document.createElement('span');
                headerTitle.textContent = questionText;
                headerTitle.style.cssText = `
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;
                    min-width: 0;
                `;

                left.appendChild(dragHandle);
                left.appendChild(headerTitle);

                const toggle = document.createElement('span');
                toggle.innerHTML = '<svg style="width: 20px; height: 20px; transform: rotate(360deg); transition: all 0.2s ease" aria-hidden="true"><use xlink:href="#icon-chevron-down"></use></svg>';

                header.appendChild(left);
                header.appendChild(toggle);

                // Body
                const body = document.createElement('div');
                body.style.cssText = `
                    padding: 12px;
                    display: none;
                `;

                // Question Input
                const questionLabel = document.createElement('label');
                questionLabel.textContent = 'Question:';
                questionLabel.style.cssText = 'margin-bottom: 4px;';
                
                const questionInput = document.createElement('input');
                questionInput.type = 'text';
                questionInput.placeholder = 'Question';
                questionInput.value = item.querySelector('.accordion-question')?.textContent || '';
                questionInput.style.cssText = 'margin-bottom: 8px;';
                questionInput.setAttribute('aria-label', 'Question text');

                questionLabel.appendChild(questionInput);

                questionInput.addEventListener('input', () => {
                    item.querySelector('.accordion-question').textContent = questionInput.value;
                    headerTitle.textContent = questionInput.value || 'Untitled Question';
                    onChange?.();
                });

                // Answer Textarea
                const answerLabel = document.createElement('label');
                answerLabel.textContent = 'Answer:';
                answerLabel.style.cssText = 'margin-bottom: 4px;';
                
                const answerInput = document.createElement('textarea');
                answerInput.placeholder = 'Answer';
                answerInput.value = item.querySelector('.accordion-answer')?.textContent || '';
                answerInput.rows = 5;
                answerInput.style.cssText = 'height: 200px; margin-bottom: 8px;';
                answerInput.setAttribute('aria-label', 'Answer text');

                answerLabel.appendChild(answerInput);

                let answerTimer;
                answerInput.addEventListener('input', () => {
                    clearTimeout(answerTimer);
                    answerTimer = setTimeout(() => {
                        item.querySelector('.accordion-answer').textContent = answerInput.value;
                        onChange?.();
                    }, 400);
                });

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg aria-hidden="true"><use xlink:href="#icon-trash2"></use></svg>';
                // deleteBtn.style.cssText = 'width: 100%;';
                deleteBtn.setAttribute('aria-label', 'Delete this FAQ item');
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    item.remove();
                    section.remove();
                    onChange?.();
                };

                // Append fields
                body.appendChild(questionLabel);
                body.appendChild(answerLabel);
                body.appendChild(deleteBtn);

                // Toggle logic
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle')) return;
                    header.style.cursor = 'pointer';
                    const open = body.style.display === 'block';
                    body.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    if (open) {
                        icon.style.transform = 'rotate(360deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                });

                // Show pointer cursor on hover over header (but not drag handle)
                header.addEventListener('mouseenter', (e) => {
                    if (!e.target.closest('.drag-handle')) {
                        header.style.cursor = 'pointer';
                    }
                });

                header.addEventListener('mouseleave', () => {
                    header.style.cursor = '';
                });

                section.appendChild(header);
                section.appendChild(body);

                return section;
            };

            // Sortable container wrapper
            const sortableContainer = document.createElement('div');
            sortableContainer.className = 'sortable-accordion-container is-accordion';

            // Existing items
            items.forEach((item, i) => {
                sortableContainer.appendChild(createItemEditor(item, i));
            });

            container.appendChild(sortableContainer);

            // Initialize SortableJS
            loadSortable().then((Sortable) => {
                new Sortable(sortableContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function (evt) {
                        // Reorder actual items in the element
                        const editorItems = Array.from(sortableContainer.children).filter(c => c.dataset.itemId);
                        const elementItems = Array.from(element.querySelectorAll('.accordion-item'));

                        // Create a map of itemId to actual element
                        const itemMap = new Map();
                        elementItems.forEach(item => {
                            const itemId = item.dataset.itemId;
                            if (itemId) itemMap.set(itemId, item);
                        });

                        // Reorder actual elements based on editor order
                        editorItems.forEach((editorItem) => {
                            const itemId = editorItem.dataset.itemId;
                            const actualItem = itemMap.get(itemId);
                            if (actualItem && actualItem.parentElement === element) {
                                element.appendChild(actualItem);
                            }
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

            // Add Item button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add FAQ Item';
            addBtn.setAttribute('aria-label', 'Add new FAQ item');
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newItem = document.createElement('div');
                newItem.className = 'accordion-item';
                newItem.dataset.itemId = `item-${Date.now()}`;
                newItem.innerHTML = `
                    <div class="accordion-header">
                        <span class="accordion-question">New Question</span>
                        <span class="accordion-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </div>
                    <div class="accordion-content">
                        <div class="accordion-answer">Your answer here...</div>
                    </div>
                `;
                element.appendChild(newItem);
                const editor = createItemEditor(newItem, sortableContainer.children.length);
                sortableContainer.appendChild(editor);
                onChange?.();
            };

            container.appendChild(addBtn);
            return container;
        }
    },

    mount: function (element, options) {
        const allowMultiple = options.allowMultiple === true;
        const openFirst = options.openFirst !== false;

        // Generate unique ID for this accordion instance
        const accordionId = `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Open first item by default if option is enabled
        if (openFirst) {
            const firstItem = element.querySelector('.accordion-item');
            if (firstItem) {
                firstItem.classList.add('active');
            }
        }

        // Add click handlers to accordion items
        const items = element.querySelectorAll('.accordion-item');
        items.forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                // Generate unique IDs
                const buttonId = `${accordionId}-button-${index}`;
                const panelId = `${accordionId}-panel-${index}`;
                
                // Convert header to button for accessibility
                const button = document.createElement('button');
                button.type = 'button';
                button.id = buttonId;
                button.className = 'accordion-header';
                button.innerHTML = header.innerHTML;
                button.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
                button.setAttribute('aria-controls', panelId);
                
                // Copy styles from original header
                const headerStyles = window.getComputedStyle(header);
                button.style.cssText = header.style.cssText;
                button.style.width = '100%';
                button.style.textAlign = 'left';
                button.style.border = 'none';
                button.style.background = 'none';
                button.style.font = 'inherit';
                button.style.cursor = 'pointer';
                
                // Replace header with button
                header.replaceWith(button);
                
                // Set content attributes
                content.id = panelId;
                content.setAttribute('role', 'region');
                content.setAttribute('aria-labelledby', buttonId);
                content.setAttribute('aria-hidden', item.classList.contains('active') ? 'false' : 'true');
                
                // Add click handler
                button.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // If not allowing multiple, close all other items
                    if (!allowMultiple && !isActive) {
                        items.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                                const otherButton = otherItem.querySelector('.accordion-header');
                                const otherContent = otherItem.querySelector('.accordion-content');
                                if (otherButton) {
                                    otherButton.setAttribute('aria-expanded', 'false');
                                }
                                if (otherContent) {
                                    otherContent.setAttribute('aria-hidden', 'true');
                                }
                            }
                        });
                    }

                    // Toggle current item
                    item.classList.toggle('active');
                    button.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
                    content.setAttribute('aria-hidden', item.classList.contains('active') ? 'false' : 'true');
                });
                
                // Keyboard navigation
                button.addEventListener('keydown', (e) => {
                    const currentIndex = Array.from(items).indexOf(item);
                    let targetIndex = -1;
                    
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            targetIndex = (currentIndex + 1) % items.length;
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            targetIndex = (currentIndex - 1 + items.length) % items.length;
                            break;
                        case 'Home':
                            e.preventDefault();
                            targetIndex = 0;
                            break;
                        case 'End':
                            e.preventDefault();
                            targetIndex = items.length - 1;
                            break;
                    }
                    
                    if (targetIndex >= 0) {
                        const targetButton = items[targetIndex].querySelector('.accordion-header');
                        if (targetButton) {
                            targetButton.focus();
                        }
                    }
                });
            }
        });

        return {};
    }
};