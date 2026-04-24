/*
Usage:

<div data-cb-type="video-embed" style="--border-radius: 8px;" data-cb-autoplay="true" data-cb-loop="true" data-cb-muted="true" data-cb-controls="true" data-cb-plays-inline="true" data-cb-aspect-ratio="auto" data-cb-object-fit="cover" data-cb-border-radius="8" data-cb-show-overlay="false" data-cb-overlay-opacity="10" data-cb-overlay-color="#000000">
    <div class="video-wrapper">
        <video>
            <source src="assets/minimalist-blocks/images/ai-cQ5ST.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
</div>
*/

export default {
    name: 'video-embed',
    displayName: 'Video Embed',
    version: '1.0.0',

    settings: {
        _groups: [
            {
                id: 'video',
                label: 'Video Settings',
                fields: ['autoplay', 'loop', 'muted', 'controls', 'playsInline']
            },
            {
                id: 'display',
                label: 'Display Options',
                fields: ['aspectRatio', 'objectFit', 'borderRadius']
            }
        ],
        autoplay: {
            type: 'boolean',
            label: 'Autoplay',
            default: false,
            group: 'video'
        },
        loop: {
            type: 'boolean',
            label: 'Loop',
            default: false,
            group: 'video'
        },
        muted: {
            type: 'boolean',
            label: 'Muted',
            default: false,
            group: 'video'
        },
        controls: {
            type: 'boolean',
            label: 'Show Controls',
            default: true,
            group: 'video'
        },
        playsInline: {
            type: 'boolean',
            label: 'Plays Inline (Prevent Fullscreen on Mobile)',
            default: true,
            group: 'video'
        },
        aspectRatio: {
            type: 'select',
            label: 'Aspect Ratio',
            default: '16/9',
            options: [
                { value: '16/9', label: '16:9 (Widescreen)' },
                { value: '4/3', label: '4:3 (Standard)' },
                { value: '1/1', label: '1:1 (Square)' },
                { value: '21/9', label: '21:9 (Ultrawide)' },
                { value: '9/16', label: '9:16 (Vertical/Story)' },
                { value: 'auto', label: 'Auto (Original)' }
            ],
            group: 'display'
        },
        objectFit: {
            type: 'select',
            label: 'Video Fit',
            default: 'cover',
            options: [
                { value: 'cover', label: 'Cover (Fill)' },
                { value: 'contain', label: 'Contain (Fit)' },
                { value: 'fill', label: 'Fill (Stretch)' },
                { value: 'none', label: 'None (Original)' }
            ],
            group: 'display'
        },
        borderRadius: {
            type: 'number',
            label: 'Border Radius',
            default: 8,
            min: 0,
            max: 50,
            step: 1,
            unit: 'px',
            group: 'display'
        }
    },

    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');

            // Get current video element
            const videoWrapper = element.querySelector('.video-wrapper');
            const video = videoWrapper ? videoWrapper.querySelector('video') : null;
            const source = video ? video.querySelector('source') : null;

            // Video URL Input Section
            const urlSection = document.createElement('div');
            urlSection.className = 'editor-section';

            const urlLabel = document.createElement('label');
            urlLabel.textContent = 'Video URL';
            urlLabel.className = 'editor-label';

            const urlGroup = document.createElement('div');
            urlGroup.style.cssText = 'display: flex; gap: 4px;';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = 'Enter video URL (mp4, webm, ogg)';
            urlInput.value = source ? source.getAttribute('src') || '' : '';
            urlInput.className = 'url-input';
            urlInput.style.cssText = 'flex: 1;';

            const browseBtn = document.createElement('button');
            browseBtn.type = 'button';
            browseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            browseBtn.style.cssText = 'width: 45px;';
            browseBtn.onclick = (e) => {
                e.preventDefault();
                builder.openFilePicker('video', (url) => {
                    urlInput.value = url;
                    updateVideoSource(url);
                });
            };

            urlGroup.appendChild(urlInput);
            urlGroup.appendChild(browseBtn);

            urlSection.appendChild(urlLabel);
            urlSection.appendChild(urlGroup);

            // Video Preview Section
            const previewSection = document.createElement('div');
            previewSection.className = 'editor-section';

            const previewLabel = document.createElement('label');
            previewLabel.textContent = 'Preview';
            previewLabel.className = 'editor-label';

            const previewWrapper = document.createElement('div');
            previewWrapper.style.cssText = `
                width: 100%;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;`;

            const previewVideo = document.createElement('video');
            previewVideo.controls = true;
            previewVideo.muted = true;
            previewVideo.style.cssText = 'width:100%;height:auto;display:block';
                    
            if (source && source.src) {
                const previewSource = document.createElement('source');
                previewSource.src = source.src;
                previewSource.type = source.type || 'video/mp4';
                previewVideo.appendChild(previewSource);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'preview-placeholder';
                placeholder.textContent = 'No video selected';
                previewWrapper.appendChild(placeholder);
            }

            if (source && source.src) {
                previewWrapper.appendChild(previewVideo);
            }

            previewSection.appendChild(previewLabel);
            previewSection.appendChild(previewWrapper);

            // Poster Image Section
            const posterSection = document.createElement('div');
            posterSection.className = 'editor-section';

            const posterLabel = document.createElement('label');
            posterLabel.textContent = 'Poster Image (Optional)';
            posterLabel.className = 'editor-label';

            const posterGroup = document.createElement('div');
            posterGroup.style.cssText = 'display: flex; gap: 4px;';

            const posterInput = document.createElement('input');
            posterInput.type = 'text';
            posterInput.placeholder = 'Poster image URL';
            posterInput.value = video ? video.getAttribute('poster') || '' : '';
            posterInput.className = 'url-input';
            posterInput.style.cssText = 'flex: 1;';

            const posterBrowseBtn = document.createElement('button');
            posterBrowseBtn.type = 'button';
            posterBrowseBtn.innerHTML = '<svg><use xlink:href="#icon-folder"></use></svg>';
            posterBrowseBtn.style.cssText = 'width: 45px;';
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

            // Helper Functions
            function updateVideoSource(url) {
                if (!url) return;

                const videoWrapper = element.querySelector('.video-wrapper');
                let video = videoWrapper.querySelector('video');

                if (!video) {
                    video = document.createElement('video');
                    videoWrapper.appendChild(video);
                }

                // Get video type from extension
                const ext = url.split('.').pop().toLowerCase();
                const typeMap = {
                    'mp4': 'video/mp4',
                    'webm': 'video/webm',
                    'ogg': 'video/ogg',
                    'mov': 'video/mp4'
                };
                const videoType = typeMap[ext] || 'video/mp4';

                // Update or create source element
                let source = video.querySelector('source');
                if (!source) {
                    source = document.createElement('source');
                    video.appendChild(source);
                }
                source.src = url;
                source.type = videoType;
                video.load();

                // Update preview
                previewWrapper.innerHTML = '';
                const newPreview = document.createElement('video');
                newPreview.controls = true;
                newPreview.muted = true;
                newPreview.style.cssText = 'width:100%;height:auto;display:block';
                const previewSource = document.createElement('source');
                previewSource.src = url;
                previewSource.type = videoType;
                newPreview.appendChild(previewSource);
                previewWrapper.appendChild(newPreview);

                onChange();
            }

            function updatePosterImage(url) {
                const videoWrapper = element.querySelector('.video-wrapper');
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

            // Event Listeners
            urlInput.addEventListener('input', () => {
                const url = urlInput.value.trim();
                if (url) {
                    updateVideoSource(url);
                }
            });

            posterInput.addEventListener('input', () => {
                updatePosterImage(posterInput.value.trim());
            });

            // Info Section
            const infoSection = document.createElement('div');
            infoSection.className = 'editor-section info-section';
            infoSection.innerHTML = `
                <div class="info-box">
                    <strong>💡 Tips:</strong>
                    <ul>
                        <li>Supported formats: MP4, WebM, OGG</li>
                        <li>Use poster image for better loading experience</li>
                    </ul>
                </div>
            `;

            // Append all sections
            container.appendChild(urlSection);
            container.appendChild(previewSection);
            container.appendChild(posterSection);
            // container.appendChild(infoSection);

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
                }

                .preview-placeholder {
                    color: #9ca3af;
                    font-size: 14px;
                    text-align: center;
                    padding: 40px 20px;
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
                    margin-bottom: 8px;
                    color: #1e3a8a;
                }

                .info-box ul {
                    margin: 0;
                    padding-left: 20px;
                }

                .info-box li {
                    margin-bottom: 4px;
                    line-height: 1.5;
                }
            `;
            container.appendChild(style);

            return container;
        }
    },

    mount: function(element, options) {
        const videoWrapper = element.querySelector('.video-wrapper');
        const video = videoWrapper ? videoWrapper.querySelector('video') : null;
        const overlay = element.querySelector('.video-overlay');

        if (!video) return {};

        // Apply video settings
        video.autoplay = options.autoplay || false;
        video.loop = options.loop || false;
        video.muted = options.muted || false;
        video.controls = options.controls !== false;
        video.playsInline = options.playsInline !== false;
        
        // Ensure video is visible
        video.style.display = 'block';
        video.style.width = '100%';
        video.style.height = '100%';

        // Apply wrapper styles
        const aspectRatio = options.aspectRatio || '16/9';
        if (aspectRatio !== 'auto') {
            videoWrapper.style.aspectRatio = aspectRatio;
            videoWrapper.style.height = 'auto';
        } else {
            videoWrapper.style.aspectRatio = '';
            videoWrapper.style.height = 'auto';
        }

        // Apply video styles
        video.style.objectFit = options.objectFit || 'cover';
        // Allow 0 border radius by checking if value exists
        const borderRadius = options.borderRadius !== undefined ? options.borderRadius : 8;
        videoWrapper.style.borderRadius = borderRadius + 'px';
        
        // Ensure wrapper displays properly
        videoWrapper.style.display = 'block';
        videoWrapper.style.position = 'relative';
        videoWrapper.style.overflow = 'hidden';


        // Set CSS custom properties for responsive behavior
        element.style.setProperty('--border-radius', borderRadius + 'px');
        
        // Load the video
        video.load();

        return {};
    }
};