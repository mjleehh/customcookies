export type Command = {
    name: string,
    params: number[]
    isRelative: boolean
}

export type SvgPath = {
    move: Command,
    commands: Command[],
    isClosed: boolean,
}
