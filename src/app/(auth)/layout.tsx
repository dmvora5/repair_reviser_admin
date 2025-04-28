import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex justify-center items-center bg-authBlack w-full h-screen'>
            {children}
        </div>
    )
}

export default AuthLayout