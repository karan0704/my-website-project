// ============================================================================
// MESSAGE COMPONENT - Display success/error/info messages
// ============================================================================
// This component shows user feedback messages with appropriate styling

import React from 'react';

// MESSAGE COMPONENT DEFINITION
// ============================
// Props explanation:
// - message: Text to display
// - type: Message type (success, error, warning, info)
const Message = ({ message, type = "info" }) => {
    // Don't render anything if no message
    if (!message) return null;

    console.log(`💬 Displaying ${type} message: ${message}`);

    // DYNAMIC CSS CLASS GENERATION
    // =============================
    // Create CSS class based on message type
    const getMessageClass = () => {
        return `message message-${type}`;  // Examples: message-success, message-error
    };

    // ICON SELECTION
    // ==============
    // Choose appropriate icon based on message type
    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';     // Green checkmark for success
            case 'error': return '❌';       // Red X for errors
            case 'warning': return '⚠️';     // Yellow warning for warnings
            default: return 'ℹ️';           // Blue info for general info
        }
    };

    return (
        <div className={getMessageClass()}>
            {/* MESSAGE ICON */}
            <span className="message-icon">
        {getIcon()}
      </span>

            {/* MESSAGE TEXT */}
            <span className="message-text">
        {message}
      </span>
        </div>
    );
};

// Export component for use in other files
export default Message;
