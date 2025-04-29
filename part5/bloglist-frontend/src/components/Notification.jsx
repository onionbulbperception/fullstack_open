const Notification = ({ message, type }) => {
    if (!message) return null // if no message, return null

    const notificationStyle = {
        color: type === 'error' ? 'red' : 'green',
        background: type === 'error' ? '#f8d7da' : '#d4edda',
        border: type === 'error' ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        fontSize: '24px'
    }
  
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }
  
  export default Notification