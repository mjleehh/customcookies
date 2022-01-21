export type Command = {
    name: string,
    params: number[]
    isRelative: boolean
}

export type SvgPathSegment = {
    move: Command,
    commands: Command[],
    isClosed: boolean,
}

export type SvgPath = SvgPathSegment[]
