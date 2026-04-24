/*
Usage:

<div class="is-section is-box type-system-ui is-section-50">
    <div class="is-container v2 is-content-960 leading-14 size-18 v3">
        <div class="row">
            <div class="column">
                <h1 class="font-light size-48 text-center">Monochrome Blocks <a href="#articles" title="">Demo</a></h1>
            </div>
        </div>
    </div>
</div>

<div class="is-section is-box type-system-ui is-section-auto" style="position: sticky; height: 70px; top: 0px; z-index: 1;">
    <div class="is-overlay">
        <div class="is-overlay-content">

            <div data-cb-type="sticky-category-nav" role="navigation" aria-label="Category navigation">
                <div class="category-nav-container" role="list">
                    <ul class="category-nav-list">
                        <li role="listitem"><a href="#hero">Hero</a></li>
                        <li role="listitem"><a href="#articles">Articles</a></li>
                        <li role="listitem"><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
</div>

<div class="is-section is-box type-system-ui is-section-100" id="hero">
    <div class="is-container v2 leading-13 size-17 v3 is-content-900">
        <div class="row">
            <div class="column">
                <h1 class="text-center font-normal leading-11 size-48">A forward thinking studio delivering digital solutions that help your business.</h1>
            </div>
        </div>
    </div>
</div>
<div class="is-section is-box type-system-ui is-section-100" id="articles">
    <div class="is-container v2 size-18 leading-14 is-content-640 v3">
        <div class="row">
            <div class="column">
                <h2 class="text-center leading-none size-80 font-extralight">Words From Heart</h2>
            </div>
        </div>
    </div>
</div>
<div class="is-section is-box type-system-ui is-section-100" id="contact">
    <div class="is-container v2 size-16 leading-13 v3 is-content-820">
        <div class="row">
            <div class="column">
                <h2 class="leading-none text-left font-normal size-28">Company Name</h2>
            </div>
        </div>
    </div>
</div>
*/

