export default {
    name: 'click-counter',
    version: '1.0.0',
    
    mount: function(element, options) {
        // Start counter at 0
        var count = 0;
        
        // Update text when clicked
        element.addEventListener('click', function() {
            count = count + 1;
            element.textContent = 'Clicks: ' + count;
        });
        
        // Return an object (ContentBox needs this)
        return { count: count };
    }
};