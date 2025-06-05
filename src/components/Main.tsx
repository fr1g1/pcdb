import { Grid, GridColProps, GridProps } from "@mantine/core"
import React from "react"

import { useFetchAllPcs } from "../hooks/useService"
import { Card } from "./Card"

type Props = React.PropsWithChildren<{
    colSpan: GridColProps["span"]
    gutter: GridProps["gutter"]
}>

export const Main: React.FC<Props> = ({ colSpan, gutter }) => {
    const { data, isLoading, error } = useFetchAllPcs()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <Grid gutter={gutter} justify="center">
            {data?.map(({ id }) => (
                <Grid.Col span={colSpan} key={id}>
                    <Card pcId={id} />
                </Grid.Col>
            ))}
        </Grid>
    )
}
