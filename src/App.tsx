import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { QueryClientProvider } from "@tanstack/react-query"

import { DrawerProvider } from "./hooks/useDrawer"
import { queryClient } from "./hooks/useService"
import { Home } from "./pages/Home"
import { theme } from "./theme"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <DrawerProvider>
                    <Home />
                </DrawerProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
