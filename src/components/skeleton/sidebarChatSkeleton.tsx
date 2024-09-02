import React from 'react'

function SidebarChatSkeleton() {
  return (
    <div>
      <div className="flex w-full justify-start">
        <div className="loading-container flex w-full flex-col">
            <div className="loading-bar h-1 justify-center"></div>
          <div className="loading-bar h-3 justify-center"></div>
          <div className="loading-bar h-3"></div>
          <div className="loading-bar h-3"></div>
        </div>
      </div>
    </div>
  )
}

export default SidebarChatSkeleton
