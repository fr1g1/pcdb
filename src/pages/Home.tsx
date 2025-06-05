import {
    ActionIcon,
    AppShell,
    GridColProps,
    GridProps,
    Group,
    Title,
    useMantineTheme,
} from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react"
import React from "react"

import { Main } from "../components/Main"

type ViewType = "grid" | "list"

type View = {
    [key in ViewType]: {
        gutter: GridProps["gutter"]
        icon: React.ReactNode
        span: GridColProps["span"]
    }
}

const view: View = {
    grid: {
        gutter: { base: "xs", md: "sm" },
        icon: <IconLayoutList size={24} />,
        span: { base: 12, sm: 6, lg: 4, xl: 3 },
    },
    list: {
        gutter: { base: "xs", md: "sm" },
        icon: <IconLayoutGrid size={24} />,
        span: { base: 12 },
    },
}

export const Home: React.FC = () => {
    const theme = useMantineTheme()
    const [viewType, toggleView] = useToggle<ViewType>(["grid", "list"])

    return (
        <AppShell header={{ height: { base: 60, md: 70 } }} padding="md">
            <AppShell.Header>
                <Group h="100%" px="lg">
                    <Title c={theme.primaryColor} order={2}>
                        PCDB
                    </Title>
                    <div style={{ flex: 1 }} />
                    <ActionIcon visibleFrom="sm" size="xl" variant="subtle" onClick={() => toggleView()}>
                        {view[viewType].icon}
                    </ActionIcon>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Main colSpan={view[viewType].span} gutter={view[viewType].gutter} />
            </AppShell.Main>
        </AppShell>
    )
}
