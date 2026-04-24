export default {
    name: 'social-share',
    displayName: 'Social Share',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'platforms',
                label: 'Platforms',
                fields: ['showX', 'showFacebook', 'showLinkedIn', 'showWhatsApp', 'showCopyLink', 'showMore']
            },
            {
                id: 'content',
                label: 'Share Content',
                fields: ['shareTitle', 'shareText']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                fields: ['alignment', 'showLabel', 'labelText']
            }
        ],

        // Platforms
        showX: {
            type: 'boolean',
            label: 'Show X (Twitter)',
            default: true,
            group: 'platforms'
        },
        showFacebook: {
            type: 'boolean',
            label: 'Show Facebook',
            default: true,
            group: 'platforms'
        },
        showLinkedIn: {
            type: 'boolean',
            label: 'Show LinkedIn',
            default: true,
            group: 'platforms'
        },
        showWhatsApp: {
            type: 'boolean',
            label: 'Show WhatsApp',
            default: true,
            group: 'platforms'
        },
        showCopyLink: {
            type: 'boolean',
            label: 'Show Copy Link',
            default: true,
            group: 'platforms'
        },
        showMore: {
            type: 'boolean',
            label: 'Show More Options',
            default: true,
            group: 'platforms'
        },

        // Content
        shareTitle: {
            type: 'text',
            label: 'Share Title',
            default: '',
            placeholder: 'Leave empty to use page title',
            group: 'content'
        },
        shareText: {
            type: 'textarea',
            label: 'Share Description',
            default: '',
            placeholder: 'Leave empty to use page meta description',
            rows: 3,
            group: 'content'
        },

        // Appearance
        alignment: {
            type: 'select',
            label: 'Alignment',
            default: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            group: 'appearance'
        },
        showLabel: {
            type: 'boolean',
            label: 'Show Label',
            default: true,
            group: 'appearance'
        },
        labelText: {
            type: 'text',
            label: 'Label Text',
            default: 'Share',
            group: 'appearance'
        }
    },

    mount: function (element, options) {
        const shareData = {
            url: window.location.href,
            title: options.shareTitle || document.title,
            text: options.shareText || document.querySelector('meta[name="description"]')?.content || ''
        };

        const icons = {
            x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6l12 12"/></svg>',
            facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
            whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
            link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
            more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
        };

        const handleShare = (platform) => {
            const encodedUrl = encodeURIComponent(shareData.url);
            const encodedTitle = encodeURIComponent(shareData.title);
            const encodedText = encodeURIComponent(shareData.text);

            const shareUrls = {
                twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
                reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
                telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
                email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`
            };

            if (shareUrls[platform]) {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
            }
        };

        const handleCopyLink = async (btn) => {
            try {
                await navigator.clipboard.writeText(shareData.url);
                const originalHTML = btn.innerHTML;
                const originalLabel = btn.getAttribute('aria-label');
                
                btn.innerHTML = '<span class="copy-success" aria-hidden="true">✓</span>';
                btn.setAttribute('aria-label', 'Link copied to clipboard');
                btn.classList.add('copied');
                
                // Announce to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = 'Link copied to clipboard';
                document.body.appendChild(announcement);
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.setAttribute('aria-label', originalLabel);
                    btn.classList.remove('copied');
                    document.body.removeChild(announcement);
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                // Announce error to screen readers
                const errorAnnouncement = document.createElement('div');
                errorAnnouncement.setAttribute('role', 'alert');
                errorAnnouncement.setAttribute('aria-live', 'assertive');
                errorAnnouncement.className = 'sr-only';
                errorAnnouncement.textContent = 'Failed to copy link';
                document.body.appendChild(errorAnnouncement);
                setTimeout(() => document.body.removeChild(errorAnnouncement), 2000);
            }
        };

        // Clear existing content
        element.innerHTML = '';

        // Container with semantic markup
        const container = document.createElement('div');
        container.className = 'share-container';
        container.setAttribute('role', 'group');
        container.setAttribute('aria-label', 'Share this page');
        
        // Set alignment
        const alignment = options.alignment || 'left';
        container.setAttribute('data-alignment', alignment);

        // Label
        if (options.showLabel !== false) {
            const label = document.createElement('span');
            label.className = 'share-label';
            label.id = 'share-label-' + Math.random().toString(36).substr(2, 9);
            label.textContent = options.labelText || 'Share';
            container.setAttribute('aria-labelledby', label.id);
            container.appendChild(label);
        }

        // Buttons wrapper
        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'share-buttons flex';
        buttonsWrapper.setAttribute('role', 'list');

        // Helper function to create button with proper accessibility
        const createButton = (platform, label, icon, onClick) => {
            const btnWrapper = document.createElement('div');
            btnWrapper.setAttribute('role', 'listitem');
            
            const btn = document.createElement('button');
            btn.className = 'share-btn';
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-label', label);
            btn.innerHTML = icon;
            btn.onclick = onClick;
            
            btnWrapper.appendChild(btn);
            return btnWrapper;
        };

        // X (Twitter)
        if (options.showX !== false) {
            buttonsWrapper.appendChild(
                createButton('twitter', 'Share on X', icons.x, () => handleShare('twitter'))
            );
        }

        // Facebook
        if (options.showFacebook !== false) {
            buttonsWrapper.appendChild(
                createButton('facebook', 'Share on Facebook', icons.facebook, () => handleShare('facebook'))
            );
        }

        // LinkedIn
        if (options.showLinkedIn !== false) {
            buttonsWrapper.appendChild(
                createButton('linkedin', 'Share on LinkedIn', icons.linkedin, () => handleShare('linkedin'))
            );
        }

        // WhatsApp
        if (options.showWhatsApp !== false) {
            buttonsWrapper.appendChild(
                createButton('whatsapp', 'Share on WhatsApp', icons.whatsapp, () => handleShare('whatsapp'))
            );
        }

        // Copy Link
        if (options.showCopyLink !== false) {
            const btnWrapper = document.createElement('div');
            btnWrapper.setAttribute('role', 'listitem');
            
            const btn = document.createElement('button');
            btn.className = 'share-btn';
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-label', 'Copy link to clipboard');
            btn.innerHTML = icons.link;
            btn.onclick = () => handleCopyLink(btn);
            
            btnWrapper.appendChild(btn);
            buttonsWrapper.appendChild(btnWrapper);
        }

        // More dropdown
        if (options.showMore !== false) {
            const moreWrapper = document.createElement('div');
            moreWrapper.className = 'share-more';
            moreWrapper.setAttribute('role', 'listitem');

            const moreBtn = document.createElement('button');
            moreBtn.className = 'share-btn';
            moreBtn.setAttribute('type', 'button');
            moreBtn.setAttribute('aria-label', 'More sharing options');
            moreBtn.setAttribute('aria-expanded', 'false');
            moreBtn.setAttribute('aria-haspopup', 'true');
            moreBtn.innerHTML = icons.more;

            const dropdownId = 'share-dropdown-' + Math.random().toString(36).substr(2, 9);
            const dropdown = document.createElement('div');
            dropdown.className = 'share-dropdown';
            dropdown.id = dropdownId;
            dropdown.setAttribute('role', 'menu');
            dropdown.setAttribute('aria-label', 'Additional sharing options');
            dropdown.innerHTML = `
                <button type="button" role="menuitem" data-platform="reddit">Reddit</button>
                <button type="button" role="menuitem" data-platform="telegram">Telegram</button>
                <button type="button" role="menuitem" data-platform="email">Email</button>
            `;

            moreBtn.setAttribute('aria-controls', dropdownId);

            moreBtn.onclick = (e) => {
                e.stopPropagation();
                const isExpanded = dropdown.classList.toggle('show');
                moreBtn.setAttribute('aria-expanded', isExpanded);
                
                // Focus first menu item when opening
                if (isExpanded) {
                    const firstMenuItem = dropdown.querySelector('[role="menuitem"]');
                    if (firstMenuItem) {
                        setTimeout(() => firstMenuItem.focus(), 0);
                    }
                }
            };

            dropdown.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                if (platform) {
                    handleShare(platform);
                    dropdown.classList.remove('show');
                    moreBtn.setAttribute('aria-expanded', 'false');
                    moreBtn.focus();
                }
            });

            // Keyboard navigation for dropdown
            dropdown.addEventListener('keydown', (e) => {
                const menuItems = Array.from(dropdown.querySelectorAll('[role="menuitem"]'));
                const currentIndex = menuItems.indexOf(document.activeElement);

                switch(e.key) {
                    case 'Escape':
                        dropdown.classList.remove('show');
                        moreBtn.setAttribute('aria-expanded', 'false');
                        moreBtn.focus();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        if (currentIndex < menuItems.length - 1) {
                            menuItems[currentIndex + 1].focus();
                        }
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        if (currentIndex > 0) {
                            menuItems[currentIndex - 1].focus();
                        }
                        e.preventDefault();
                        break;
                    case 'Home':
                        menuItems[0].focus();
                        e.preventDefault();
                        break;
                    case 'End':
                        menuItems[menuItems.length - 1].focus();
                        e.preventDefault();
                        break;
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!moreWrapper.contains(e.target)) {
                    dropdown.classList.remove('show');
                    moreBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close dropdown on Escape key
            moreBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                    moreBtn.setAttribute('aria-expanded', 'false');
                    e.preventDefault();
                }
            });

            moreWrapper.appendChild(moreBtn);
            moreWrapper.appendChild(dropdown);
            buttonsWrapper.appendChild(moreWrapper);
        }

        container.appendChild(buttonsWrapper);
        element.appendChild(container);

        return {};
    }
};