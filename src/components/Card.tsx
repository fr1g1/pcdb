import { Card as MCard, Divider, Text, Title, Stack, Blockquote, Input, Button, ActionIcon, Group } from "@mantine/core"
import React from "react"

import { DiskKeyTranslates, Id, Pc, RamStickKeyTranslates } from "../types"
import { useDrawer } from "../hooks/useDrawer"
import { useDeletePc, useFetchAllPcs, useFetchPc, useUpdateNote } from "../hooks/useService"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { Field, PreviewField, SubField } from "./Field"
import { diskKeyTranslates, pcKeyTranslates, ramStickKeyTranslates } from "../constants"

type Props = {
    pcId: Id
}

export const Card: React.FC<Props> = ({ pcId }) => {
    const drawer = useDrawer()
    const { data: pc, error, isPending, isError, refetch } = useFetchPc(pcId)
    const { refetch: refetchAllPcs } = useFetchAllPcs()
    const { mutate: deletePc } = useDeletePc({
        onFinish: () => {
            drawer.close()
            refetchAllPcs()
        }
    })

    if (isPending) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <Blockquote color="red">{error.message}</Blockquote>
    }

    if (!pc) {
        return <Blockquote color="red">No data</Blockquote>
    }

    const title = (
        <Title order={4} lineClamp={1}>
            {pc.host}
        </Title>
    )

    return (
        <MCard
            p="md"
            radius="md"
            style={{ cursor: "pointer" }}
            onClick={() => {
                drawer.open({
                    body: <DrawerCard pc={pc} refetch={refetch} onDelete={() => void deletePc({ pcId })} />,
                    title: <div>{title}</div>, // Needs to be wrapped in `div`. Otherwise cause console error. 
                })
            }}
            withBorder
        >
            {title}

            <MCard.Section>
                <Divider my="xs" />
            </MCard.Section>

            <PreviewField
                title="CPU"
                value={pc.cpu}
            />
            <PreviewField
                title="RAM"
                value={`${pc.ram_total_gb} GB`}
            />
            <PreviewField
                title="Resolution"
                value={pc.resolution}
            />
            <PreviewField
                title="Notes"
                value={pc.notes}
            />
        </MCard>
    )
}

const DrawerCard: React.FC<{ pc: Pc, refetch: () => void, onDelete: () => void }> = ({ pc, refetch, onDelete }) => {
    const [data, setData] = React.useState(pc)
    const [notes, setNotes] = React.useState(data.notes)
    const [isEditing, setIsEditing] = React.useState(false)
    const { mutate: updateNote, isPending } = useUpdateNote({
        onFinish: () => {
            setIsEditing(false)
        },
        onSuccess: notes => {
            setData(value => ({ ...value, notes }))
            refetch()
        },
    })

    return (
        <Stack>
            <Field title={pcKeyTranslates.cpu} value={data.cpu} />
            <Field
                title={pcKeyTranslates.disks}
                value={(
                    <>
                        {data.disks.map((disk, index) => {
                            return (
                                // TODO: Use id as key
                                <Stack key={index} gap={0} ml={"lg"}>
                                    {Object.entries(disk).map(([key, value], index) => (
                                        <SubField
                                            // TODO: Use id as key
                                            key={index}
                                            title={diskKeyTranslates[key as keyof DiskKeyTranslates]}
                                            value={value}
                                        />
                                    ))}
                                    {index !== data.disks.length - 1 && <Divider my="xs" />}
                                </Stack>
                            )
                        })}
                    </>
                )}
            />
            <Field
                title={pcKeyTranslates.gpus}
                value={(
                    <>
                        {data.gpus.map((gpu, index) => (
                            // TODO: Use id as key
                            <Text key={index} size="sm" lineClamp={1}>
                                {gpu}
                            </Text>
                        ))}
                    </>
                )}
            />
            <Field title={pcKeyTranslates.host} value={data.host} />
            <Field title={pcKeyTranslates.id} value={data.id} />
            <Field title={pcKeyTranslates.mainboard} value={data.mainboard} />
            <Field title={pcKeyTranslates.ram_slots} value={data.ram_slots} />
            <Field
                title={pcKeyTranslates.ram_sticks}
                value={(
                    <>
                        {data.ram_sticks.map((ramStick, index) => {
                            return (
                                // TODO: Use id as key
                                <Stack key={index} gap={0} ml={"lg"}>
                                    {Object.entries(ramStick).map(([key, value], index) => (
                                        <SubField
                                            // TODO: Use id as key
                                            key={index}
                                            title={ramStickKeyTranslates[key as keyof RamStickKeyTranslates]}
                                            value={value}
                                        />
                                    ))}
                                    {index !== data.ram_sticks.length - 1 && <Divider my="xs" />}
                                </Stack>
                            )
                        })}
                    </>
                )}
            />
            <Field title={pcKeyTranslates.ram_total_gb} value={`${data.ram_total_gb}`} />
            <Field title={pcKeyTranslates.resolution} value={data.resolution} />
            <Field title={pcKeyTranslates.serial} value={data.serial} />
            <Stack gap={0}>
                <Group gap="sm">
                    <Title order={5}>{pcKeyTranslates.notes}:</Title>
                    {!isEditing && (
                        <ActionIcon
                            onClick={() => void setIsEditing(true)}
                            variant="light"
                            size="sm"
                        >
                            <IconEdit />
                        </ActionIcon>
                    )}
                </Group>
                {isEditing ? (
                    <Stack>
                        <Input
                            placeholder="Clearable input"
                            value={notes}
                            onChange={(event) => setNotes(event.currentTarget.value)}
                            rightSectionPointerEvents="all"
                            mt="md"
                            disabled={isPending}
                        />
                        <Group>
                            <Button
                                onClick={() => void setIsEditing(false)}
                                disabled={isPending}
                                loading={isPending}
                                variant="outline"
                            >
                                {'Cancel'}
                            </Button>
                            <Button
                                onClick={() => {
                                    updateNote({ notes: notes, pc_id: data.id })
                                }}
                                disabled={isPending}
                                loading={isPending}
                            >
                                {'Save'}
                            </Button>
                        </Group>
                    </Stack>
                ) : (
                    <Text size="md" lineClamp={20}>
                        {data.notes}
                    </Text>
                )}
            </Stack>
            <Button
                color="red"
                leftSection={<IconTrash size={18} />}
                onClick={onDelete}
            >
                {"Delete pc"}
            </Button>
        </Stack>
    )
}
