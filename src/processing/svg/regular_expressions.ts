export const MOVE_NAMES = 'Mm'
export const NON_MOVE_NAMES = 'LlHhVvCcSsQqTtAa'

export const MOVE_NAME_CHARS = `[${MOVE_NAMES}]`
export const NON_MOVE_NAME_CHARS = `[${NON_MOVE_NAMES}]`
export const ALL_NAME_CHARS = `[${MOVE_NAMES}${NON_MOVE_NAMES}]`

export const NON_COMMAND_CHARS = '[\-0-9. ,]'
export const DELIMITER_CHARS = /[ ,]/
export const CLOSER_CHARS = '[Zz]'

export const PATH_PATTERN = `(${MOVE_NAME_CHARS}${NON_COMMAND_CHARS}+)((${NON_MOVE_NAME_CHARS}${NON_COMMAND_CHARS}+)*)(${CLOSER_CHARS}?)`

export const pathRegExp = new RegExp(`^${PATH_PATTERN}$`)

export const pathsRegExp = new RegExp(`^(${PATH_PATTERN}\\s*)+$`)

export const commandRegExp = new RegExp(`(${ALL_NAME_CHARS})(${NON_COMMAND_CHARS}+)`)