export default {
    name: 'sticky-category-nav',
    displayName: 'Sticky Category',
    version: '1.0.0',

    contentbox: {
        // configure box panel
        title: false,
        bg: false,
        text: false,
        boxTabs: false,
        // configure section panel
        sectionHeight: false,
        sectionTabs: false
    },

    settings: {
        backgroundColor: {
            type: 'color',
            label: 'Background Color',
            default: '#f5f5f5'
        },
        color: {
            type: 'color',
            label: 'Link Color',
            default: '#666'
        },
        accentColor: {
            type: 'color',
            label: 'Accent Color',
            default: '#1a1a1a'
        },
        top: {
            type: 'number',
            label: 'Top',
            default: 0, // only sets the input. Add data-cb-top for mount use => options.top).
            min: 0,
            max: 400,
            step: 1,
            unit: 'px'
        },
    },
    editor: {
        openContentEditor: function(element, builder, onChange) {

            const container = document.createElement('div');

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

            // Get all nav links
            const navList = element.querySelector('.category-nav-list');
            if (!navList) {
                container.textContent = 'Error: .category-nav-list not found';
                return container;
            }

            const links = Array.from(navList.querySelectorAll('a'));

            // Generate unique IDs for links if they don't have them
            links.forEach((link, index) => {
                if (!link.dataset.itemId) {
                    link.dataset.itemId = `link-${Date.now()}-${index}`;
                }
            });

            // Description
            const desc = document.createElement('p');
            desc.textContent = 'Drag to reorder, click to edit, or remove links.';
            desc.style.cssText = 'margin: 0 0 16px 0; font-size: 13px; color: #666; line-height: 1.5;';
            container.appendChild(desc);

            // Create link editor item
            const createLinkEditor = (link, index) => {
                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';
                itemEditor.dataset.itemId = link.dataset.itemId || `item-${Date.now()}-${index}`;
                link.dataset.itemId = itemEditor.dataset.itemId;

                // Item header
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

                // Drag handle
                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '⠿';
                dragHandle.className = 'drag-handle';
                dragHandle.style.cssText = `
                    margin-top: 3px;
                    margin-right: 10px;
                    font-size: 18px;
                    color: #999;
                    cursor: move;
                `;
                dragHandle.setAttribute('aria-label', 'Drag to reorder');

                // Title
                const titleText = link.textContent || 'Untitled Link';
                const itemTitle = document.createElement('span');
                itemTitle.textContent = titleText;

                // Toggle button
                const toggle = document.createElement('button');
                toggle.style.cssText = 'width: 30px; background: transparent;';
                toggle.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.2s; transform: rotate(0deg);">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `;
                toggle.setAttribute('aria-label', 'Toggle link editor');
                toggle.type = 'button';

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.style.cssText = 'width: 45px; background: transparent; color: #dc2626;';
                deleteBtn.className = 'item-delete-btn';
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.setAttribute('aria-label', 'Delete link');
                deleteBtn.type = 'button';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    link.parentNode.remove();
                    itemEditor.remove();
                    onChange?.();
                };

                itemHeader.appendChild(dragHandle);
                itemHeader.appendChild(itemTitle);
                itemHeader.appendChild(toggle);
                itemHeader.appendChild(deleteBtn);

                // Item body (collapsible)
                const itemBody = document.createElement('div');
                itemBody.className = 'item-body';
                itemBody.style.display = 'none';

                // Label input
                const labelLabel = document.createElement('label');
                labelLabel.textContent = 'Link Text';
                
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.placeholder = 'Enter link text';
                labelInput.value = link.textContent || '';
                labelInput.style.cssText = 'margin-bottom: 12px;';
                labelInput.setAttribute('aria-label', 'Link text');

                labelInput.addEventListener('input', () => {
                    link.textContent = labelInput.value;
                    itemTitle.textContent = labelInput.value || 'Untitled Link';
                    onChange?.();
                });

                // Target input
                const targetLabel = document.createElement('label');
                targetLabel.textContent = 'Target Section ID';
                
                const targetInput = document.createElement('input');
                targetInput.type = 'text';
                targetInput.placeholder = '#section-id';
                targetInput.value = link.getAttribute('href') || '';
                targetInput.style.cssText = 'margin-bottom: 8px;';
                targetInput.setAttribute('aria-label', 'Target section ID');
                targetInput.addEventListener('input', () => {
                    let value = targetInput.value;
                    // Auto-add # if missing
                    if (value && !value.startsWith('#')) {
                        value = '#' + value;
                        targetInput.value = value;
                    }
                    link.setAttribute('href', value);
                    onChange?.();
                });

                // Hint
                const hint = document.createElement('div');
                hint.textContent = 'Use format: #section-id (e.g., #hero, #about)';
                hint.style.cssText = 'font-size: 11px; color: #888; margin-bottom: 12px;';

                // Append fields
                itemBody.appendChild(labelLabel);
                itemBody.appendChild(labelInput);
                itemBody.appendChild(targetLabel);
                itemBody.appendChild(targetInput);
                itemBody.appendChild(hint);

                // Toggle logic
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const open = itemBody.style.display === 'block';
                    itemBody.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    if (open) {
                        icon.style.transform = 'rotate(360deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                });

                // Make header clickable (except on buttons)
                itemHeader.addEventListener('click', (e) => {
                    if (e.target.closest('button') || e.target.closest('.drag-handle')) return;
                    toggle.click();
                });

                itemEditor.appendChild(itemHeader);
                itemEditor.appendChild(itemBody);

                return itemEditor;
            };

            // Sortable container
            const sortableContainer = document.createElement('div');
            sortableContainer.className = 'items-container';

            // Create editors for existing links
            links.forEach((link, i) => {
                sortableContainer.appendChild(createLinkEditor(link, i));
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
                        // Reorder actual links in the nav list
                        const editorItems = Array.from(sortableContainer.children).filter(c => c.dataset.itemId);

                        // Create a map of itemId to actual link element
                        const linkMap = new Map();
                        Array.from(navList.children).forEach(li => {
                            const link = li.querySelector('a');
                            if (link && link.dataset.itemId) {
                                linkMap.set(link.dataset.itemId, li);
                            }
                        });

                        // Reorder actual elements based on editor order
                        editorItems.forEach((editorItem) => {
                            const itemId = editorItem.dataset.itemId;
                            const actualLi = linkMap.get(itemId);
                            if (actualLi && actualLi.parentElement === navList) {
                                navList.appendChild(actualLi);
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

            // Add Link button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Navigation Link';
            addBtn.type = 'button';
            addBtn.className = 'add-item-btn';
            addBtn.onclick = (e) => {
                e.preventDefault();

                // Create new list item and link
                const newLi = document.createElement('li');
                const newLink = document.createElement('a');
                newLink.href = '#new-section';
                newLink.textContent = 'New Link';
                newLink.dataset.itemId = `link-${Date.now()}`;
                newLi.setAttribute('role', 'listitem'); // Accessibility: Add role="listitem" to each li
                newLi.appendChild(newLink);

                // Add to nav list
                navList.appendChild(newLi);

                // Add editor
                const editor = createLinkEditor(newLink, sortableContainer.children.length);
                sortableContainer.appendChild(editor);

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
                    padding: 5px 5px 5px 12px;
                    background: #f9f9f9;
                    cursor: pointer;
                    border-radius: 6px 6px 0 0;
                }
                .item-header:hover {
                    background: #f3f3f3;
                }
                .item-header span:nth-child(2) {
                    flex: 1;
                    font-weight: 500;
                }
                .item-body {
                    padding: 12px;
                    display: none;
                }
                .cb-settings-form label {
                    display: block;
                    font-size: 12px;
                    font-weight: 500;
                    color: #555; margin-bottom: 6px;
                    margin-top: 8px;
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

    mount: function (element, options) {
        // Important: Sticky must be applied to the div.is-section (where the plugin is placed)
        const section = element.closest('.is-section');
        section.style.position = 'sticky';
        section.style.height = '70px';
        section.style.top = (options.top || '0') + 'px';
        section.style.zIndex = 1;
    
        // Use css variables for styling the plugins
        const backgroundColor = options.backgroundColor || '#f5f5f5';
        element.style.setProperty('--background-color', backgroundColor);

        const color = options.color || '#666';
        element.style.setProperty('--color', color);

        const accentColor = options.accentColor || '#1a1a1a';
        element.style.setProperty('--accent-color', accentColor);

        // Get all links
        const categoryLinks = element.querySelectorAll('.category-nav-list a');
        if (categoryLinks.length === 0) return {};

        // Update active category in navigation
        // const scrollOffset = options.scrollOffset || 200;
        const scrollOffset = 200;
        const sections = [];

        // Find all target sections
        categoryLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    sections.push({
                        element: section,
                        id: href.slice(1),
                        link: link
                    });
                }
            }
        });

        // Scroll handler with throttling
        let scrollTimeout;
        const updateActiveLink = () => {
            let current = '';
            const scrollPosition = window.pageYOffset;

            sections.forEach(section => {
                const sectionTop = section.element.offsetTop;
                const sectionHeight = section.element.clientHeight;

                if (scrollPosition >= (sectionTop - scrollOffset)) {
                    current = section.id;
                }
            });

            categoryLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');

                const href = link.getAttribute('href');
                if (href && href.slice(1) === current) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'true');
                }
            });
        };

        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveLink, 50);
        });

        // Initial check
        updateActiveLink();

        // Accessibility: Skip link for keyboard users
        const skipLink = document.createElement('a');
        skipLink.textContent = 'Skip navigation';
        skipLink.className = 'skip-link';
        skipLink.href = '#'; // We'll handle this with JavaScript

        skipLink.style.cssText = 'position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden;';

        skipLink.addEventListener('focus', function () {
            this.style.cssText = 'position: absolute; left: 10px; top: 10px; z-index: 10000; padding: 8px 12px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;';
        });

        skipLink.addEventListener('blur', function () {
            this.style.cssText = 'position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden;';
        });

        // Skip the navigation
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the first navigation link's target
            const firstNavLink = categoryLinks[0];
            if (firstNavLink) {
                const targetHref = firstNavLink.getAttribute('href');
                const targetSection = document.querySelector(targetHref);
                
                if (targetSection) {
                    // Make section focusable
                    targetSection.setAttribute('tabindex', '-1');
                    // Move focus to the section
                    targetSection.focus();
                    // Scroll to it
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        element.insertBefore(skipLink, element.firstChild);

        return {};
    }
};