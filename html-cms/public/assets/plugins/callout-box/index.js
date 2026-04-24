/*
Usage:

<div data-cb-type="callout-box" data-cb-style="info" class="callout-box callout-info">
    <h3 class="edit">Important Information</h3>
    <div class="is-subblock edit">
        <p>This is an important message with <strong>formatting</strong>!</p>
        <p>You can add multiple paragraphs and <a href="#">links</a>.</p>
    </div>
</div>
*/

export default {
    name: 'callout-box',
    displayName: 'Callout Box',
    version: '1.0.0',

    settings: {
        style: {
            type: 'select',
            label: 'Style',
            defaultValue: 'info',
            options: [
                { value: 'info', label: 'Info' },
                { value: 'success', label: 'Success' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' }
            ]
        }
    },

    editor: {
        openContentEditor: function (element, builder, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'padding: 12px;';
            
            const info = document.createElement('div');
            info.style.cssText = 'font-size: 13px; color: #666; line-height: 1.6;';
            info.innerHTML = `
                <p><strong>Editable Content:</strong></p>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    <li><strong>Title</strong> - Simple text editing (single line)</li>
                    <li><strong>Content</strong> - Rich text editing (formatting enabled)</li>
                </ul>
                <p style="margin-top: 12px;">
                    <em>Click directly on the text in the preview to edit it.</em>
                </p>
            `;
            
            container.appendChild(info);
            return container;
        }
    },

    mount: function (element, options) {
        // Apply style class
        const style = options.style || 'info';
        element.className = `callout-box callout-${style}`;
        
        return {};
    }
};