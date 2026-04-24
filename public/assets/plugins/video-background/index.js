export default {
    name: 'video-background',
    displayName: 'Video Background',
    version: '1.0.0',

    contentbox: {
        // configure contentbox panel
        bg: false,
    },
    
    settings: {
        _groups: [
            {
                id: 'video',
                label: 'Video Settings',
                fields: ['autoplay', 'loop', 'muted', 'playsInline']
            },
            {
                id: 'controls',
                label: 'Control Buttons',
                fields: ['showPlayPause', 'showMuteUnmute', 'controlsPosition']
            },
            {
                id: 'overlay',
                label: 'Overlay Settings',
                fields: ['showOverlay', 'overlayOpacity', 'overlayColor']
            }
        ],
        autoplay: {
            type: 'boolean',
            label: 'Autoplay (requires muted video)',
            default: true,
            group: 'video'
        },
        loop: {
            type: 'boolean',
            label: 'Loop',
            default: true,
            group: 'video'
        },
        muted: {
            type: 'boolean',
            label: 'Muted',
            default: true,
            group: 'video'
        },
        playsInline: {
            type: 'boolean',
            label: 'Plays Inline (Prevent Fullscreen on Mobile)',
            default: true,
            group: 'video'
        },
        showPlayPause: {
            type: 'boolean',
            label: 'Show Play/Pause',
            default: false,
            group: 'controls'
        },
        showMuteUnmute: {
            type: 'boolean',
            label: 'Show Mute/Unmute',
            default: false,
            group: 'controls'
        },
        controlsPosition: {
            type: 'select',
            label: 'Controls Position',
            default: 'bottom-right',
            options: [
                { value: 'top-left', label: 'Top Left' },
                { value: 'top-right', label: 'Top Right' },
                { value: 'bottom-left', label: 'Bottom Left' },
                { value: 'bottom-right', label: 'Bottom Right' }
            ],
            group: 'controls'
        },
        showOverlay: {
            type: 'boolean',
            label: 'Show Overlay',
            default: true,
            group: 'overlay'
        },
        overlayOpacity: {
            type: 'range',
            label: 'Overlay Opacity',
            default: 40,
            min: 0,
            max: 100,
            step: 5,
            unit: '%',
            group: 'overlay'
        },
        overlayColor: {
            type: 'color',
            label: 'Overlay Color',
            default: '#000000',
            group: 'overlay'
        }
    },

    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');

            const videoWrapper = element.querySelector('.video-bg-wrapper');
            const video = videoWrapper ? videoWrapper.querySelector('video') : null;

            // Helper to get video sources
            const getVideoSources = () => {
                const sources = [];
                if (video) {
                    const sourceElements = video.querySelectorAll('source');
                    sourceElements.forEach(source => {
                        sources.push({
                            src: source.getAttribute('src') || '',
                            media: source.getAttribute('media') || '',
                            type: source.getAttribute('type') || 'video/mp4'
                        });
                    });
                }
                // If no sources, return default structure
                if (sources.length === 0) {
                    sources.push({ src: '', media: '(min-width: 1920px)', type: 'video/mp4' });
                    sources.push({ src: '', media: '(min-width: 1280px)', type: 'video/mp4' });
                    sources.push({ src: '', media: '(min-width: 768px)', type: 'video/mp4' });
                    sources.push({ src: '', media: '(max-width: 767px)', type: 'video/mp4' });
                }
                return sources;
            };

            const getDefaultVideoSource = () => {
                let src;
                if (video) {
                    const sourceElements = video.querySelectorAll('source');
                    sourceElements.forEach(source => {
                        if(!source.getAttribute('media')) {
                            src = source.getAttribute('src');
                        }
                    });
                }
                return src;
            };

            // Info Section
            const infoSection = document.createElement('div');
            infoSection.className = 'editor-section info-section';
            infoSection.innerHTML = `
                <div class="info-box">
                    <strong>📺 Responsive Video Sources</strong>
                    <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 1.5;">
                        Add different video files optimized for various screen sizes. 
                        The browser will automatically select the most appropriate video based on screen width.
                    </p>
                </div>
            `;

            // Video Sources Section
            const sourcesSection = document.createElement('div');
            sourcesSection.className = 'editor-section';

            const sourcesLabel = document.createElement('label');
            sourcesLabel.textContent = 'Video Sources (Responsive)';
            sourcesLabel.className = 'editor-label';
            sourcesLabel.style.marginBottom = '12px';

            const sourcesContainer = document.createElement('div');
            sourcesContainer.className = 'sources-container';

            // Predefined responsive breakpoints
            const breakpoints = [
                { label: '4K Desktop', media: '(min-width: 1920px)', placeholder: 'High resolution video for 4K displays' },
                { label: 'Tablet', media: '(max-width: 1280px)', placeholder: 'Tablet optimized video' },
                { label: 'Mobile', media: '(max-width: 760px)', placeholder: 'Mobile optimized video (smaller file)' }

                // { label: 'Desktop (1280px+)', media: '(min-width: 1280px)', placeholder: 'Standard desktop video' },
                // { label: 'Tablet (768px+)', media: '(min-width: 768px)', placeholder: 'Tablet optimized video' },
                // { label: 'Mobile (767px and below)', media: '(max-width: 767px)', placeholder: 'Mobile optimized video (smaller file)' }
            ];

            const currentSources = getVideoSources();

            // Default
            const sourceGroup = document.createElement('div');
            sourceGroup.className = 'source-group';

            const sourceLabel = document.createElement('div');
            sourceLabel.className = 'source-label';
            sourceLabel.textContent = 'Desktop (default)';

            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            const sourceInput = document.createElement('input');
            sourceInput.type = 'text';
            sourceInput.placeholder = '';
            sourceInput.className = 'url-input';
            
            // Set current value
            sourceInput.value = getDefaultVideoSource();

            const browseBtn = document.createElement('button');
            browseBtn.type = 'button';
            browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            browseBtn.className = 'browse-btn';
            browseBtn.onclick = (e) => {
                e.preventDefault();
                builder.openFilePicker('video', (url) => {
                    sourceInput.value = url;
                    updateVideoSources();
                });
            };

            sourceInput.addEventListener('input', () => {
                updateVideoSources();
            });

            inputGroup.appendChild(sourceInput);
            inputGroup.appendChild(browseBtn);

            sourceGroup.appendChild(sourceLabel);
            sourceGroup.appendChild(inputGroup);

            sourcesContainer.appendChild(sourceGroup);

            

            breakpoints.forEach((breakpoint, index) => {
                const sourceGroup = document.createElement('div');
                sourceGroup.className = 'source-group';

                const sourceLabel = document.createElement('div');
                sourceLabel.className = 'source-label';
                sourceLabel.textContent = breakpoint.label;

                const inputGroup = document.createElement('div');
                inputGroup.className = 'input-group';

                const sourceInput = document.createElement('input');
                sourceInput.type = 'text';
                sourceInput.placeholder = breakpoint.placeholder;
                sourceInput.className = 'url-input';
                sourceInput.dataset.media = breakpoint.media;
                
                // Set current value if exists
                const existingSource = currentSources.find(s => s.media === breakpoint.media);
                if (existingSource) {
                    sourceInput.value = existingSource.src;
                }

                const browseBtn = document.createElement('button');
                browseBtn.type = 'button';
                browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
                browseBtn.className = 'browse-btn';
                browseBtn.onclick = (e) => {
                    e.preventDefault();
                    builder.openFilePicker('video', (url) => {
                        sourceInput.value = url;
                        updateVideoSources();
                    });
                };

                sourceInput.addEventListener('input', () => {
                    updateVideoSources();
                });

                inputGroup.appendChild(sourceInput);
                inputGroup.appendChild(browseBtn);

                sourceGroup.appendChild(sourceLabel);
                sourceGroup.appendChild(inputGroup);

                sourcesContainer.appendChild(sourceGroup);
            });

            sourcesSection.appendChild(sourcesLabel);
            sourcesSection.appendChild(sourcesContainer);

            // Poster Image Section
            const posterSection = document.createElement('div');
            posterSection.className = 'editor-section';

            const posterLabel = document.createElement('label');
            posterLabel.textContent = 'Poster Image (Optional)';
            posterLabel.className = 'editor-label';

            const posterGroup = document.createElement('div');
            posterGroup.className = 'input-group';

            const posterInput = document.createElement('input');
            posterInput.type = 'text';
            posterInput.placeholder = 'Poster image URL (shown while loading)';
            posterInput.className = 'url-input';
            posterInput.value = video ? video.getAttribute('poster') || '' : '';

            const posterBrowseBtn = document.createElement('button');
            posterBrowseBtn.type = 'button';
            posterBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            posterBrowseBtn.className = 'browse-btn';
            posterBrowseBtn.onclick = (e) => {
                e.preventDefault();
                builder.openFilePicker('image', (url) => {
                    posterInput.value = url;
                    updatePosterImage(url);
                });
            };

            posterGroup.appendChild(posterInput);
            posterGroup.appendChild(posterBrowseBtn);

            posterSection.appendChild(posterLabel);
            posterSection.appendChild(posterGroup);

            posterInput.addEventListener('input', () => {
                updatePosterImage(posterInput.value.trim());
            });

            // Helper Functions
            function updateVideoSources() {
                const videoWrapper = element.querySelector('.video-bg-wrapper');
                let video = videoWrapper.querySelector('video');

                if (!video) {
                    video = document.createElement('video');
                    videoWrapper.appendChild(video);
                }

                // Clear existing sources
                video.innerHTML = '';

                // Collect all sources with URLs
                const sources = [];
                const sourceInputs = sourcesContainer.querySelectorAll('.url-input');
                sourceInputs.forEach(input => {
                    const url = input.value.trim();
                    if (url) {
                        sources.push({
                            url: url,
                            media: input.dataset.media || ''
                        });
                    }
                });

                // Add sources with media queries

                const mediaSources = [];
                let defaultSource = null;
                sources.forEach(sourceData => {
                    const source = document.createElement('source');
                    source.src = sourceData.url;
                
                    // Get video type from extension
                    const ext = sourceData.url.split('.').pop().toLowerCase().split('?')[0];
                    const typeMap = {
                        'mp4': 'video/mp4',
                        'webm': 'video/webm',
                        'ogg': 'video/ogg',
                        'mov': 'video/mp4'
                    };
                    source.type = typeMap[ext] || 'video/mp4';

                    if (sourceData.media) {
                        source.media = sourceData.media;
                        mediaSources.push(source);
                    } else {
                        defaultSource = source;
                    }
                });
                // Append media sources first
                mediaSources.forEach(src => video.appendChild(src));

                // default source added last
                video.appendChild(defaultSource);

                video.load();
                onChange();
            }

            function updatePosterImage(url) {
                const videoWrapper = element.querySelector('.video-bg-wrapper');
                const video = videoWrapper ? videoWrapper.querySelector('video') : null;
                if (video) {
                    if (url) {
                        video.setAttribute('poster', url);
                    } else {
                        video.removeAttribute('poster');
                    }
                    onChange();
                }
            }

            // Tips Section
            const tipsSection = document.createElement('div');
            tipsSection.className = 'editor-section info-section';
            tipsSection.innerHTML = `
                <div class="info-box tips-box">
                    <strong>💡 Best Practices:</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 12px; line-height: 1.6;">
                        <li><strong>Mobile video:</strong> Use smaller file size (compress more)</li>
                        <li><strong>Desktop video:</strong> Higher quality, larger file acceptable</li>
                        <li><strong>File formats:</strong> MP4 (best compatibility), WebM (smaller size)</li>
                        <li><strong>Poster image:</strong> Highly recommended for better loading experience</li>
                        <li><strong>Keep it short:</strong> 10-30 seconds loops work best</li>
                    </ul>
                </div>
            `;

            // Append all sections
            container.appendChild(infoSection);
            container.appendChild(sourcesSection);
            container.appendChild(posterSection);
            container.appendChild(tipsSection);

            // Add scoped styles for editor UI
            const style = document.createElement('style');
            style.textContent = `
                .editor-section {
                    margin-bottom: 20px;
                }

                .editor-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    font-size: 13px;
                    color: #374151;
                }

                .input-group {
                    display: flex;
                    gap: 6px;
                }

                .url-input {
                    flex: 1 !important;
                    min-width: 0;
                }

                .browse-btn {
                    width: 45px !important;
                    flex-shrink: 0;
                    padding: 8px 16px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: background 0.2s;
                }

                .browse-btn:hover {
                    background: #2563eb;
                }

                .sources-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .source-group {
                    background: #f9fafb;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }

                .source-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .info-section {
                    margin-top: 24px;
                }

                .info-box {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 6px;
                    padding: 12px;
                    font-size: 13px;
                    color: #1e40af;
                }

                .info-box strong {
                    display: block;
                    margin-bottom: 4px;
                    color: #1e3a8a;
                    font-size: 13px;
                }

                .tips-box {
                    background: #f0fdf4;
                    border-color: #bbf7d0;
                    color: #166534;
                }

                .tips-box strong {
                    color: #14532d;
                }

                .tips-box ul {
                    color: #166534;
                }
            `;
            container.appendChild(style);

            return container;
        }
    },

    mount: function(element, options) {
        const videoWrapper = element.querySelector('.video-bg-wrapper');
        const video = videoWrapper ? videoWrapper.querySelector('video') : null;
        const overlay = element.querySelector('.video-bg-overlay');

        if (!video) return {};

        // Apply video settings (no controls for background video)
        video.autoplay = options.autoplay !== false;
        video.loop = options.loop !== false;
        video.muted = options.muted !== false;
        video.playsInline = options.playsInline !== false;
        video.controls = false; // Never show controls for bg video
        
        // Ensure video is visible and fills container
        video.style.display = 'block';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover'; // Always cover for bg video

        // Apply overlay settings
        if (overlay) {
            if (options.showOverlay) {
                overlay.style.display = 'block';
                const opacity = options.overlayOpacity !== undefined ? options.overlayOpacity / 100 : 0.4;
                overlay.style.backgroundColor = options.overlayColor || '#000000';
                overlay.style.opacity = opacity;
            } else {
                overlay.style.display = 'none';
            }
        }

        // Create or update control buttons
        let controlsContainer = element.querySelector('.video-bg-controls');
        if (options.showPlayPause === true || options.showMuteUnmute === true) {
            if (!controlsContainer) {
                controlsContainer = document.createElement('div');
                controlsContainer.className = 'video-bg-controls';
                element.appendChild(controlsContainer);
            }
            controlsContainer.innerHTML = '';
        }

        if (options.showPlayPause === true) {
            // Play/Pause Button
            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'video-control-btn play-pause-btn';
            playPauseBtn.setAttribute('aria-label', 'Play/Pause');
            playPauseBtn.innerHTML = `
                <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
            `;
            controlsContainer.appendChild(playPauseBtn);

            // Play/Pause functionality
            playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const playIcon = playPauseBtn.querySelector('.play-icon');
                const pauseIcon = playPauseBtn.querySelector('.pause-icon');
                
                if (video.paused) {
                    video.play();
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    video.pause();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            });


            // Set initial icon states based on actual video state
            // Use setTimeout to ensure this runs after autoplay attempts complete
            setTimeout(() => {
                const playIcon = playPauseBtn.querySelector('.play-icon');
                const pauseIcon = playPauseBtn.querySelector('.pause-icon');
                if (options.autoplay) {
                    // If autoplay is enabled, show pause icon (video is playing)
                    playPauseBtn.querySelector('.play-icon').style.display = 'none';
                    playPauseBtn.querySelector('.pause-icon').style.display = 'block';
                } else {
                    // If autoplay is disabled, show play icon (video is paused)
                    playPauseBtn.querySelector('.play-icon').style.display = 'block';
                    playPauseBtn.querySelector('.pause-icon').style.display = 'none';
                }
            }, 100);
        }
        if (options.showMuteUnmute === true) {
            if (!controlsContainer) {
                controlsContainer = document.createElement('div');
                controlsContainer.className = 'video-bg-controls';
                element.appendChild(controlsContainer);
            }

            // Mute/Unmute Button
            const muteBtn = document.createElement('button');
            muteBtn.className = 'video-control-btn mute-btn';
            muteBtn.setAttribute('aria-label', 'Mute/Unmute');
            muteBtn.innerHTML = `
                <svg class="unmute-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
                </svg>
                <svg class="mute-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" /><path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" /><path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664" /><path d="M3 3l18 18" />
                </svg>
                `;
            controlsContainer.appendChild(muteBtn);

            // Mute/Unmute functionality
            muteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const unmuteIcon = muteBtn.querySelector('.unmute-icon');
                const muteIcon = muteBtn.querySelector('.mute-icon');
                
                video.muted = !video.muted;
                
                if (video.muted) {
                    unmuteIcon.style.display = 'none';
                    muteIcon.style.display = 'block';
                } else {
                    unmuteIcon.style.display = 'block';
                    muteIcon.style.display = 'none';
                }
            });

            // Set initial icon states based on actual video state
            // Use setTimeout to ensure this runs after autoplay attempts complete
            setTimeout(() => {
                if (options.muted) {
                    // If muted, show unmute icon
                    muteBtn.querySelector('.unmute-icon').style.display = 'none';
                    muteBtn.querySelector('.mute-icon').style.display = 'block';
                } else {
                    // If not muted, show mute icon
                    muteBtn.querySelector('.unmute-icon').style.display = 'block';
                    muteBtn.querySelector('.mute-icon').style.display = 'none';
                }
            }, 100);
        }
        
        if (options.showPlayPause === true || options.showMuteUnmute === true) {
            // Apply position
            const position = options.controlsPosition || 'bottom-right';
            controlsContainer.className = 'video-bg-controls ' + position;
            controlsContainer.style.display = 'flex';
        } else {
            if (controlsContainer) {
                controlsContainer.style.display = 'none';
            }
        }

        // Load the video
        video.load();

        return {};
    }
};