export default {
    name: 'nav-menu',
    displayName: 'Navigation Menu',
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
        theme: {
            type: 'select',
            label: 'Theme',
            default: 'light',
            options: [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'dark-on-start', label: 'Dark on start' }
            ]
        },
        menuItemBorderRadius: {
            type: 'number',
            label: 'Menu item border radius',
            default: 6,
            min: 0,
            max: 500,
            unit: 'px',
        },
        dropdownBorderRadius: {
            type: 'number',
            label: 'Dropdown border radius',
            default: 8,
            min: 0,
            max: 500,
            unit: 'px',
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

            // Get existing menu structure
            const navList = element.querySelector('.nav-list');
            const menuItems = navList ? Array.from(navList.children) : [];

            // Generate unique ID
            const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Parse existing menu items
            let items = menuItems.map((li) => {
                const link = li.querySelector('.nav-link');
                const submenu = li.querySelector('.submenu');
                const hasSubmenu = li.classList.contains('has-submenu');

                const item = {
                    id: li.dataset.itemId || generateId(),
                    label: link ? link.childNodes[0].textContent.trim() : 'Untitled',
                    href: link ? link.getAttribute('href') : '#',
                    hasSubmenu: hasSubmenu,
                    children: []
                };

                if (submenu) {
                    const subItems = submenu.querySelectorAll('li');
                    subItems.forEach(subLi => {
                        const subLink = subLi.querySelector('.submenu-link');
                        if (subLink) {
                            item.children.push({
                                id: subLi.dataset.itemId || generateId(),
                                label: subLink.textContent.trim(),
                                href: subLink.getAttribute('href')
                            });
                        }
                    });
                }

                return item;
            });

            // Update the actual menu element
            const updateMenu = () => {
                if (!navList) return;

                navList.innerHTML = '';

                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = item.hasSubmenu ? 'nav-item has-submenu' : 'nav-item';
                    li.setAttribute('role', 'none');
                    li.dataset.itemId = item.id;

                    if (item.hasSubmenu) {
                        li.innerHTML = `
                            <a href="${item.href}" class="nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                                ${item.label}
                                <span class="nav-arrow" aria-hidden="true"></span>
                            </a>
                            <button class="submenu-toggle" aria-label="Toggle ${item.label} submenu" aria-expanded="false">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <ul class="submenu" role="menu" aria-label="${item.label} submenu">
                                ${item.children.map(child => `
                                    <li role="none" data-item-id="${child.id}">
                                        <a href="${child.href}" class="submenu-link" role="menuitem">${child.label}</a>
                                    </li>
                                `).join('')}
                            </ul>
                        `;
                    } else {
                        li.innerHTML = `
                            <a href="${item.href}" class="nav-link" role="menuitem">${item.label}</a>
                        `;
                    }

                    navList.appendChild(li);
                });

                onChange?.();
            };

            // Sortable container for menu items
            const sortableContainer = document.createElement('div');
            sortableContainer.className = 'menu-editor-container';
            sortableContainer.style.cssText = 'margin-bottom: 16px;';

            // Create menu item editor
            const createMenuItemEditor = (item, index) => {
                const itemEditor = document.createElement('div');
                itemEditor.className = 'item-editor';
                itemEditor.dataset.itemId = item.id;

                // Item header
                const itemHeader = document.createElement('div');
                itemHeader.className = 'item-header';

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

                const headerTitle = document.createElement('span');
                headerTitle.textContent = item.label || 'Untitled Menu Item';
                headerTitle.style.cssText = 'flex: 1; font-weight: 500; font-size: 14px;';

                const toggle = document.createElement('div');
                toggle.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.2s; transform: rotate(0deg);">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `;

                const deleteBtn = document.createElement('button');
                deleteBtn.style.cssText = 'width: 45px; background: transparent; color: #dc2626;';
                deleteBtn.className = 'item-delete-btn';
                deleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                deleteBtn.setAttribute('aria-label', 'Delete link');
                deleteBtn.type = 'button';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('Delete this menu item?')) {
                        items = items.filter(i => i.id !== item.id);
                        itemEditor.remove();
                        updateMenu();
                    }
                };

                itemHeader.appendChild(dragHandle);
                itemHeader.appendChild(headerTitle);
                itemHeader.appendChild(toggle);
                itemHeader.appendChild(deleteBtn);

                // Body (collapsed by default)
                const body = document.createElement('div');
                body.style.cssText = 'padding: 16px; display: none;';

                // Label input
                const labelLabel = document.createElement('label');
                labelLabel.textContent = 'Label';

                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = item.label;
                labelInput.placeholder = 'Menu Item Label';
                labelInput.addEventListener('input', () => {
                    item.label = labelInput.value;
                    headerTitle.textContent = labelInput.value || 'Untitled Menu Item';
                    updateMenu();
                });

                // Link input
                const linkLabel = document.createElement('label');
                linkLabel.textContent = 'Link (use # for no link)';

                const linkInput = document.createElement('input');
                linkInput.type = 'text';
                linkInput.value = item.href;
                linkInput.placeholder = '#';
                linkInput.addEventListener('input', () => {
                    item.href = linkInput.value || '#';
                    updateMenu();
                });

                // Has submenu checkbox
                const submenuCheckbox = document.createElement('label');
                submenuCheckbox.style.cssText = 'display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.hasSubmenu;
                checkbox.style.cssText = 'margin-right: 8px; cursor: pointer;';
                checkbox.addEventListener('change', () => {
                    item.hasSubmenu = checkbox.checked;
                    submenuSection.style.display = checkbox.checked ? 'block' : 'none';
                    updateMenu();
                });

                const checkboxLabel = document.createElement('span');
                checkboxLabel.textContent = 'Has Submenu';
                checkboxLabel.style.cssText = 'font-size: 13px; font-weight: 500; color: #333;';
                checkboxLabel.style.cssText = 'font-size: 13px; font-weight: 500; color: #333;';

                submenuCheckbox.appendChild(checkbox);
                submenuCheckbox.appendChild(checkboxLabel);

                // Submenu section
                const submenuSection = document.createElement('div');
                submenuSection.style.cssText = `display: ${item.hasSubmenu ? 'block' : 'none'}; background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e0e0e0;`;

                const submenuTitle = document.createElement('div');
                submenuTitle.textContent = 'Submenu Items';
                submenuTitle.style.cssText = 'font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #111;';

                const submenuList = document.createElement('div');
                submenuList.className = 'submenu-list';
                submenuList.style.cssText = 'margin-bottom: 8px;';

                // Create submenu item editor
                const createSubmenuItemEditor = (child) => {

                    const subItem = document.createElement('div');
                    subItem.className = 'submenu-item-editor';
                    subItem.dataset.itemId = child.id;
                    subItem.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-start;';

                    const subDragHandle = document.createElement('div');
                    subDragHandle.innerHTML = '⠿';
                    subDragHandle.className = 'drag-handle';
                    subDragHandle.style.cssText = `
                        margin-top: 3px;
                        font-size: 18px;
                        color: #999;
                        cursor: move;
                    `;

                    const subInputs = document.createElement('div');
                    subInputs.style.cssText = 'flex: 1; display: flex; flex-direction: column; gap: 4px;';

                    const subLabelInput = document.createElement('input');
                    subLabelInput.type = 'text';
                    subLabelInput.value = child.label;
                    subLabelInput.placeholder = 'Submenu Item Label';
                    subLabelInput.addEventListener('input', () => {
                        child.label = subLabelInput.value;
                        updateMenu();
                    });

                    const subLinkInput = document.createElement('input');
                    subLinkInput.type = 'text';
                    subLinkInput.value = child.href;
                    subLinkInput.placeholder = 'Link';
                    subLinkInput.addEventListener('input', () => {
                        child.href = subLinkInput.value;
                        updateMenu();
                    });

                    const subDeleteBtn = document.createElement('button');
                    subDeleteBtn.style.cssText = 'width: 30px; background: transparent; color: #dc2626;';
                    subDeleteBtn.className = 'item-delete-btn';
                    subDeleteBtn.innerHTML = '<svg><use xlink:href="#icon-trash2"></use></svg>';
                    subDeleteBtn.setAttribute('aria-label', 'Delete link');
                    subDeleteBtn.type = 'button';
                    subDeleteBtn.onclick = () => {
                        item.children = item.children.filter(c => c.id !== child.id);
                        subItem.remove();
                        updateMenu();
                    };

                    subInputs.appendChild(subLabelInput);
                    subInputs.appendChild(subLinkInput);
                    subItem.appendChild(subDragHandle);
                    subItem.appendChild(subInputs);
                    subItem.appendChild(subDeleteBtn);

                    return subItem;
                };

                // Render existing submenu items
                item.children.forEach(child => {
                    submenuList.appendChild(createSubmenuItemEditor(child));
                });

                // Initialize Sortable for submenu items
                loadSortable().then((Sortable) => {
                    new Sortable(submenuList, {
                        animation: 150,
                        handle: '.drag-handle',
                        ghostClass: 'sortable-ghost',
                        onEnd: function() {
                            const editorItems = Array.from(submenuList.children);
                            const newOrder = editorItems.map(el => {
                                const childId = el.dataset.itemId;
                                return item.children.find(c => c.id === childId);
                            }).filter(Boolean);
                            item.children = newOrder;
                            updateMenu();
                        }
                    });
                });

                // Add submenu item button
                const addSubmenuBtn = document.createElement('button');
                addSubmenuBtn.textContent = '+ Add Submenu Item';
                addSubmenuBtn.onclick = (e) => {
                    e.preventDefault();
                    const newChild = {
                        id: generateId(),
                        label: 'New Submenu Item',
                        href: '#'
                    };
                    item.children.push(newChild);
                    submenuList.appendChild(createSubmenuItemEditor(newChild));
                    updateMenu();
                };

                submenuSection.appendChild(submenuTitle);
                submenuSection.appendChild(submenuList);
                submenuSection.appendChild(addSubmenuBtn);

                body.appendChild(labelLabel);
                body.appendChild(labelInput);
                body.appendChild(linkLabel);
                body.appendChild(linkInput);
                body.appendChild(submenuCheckbox);
                body.appendChild(submenuSection);

                // Toggle logic
                itemHeader.addEventListener('click', (e) => {
                    if (e.target.closest('.drag-handle') || e.target.closest('button')) return;
                    const open = body.style.display === 'block';
                    body.style.display = open ? 'none' : 'block';
                    const icon = toggle.querySelector('svg');
                    icon.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
                });

                itemEditor.appendChild(itemHeader);
                itemEditor.appendChild(body);

                return itemEditor;
            };

            // Render existing menu items
            items.forEach((item, i) => {
                sortableContainer.appendChild(createMenuItemEditor(item, i));
            });

            container.appendChild(sortableContainer);

            // Initialize SortableJS for main menu items
            loadSortable().then((Sortable) => {
                new Sortable(sortableContainer, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: function() {
                        const editorItems = Array.from(sortableContainer.children);
                        const newOrder = editorItems.map(el => {
                            const itemId = el.dataset.itemId;
                            return items.find(i => i.id === itemId);
                        }).filter(Boolean);
                        items = newOrder;
                        updateMenu();
                    }
                });

                // Add sortable styles
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
                    .drag-handle:active {
                        cursor: grabbing !important;
                    }
                `;
                container.appendChild(style);
            }).catch((error) => {
                console.error('Failed to load SortableJS:', error);
            });

            // Add menu item button
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add Menu Item';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const newItem = {
                    id: generateId(),
                    label: 'New Menu Item',
                    href: '#',
                    hasSubmenu: false,
                    children: []
                };
                items.push(newItem);
                sortableContainer.appendChild(createMenuItemEditor(newItem, items.length - 1));
                updateMenu();
            };
            container.appendChild(addBtn);


            // Logo Editor Section
            const logoSection = document.createElement('div');
            logoSection.style.cssText = 'margin: 24px 0 6px;';

            // const logoTitle = document.createElement('h3');
            // logoTitle.textContent = 'Logo Settings';
            // logoTitle.style.cssText = 'margin: 0 0 16px 0; font-size: 15px; font-weight: 600;';
            // logoSection.appendChild(logoTitle);

            // Get current logo element
            const logoElement = element.querySelector('.logo');
            const currentImg = logoElement ? logoElement.querySelector('img') : null;
            const currentText = logoElement && !currentImg ? logoElement.textContent.trim() : '';

            // Logo Type Toggle
            const logoTypeLabel = document.createElement('label');
            logoTypeLabel.textContent = 'Logo Type';

            const logoTypeContainer = document.createElement('div');
            logoTypeContainer.style.cssText = 'display: flex; gap: 12px; margin-bottom: 16px;';

            const textRadio = document.createElement('input');
            textRadio.type = 'radio';
            textRadio.name = 'logoType';
            textRadio.value = 'text';
            textRadio.id = 'logoTypeText';
            textRadio.checked = !currentImg;

            const textRadioLabel = document.createElement('label');
            textRadioLabel.htmlFor = 'logoTypeText';
            textRadioLabel.textContent = 'Text';
            textRadioLabel.style.cssText = 'display: flex; align-items: center; gap: 4px; cursor: pointer;';
            textRadioLabel.insertBefore(textRadio, textRadioLabel.firstChild);

            const imageRadio = document.createElement('input');
            imageRadio.type = 'radio';
            imageRadio.name = 'logoType';
            imageRadio.value = 'image';
            imageRadio.id = 'logoTypeImage';
            imageRadio.checked = !!currentImg;

            const imageRadioLabel = document.createElement('label');
            imageRadioLabel.htmlFor = 'logoTypeImage';
            imageRadioLabel.textContent = 'Image';
            imageRadioLabel.style.cssText = 'display: flex; align-items: center; gap: 4px; cursor: pointer;';
            imageRadioLabel.insertBefore(imageRadio, imageRadioLabel.firstChild);

            logoTypeContainer.appendChild(textRadioLabel);
            logoTypeContainer.appendChild(imageRadioLabel);

            logoSection.appendChild(logoTypeLabel);
            logoSection.appendChild(logoTypeContainer);

            // Text Input (for text logo)
            const textInputContainer = document.createElement('div');
            textInputContainer.style.display = !currentImg ? 'block' : 'none';

            const textLabel = document.createElement('label');
            textLabel.textContent = 'Logo Text';

            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.value = currentText || 'My Website';
            textInput.placeholder = 'Enter logo text';
            textInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;';

            textInputContainer.appendChild(textLabel);
            textInputContainer.appendChild(textInput);

            // Image Inputs (for image logo)
            const imageInputContainer = document.createElement('div');
            imageInputContainer.style.display = currentImg ? 'block' : 'none';

            const imageUrlLabel = document.createElement('label');
            imageUrlLabel.textContent = 'Logo Image URL';

            const group = document.createElement('div');
            group.style.cssText = 'display: flex; gap: 4px; margin-bottom: 8px;';

            const imageUrlInput = document.createElement('input');
            imageUrlInput.type = 'text';
            imageUrlInput.value = currentImg ? currentImg.src : '';
            imageUrlInput.placeholder = 'https://example.com/logo.png';
            imageUrlInput.style.cssText = 'flex: 1;';

            const browseBtn = document.createElement('button');
            browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            browseBtn.style.cssText = 'width: 45px;';
            browseBtn.onclick = (e) => {
                e.preventDefault();
                builder.openFilePicker('image', (url) => {
                    imageUrlInput.value = url;
                    updateLogo();
                }, browseBtn);
            };

            group.appendChild(imageUrlInput);
            group.appendChild(browseBtn);

            const imageAltLabel = document.createElement('label');
            imageAltLabel.textContent = 'Image Alt Text';

            const imageAltInput = document.createElement('input');
            imageAltInput.type = 'text';
            imageAltInput.value = currentImg ? currentImg.alt : '';
            imageAltInput.placeholder = 'Company logo';

            const altHint = document.createElement('small');
            altHint.textContent = 'Required for accessibility';
            altHint.style.cssText = 'display: block; font-size: 11px; color: #666; margin-top: 4px;';

            const checkboxLabel = document.createElement('label');
            checkboxLabel.style.cssText = 'display: flex; align-items: center; gap: 3px; cursor: pointer; margin: 12px 0px 15px;';

            const roundedCheckbox = document.createElement('input');
            roundedCheckbox.type = 'checkbox';
            roundedCheckbox.checked = currentImg ? currentImg.classList.contains('rounded') : false;
            checkboxLabel.appendChild(roundedCheckbox);
            checkboxLabel.addEventListener('input', ()=>{
                const logoImage = logoElement.querySelector('img');
                if (!logoImage) return;
                if (checkboxLabel.querySelector('input').checked) {
                    logoImage.classList.add('rounded');
                } else {
                    logoImage.classList.remove('rounded');
                }
                onChange?.();
            });

            const checkboxText = document.createElement('span');
            checkboxText.textContent = 'Use rounded logo';
            checkboxLabel.appendChild(checkboxText);
            
            imageInputContainer.appendChild(imageUrlLabel);
            imageInputContainer.appendChild(group);
            imageInputContainer.appendChild(imageAltLabel);
            imageInputContainer.appendChild(imageAltInput);
            imageInputContainer.appendChild(altHint);
            imageInputContainer.appendChild(checkboxLabel);

            logoSection.appendChild(textInputContainer);
            logoSection.appendChild(imageInputContainer);

            // Logo Link Input
            const logoLinkLabel = document.createElement('label');
            logoLinkLabel.textContent = 'Logo Link';
            logoLinkLabel.style.cssText = 'margin-top: 12px;';

            const logoLinkInput = document.createElement('input');
            logoLinkInput.type = 'text';
            logoLinkInput.value = logoElement ? logoElement.getAttribute('href') || '/' : '/';
            logoLinkInput.placeholder = '#';

            logoSection.appendChild(logoLinkLabel);
            logoSection.appendChild(logoLinkInput);

            // Update logo in actual HTML
            const updateLogo = () => {
                if (!logoElement) return;

                const logoType = container.querySelector('input[name="logoType"]:checked').value;

                if (logoType === 'text') {
                    const text = textInput.value.trim() || 'My Website';
                    logoElement.textContent = text;
                } else {
                    const imageUrl = imageUrlInput.value.trim() || 'https://placehold.co/600x600/eee/666?text=LOGO';
                    const imageAlt = imageAltInput.value.trim() || textInput.value.trim() || 'Logo';
                    
                    logoElement.innerHTML = `<img src="${imageUrl}" alt="${imageAlt}" class="logo-img">`;
                }

                // Update logo link
                const logoLink = logoLinkInput.value.trim() || '#';
                logoElement.setAttribute('href', logoLink);

                onChange?.();
            };

            // Toggle visibility based on radio selection
            textRadio.addEventListener('change', () => {
                textInputContainer.style.display = 'block';
                imageInputContainer.style.display = 'none';
                updateLogo();
            });

            imageRadio.addEventListener('change', () => {
                textInputContainer.style.display = 'none';
                imageInputContainer.style.display = 'block';
                updateLogo();
            });

            // Update on input changes
            textInput.addEventListener('input', updateLogo);
            imageUrlInput.addEventListener('input', updateLogo);
            imageAltInput.addEventListener('input', updateLogo);
            logoLinkInput.addEventListener('input', updateLogo);

            container.appendChild(logoSection);


            // Add editor styles
            const style = document.createElement('style');
            style.textContent = `
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
                    padding: 5px 5px 5px 12px;
                    background: #f9f9f9;
                    cursor: pointer;
                    border-radius: 6px 6px 0 0;
                }
                .item-header:hover {
                    background: #f3f3f3;
                }
                .item-header span:nth-child(3) {
                    flex: 1;
                    font-weight: 500;
                }
                .cb-settings-form label {
                    display: block;
                    font-size: 12px;
                    font-weight: 500;
                    color: #555; margin-bottom: 6px;
                    margin-top: 8px;
                }
            `;
            container.appendChild(style);

            return container;
        }
    },

    mount: function (element, options) {

        const menuItemBorderRadius = options.menuItemBorderRadius !== undefined ? options.menuItemBorderRadius : 6;
        element.style.setProperty('--menu-item-border-radius', menuItemBorderRadius + 'px');

        const dropdownBorderRadius = options.dropdownBorderRadius !== undefined ? options.dropdownBorderRadius : 8;
        element.style.setProperty('--dropdown-border-radius', dropdownBorderRadius + 'px');

        const currentScroll = window.pageYOffset;
        const section = element.closest('.is-section'); // section is where the nav-menu plugin element is placed

        const theme = options.theme || 'light';
        if(theme==='dark-on-start') {
            if (currentScroll > (window.innerHeight-35)) {
                section.classList.remove('dark');
            } else {
                section.classList.add('dark'); // apply dark mode on top
            }
        } else if(theme==='dark') {
            section.classList.add('dark');
        } else { 
            section.classList.remove('dark');
        }

        // Add scrolled class for enhanced shadow effect
        const navWrapper = element.querySelector('.nav-wrapper');
        if (navWrapper) {
            let lastScroll = 0;

            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {

                    const currentScroll = window.pageYOffset;
                    
                    if (currentScroll > 50) {
                        navWrapper.classList.add('scrolled');
                    } else {
                        navWrapper.classList.remove('scrolled');
                    }

                    if(theme==='dark-on-start') {
                        if (currentScroll > (window.innerHeight-35)) {
                            section.classList.remove('dark');
                        } else {
                            section.classList.add('dark');
                        }
                    }
                    
                    lastScroll = currentScroll;

                }, 10);
            });
        }

        // Mobile menu toggle
        const menuToggle = element.querySelector('.menu-toggle');
        const navList = element.querySelector('.nav-list');
        const navItems = element.querySelectorAll('.nav-item');

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
        }

        // Mobile submenu toggle
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const submenu = item.querySelector('.submenu');
            const toggleBtn = item.querySelector('.submenu-toggle');
            
            if (submenu && toggleBtn) {
                // Toggle button click - expands/collapses submenu (mobile only)
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Close other open submenus
                    navItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherToggle = otherItem.querySelector('.submenu-toggle');
                            const otherLink = otherItem.querySelector('.nav-link');
                            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                            if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle current submenu
                    item.classList.toggle('active');
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    toggleBtn.setAttribute('aria-expanded', !isExpanded);
                    link.setAttribute('aria-expanded', !isExpanded);
                });
                
                // Link click - on mobile, if parent has href, allow navigation
                link.addEventListener('click', (e) => {
                    // On desktop (>768px), don't interfere with hover behavior
                    // if (window.innerWidth > 768) {
                    //     return;
                    // }
                    
                    // Mobile: if link is just a placeholder (#), prevent navigation
                    const href = link.getAttribute('href');
                    if (href === '#' || href === '') {
                        e.preventDefault();
                    }
                });
            }
        });

        // Keyboard navigation support
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const submenu = item.querySelector('.submenu');
            
            if (submenu) {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const firstSubmenuLink = submenu.querySelector('.submenu-link');
                        if (firstSubmenuLink) {
                            firstSubmenuLink.focus();
                        }
                    }
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                if (navList) navList.classList.remove('active');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (navList) navList.classList.remove('active');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                navItems.forEach(item => item.classList.remove('active'));
            }
        });

        return {};
    }
};