import React from 'react'

const Notification = ({ message, typeError }) => {
    if (message === null) {
      return (<div/>)
    }
    if (typeError !== "1"){
        return (
        <div className="info">
            {message}
        </div>
        )
    }
    else{
        return (
        <div id="error" className="error">
            {message}
        </div>
        )
    }
  }

  export default Notification