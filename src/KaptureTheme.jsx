import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import { useSelector } from "react-redux"

const KaptureTheme = ({ children }) => {
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme)
    return (
        <>
            <ThemeProvider theme={mainTheme}>{children}</ThemeProvider>
        </>
    )
}

export default KaptureTheme
