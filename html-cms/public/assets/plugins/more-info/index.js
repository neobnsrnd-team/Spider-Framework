export default {
    name: 'more-info',
    displayName: 'More Info',
    version: '1.0.0',

    settings: {
        style: {
            type: 'select',
            label: 'Display Style',
            default: 'info',
            options: [
                { value: 'info', label: '🛈 Info Tooltip (blue)' },
                { value: 'citation', label: '[#] Citation (superscript)' },
                { value: 'highlight', label: '✨ Highlight (yellow)' }
            ]
        },
        trigger: {
            type: 'select',
            label: 'Show On',
            default: 'hover',
            options: [
                { value: 'hover', label: 'Hover (+ click for persistent)' },
                { value: 'click', label: 'Click only' }
            ]
        },
        maxWidth: {
            type: 'number',
            label: 'Popover Max Width',
            default: 320,
            min: 200,
            max: 600,
            step: 20,
            unit: 'px'
        },
        position: {
            type: 'select',
            label: 'Preferred Position',
            default: 'top',
            options: [
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'auto', label: 'Auto (smart positioning)' }
            ]
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');

            // Label text editor
            const labelSection = document.createElement('div');
            labelSection.style.marginBottom = '16px';

            const labelLabel = document.createElement('label');
            labelLabel.textContent = 'Trigger Text';
            labelLabel.style.cssText = 'display: block; font-weight: 500; margin-bottom: 8px; font-size: 14px;';

            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.value = element.textContent || 'More info';
            labelInput.placeholder = 'e.g., Saturn, [1], Learn more';

            labelInput.addEventListener('input', () => {
                element.textContent = labelInput.value;
                if (onChange) onChange();
            });

            labelSection.appendChild(labelLabel);
            labelSection.appendChild(labelInput);

            // Info content editor
            const contentSection = document.createElement('div');
            contentSection.style.marginBottom = '16px';

            const contentLabel = document.createElement('label');
            contentLabel.textContent = 'Popover Content';
            contentLabel.style.cssText = 'display: block; font-weight: 500; margin-bottom: 8px; font-size: 14px;';

            const contentHint = document.createElement('small');
            contentHint.textContent = 'Use the toolbar to format text, or switch to HTML mode for advanced editing';
            contentHint.style.cssText = 'display: block; opacity:0.6; font-size: 11px; margin-bottom: 6px;';

            // Toolbar
            const toolbar = document.createElement('div');
            toolbar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; border-bottom: none; border-radius: 4px 4px 0 0;';

            // Use innerHTML for toolbar buttons (like your working example)
            toolbar.innerHTML = `
                <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('bold', false, null)" 
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Bold">
                    <strong>B</strong>
                </button>
                <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('italic', false, null)"
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Italic">
                    <em>I</em>
                </button>
                <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('underline', false, null)"
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Underline">
                    U
                </button>
                <button type="button" onmousedown="event.preventDefault()" onclick="(function(){ var url = prompt('Enter URL:', 'https://'); if(url) document.execCommand('createLink', false, url); })()"
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Insert Link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>
                </button>
                <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('insertUnorderedList', false, null)"
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Bullet List">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>
                </button>
                <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('insertOrderedList', false, null)"
                    style="width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600; flex: 0 0 auto; display: flex; align-items: center; justify-content: center;"
                    title="Numbered List">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M12 18h8" /><path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /><path d="M6 10v-6l-2 2" /></svg>
                </button>
            `;

            // HTML toggle button (special styling)
            const htmlToggle = document.createElement('button');
            htmlToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" /></svg>';
            htmlToggle.title = 'Toggle HTML Mode';
            htmlToggle.type = 'button';
            htmlToggle.style.cssText = 'width: 35px; height: 35px; padding: 0; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; flex: none; display: flex; align-items: center; justify-content: center;';

            let isHTMLMode = false;
            htmlToggle.onclick = (e) => {
                e.preventDefault();
                isHTMLMode = !isHTMLMode;
                
                // Disable/enable toolbar buttons based on HTML mode
                const buttons = toolbar.querySelectorAll('button');
                
                if (isHTMLMode) {
                    // Switch to HTML mode
                    htmlToggle.style.background = '#3b82f6';
                    htmlToggle.style.color = 'white';
                    htmlToggle.style.borderColor = '#2563eb';
                    
                    // Disable other buttons
                    buttons.forEach(btn => {
                        if (btn !== htmlToggle) {
                            btn.disabled = true;
                            btn.style.opacity = '0.5';
                            btn.style.cursor = 'not-allowed';
                        }
                    });
                    
                    const html = contentEditor.innerHTML;
                    contentEditor.contentEditable = 'false';
                    contentEditor.style.fontFamily = 'Monaco, Consolas, monospace';
                    contentEditor.style.fontSize = '12px';
                    contentEditor.style.whiteSpace = 'pre-wrap';
                    contentEditor.textContent = html;
                } else {
                    // Switch back to visual mode
                    htmlToggle.style.background = 'white';
                    htmlToggle.style.color = '';
                    
                    // Enable other buttons
                    buttons.forEach(btn => {
                        if (btn !== htmlToggle) {
                            btn.disabled = false;
                            btn.style.opacity = '';
                            btn.style.cursor = 'pointer';
                        }
                    });
                    
                    const html = contentEditor.textContent;
                    contentEditor.contentEditable = 'true';
                    contentEditor.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    contentEditor.style.fontSize = '14px';
                    contentEditor.style.whiteSpace = 'normal';
                    contentEditor.innerHTML = html;
                }
            };

            toolbar.appendChild(htmlToggle);

            // Contenteditable editor
            const contentEditor = document.createElement('div');
            contentEditor.contentEditable = 'true';
            contentEditor.innerHTML = element.dataset.cbContent || '<p style="color: #999; font-style: italic;">Start typing or use the toolbar to format text...</p>';
            contentEditor.style.cssText = 'width: 100%; min-height: 180px; max-height: 300px; overflow-y: auto; box-sizing: border-box; padding: 12px; border: 1px solid rgb(209 209 209); border-radius: 5px; font-size: 14px; line-height: 1.6;';

            // Clear placeholder on focus
            contentEditor.addEventListener('focus', () => {
                if (contentEditor.innerHTML === '<p style="color: #999; font-style: italic;">Start typing or use the toolbar to format text...</p>') {
                    contentEditor.innerHTML = '<p><br></p>';
                }
            });

            let contentTimer;
            const updateContent = () => {
                clearTimeout(contentTimer);
                contentTimer = setTimeout(() => {
                    const html = isHTMLMode ? contentEditor.textContent : contentEditor.innerHTML;
                    element.dataset.cbContent = html;
                    // Update preview (only if not in HTML mode)
                    // if (!isHTMLMode) {
                    //     previewContent.innerHTML = html || '<em style="color: #999;">Preview will appear here...</em>';
                    // }
                    if (onChange) onChange();
                }, 400);
            };

            contentEditor.addEventListener('input', updateContent);
            contentEditor.addEventListener('blur', updateContent);

            // Paste handling - clean up pasted content
            contentEditor.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });

            contentSection.appendChild(contentLabel);
            contentSection.appendChild(contentHint);
            contentSection.appendChild(toolbar);
            contentSection.appendChild(contentEditor);

            // Preview section
            const previewSection = document.createElement('div');
            previewSection.style.cssText = 'margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px; border: 1px solid #e5e5e5;';

            const previewLabel = document.createElement('label');
            previewLabel.textContent = '👁️ Preview';
            previewLabel.style.cssText = 'display: block; font-weight: 600; margin-bottom: 8px; font-size: 13px;';

            /*
            const previewContent = document.createElement('div');
            previewContent.style.cssText = 'background: white; padding: 12px; border-radius: 4px; font-size: 14px; line-height: 1.6; min-height: 60px;';
            // Show actual content or placeholder message
            const actualContent = element.dataset.cbContent || '';
            previewContent.innerHTML = actualContent || '<em style="color: #999;">Preview will appear here...</em>';

            previewSection.appendChild(previewLabel);
            previewSection.appendChild(previewContent);
            */

            // Tips section
            const tipsSection = document.createElement('div');
            tipsSection.className = 'is-tips';
            tipsSection.innerHTML = `
                <strong>💡 Tips:</strong><br>
                • Use <strong>Citation style</strong> for academic references<br>
                • Use <strong>Info style</strong> for explanatory tooltips<br>
                • Use <strong>Highlight style</strong> for fun facts or emphasis<br>
                • Keep content concise for better readability
            `;

            container.appendChild(labelSection);
            container.appendChild(contentSection);
            // container.appendChild(previewSection);
            container.appendChild(tipsSection);

            return container;
        }
    },

    mount: function (element, options) {
        const style = options.style || 'info';
        const trigger = options.trigger || 'hover';
        const maxWidth = options.maxWidth || 320;
        const position = options.position || 'top';

        // Clean up any existing popovers for this element
        const existingPopover = element._moreInfoPopover;
        if (existingPopover) {
            existingPopover.remove();
            element._moreInfoPopover = null;
        }

        // Remove any existing style classes
        element.classList.remove('style-info', 'style-citation', 'style-highlight');
        
        // Apply current style class
        element.classList.add('more-info-trigger');
        element.classList.add(`style-${style}`);
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-expanded', 'false');
        element.setAttribute('aria-haspopup', 'true');

        // Create popover element
        const popover = document.createElement('div');
        popover.className = 'more-info-popover';
        popover.style.maxWidth = `${maxWidth}px`;
        popover.setAttribute('role', 'tooltip');
        
        // Store reference to popover on element for cleanup
        element._moreInfoPopover = popover;
        
        const arrow = document.createElement('div');
        arrow.className = 'popover-arrow';
        
        const content = document.createElement('div');
        content.className = 'popover-content';
        content.innerHTML = element.dataset.cbContent || 'No content provided.';
        
        popover.appendChild(arrow);
        popover.appendChild(content);
        document.body.appendChild(popover);

        let isOpen = false;
        let isPersistent = false;
        let hoverTimeout;

        // Position calculation with smart viewport detection
        const positionPopover = () => {
            const triggerRect = element.getBoundingClientRect();
            const popoverRect = popover.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            let top, left;
            let finalPosition = position;

            // Auto positioning logic
            if (position === 'auto') {
                const spaceAbove = triggerRect.top;
                const spaceBelow = viewportHeight - triggerRect.bottom;
                finalPosition = spaceAbove > spaceBelow ? 'top' : 'bottom';
            }

            // Calculate positions
            if (finalPosition === 'top') {
                top = triggerRect.top + scrollY - popoverRect.height - 12;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (popoverRect.width / 2);
                popover.classList.add('position-top');
                popover.classList.remove('position-bottom');
            } else {
                top = triggerRect.bottom + scrollY + 12;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (popoverRect.width / 2);
                popover.classList.add('position-bottom');
                popover.classList.remove('position-top');
            }

            // Keep popover within viewport horizontally
            if (left < 10) left = 10;
            if (left + popoverRect.width > viewportWidth - 10) {
                left = viewportWidth - popoverRect.width - 10;
            }

            // Apply position
            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;

            // Position arrow
            const arrowLeft = triggerRect.left + (triggerRect.width / 2) - left - 6;
            arrow.style.left = `${Math.max(12, Math.min(arrowLeft, popoverRect.width - 12))}px`;
        };

        const showPopover = (persistent = false) => {
            if (isOpen) return;
            
            isOpen = true;
            isPersistent = persistent;
            popover.classList.add('visible');
            element.setAttribute('aria-expanded', 'true');
            
            // Force reflow before positioning
            requestAnimationFrame(() => {
                positionPopover();
            });
        };

        const hidePopover = () => {
            if (isPersistent) return;
            
            isOpen = false;
            popover.classList.remove('visible');
            element.setAttribute('aria-expanded', 'false');
        };

        const togglePopover = () => {
            if (isOpen && isPersistent) {
                isPersistent = false;
                hidePopover();
            } else {
                showPopover(true);
            }
        };

        // Event listeners based on trigger mode
        if (trigger === 'hover') {
            element.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => showPopover(false), 100);
            });

            element.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(hidePopover, 200);
            });

            popover.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
            });

            popover.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(hidePopover, 200);
            });

            // Click makes it persistent - NO stopPropagation
            element.addEventListener('click', (e) => {
                e.preventDefault();
                // Removed e.stopPropagation() so ContentBox can detect the click
                togglePopover();
            });
        } else {
            // Click only mode - NO stopPropagation
            element.addEventListener('click', (e) => {
                e.preventDefault();
                // Removed e.stopPropagation() so ContentBox can detect the click
                togglePopover();
            });
        }

        // Keyboard support
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePopover();
            } else if (e.key === 'Escape' && isOpen) {
                isPersistent = false;
                hidePopover();
            }
        });

        // Click outside to close
        const handleOutsideClick = (e) => {
            if (!element.contains(e.target) && !popover.contains(e.target)) {
                isPersistent = false;
                hidePopover();
            }
        };
        document.addEventListener('click', handleOutsideClick);

        // Reposition on scroll/resize
        let repositionTimer;
        const handleReposition = () => {
            if (isOpen) {
                clearTimeout(repositionTimer);
                repositionTimer = setTimeout(positionPopover, 10);
            }
        };

        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);

        // Cleanup function
        return {
            unmount: () => {
                popover.remove();
                element._moreInfoPopover = null;
                document.removeEventListener('click', handleOutsideClick);
                window.removeEventListener('scroll', handleReposition, true);
                window.removeEventListener('resize', handleReposition);
            }
        };
    }
};