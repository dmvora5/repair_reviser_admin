'use client'

import { store } from '@/redux/store';
import { SessionProvider } from 'next-auth/react'
import { Provider } from "react-redux";

const Providers = ({ children, ...rest }: any) => {
    return (
        <>
            <Provider store={store}>
                <SessionProvider {...rest}>
                        {children}
                </SessionProvider>
            </Provider>
        </>
    )

}

export default Providers