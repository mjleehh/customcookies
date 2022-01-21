export const MOVE_NAMES = 'Mm'
export const NON_MOVE_NAMES = 'LlHhVvCcSsQqTtAa'

export const MOVE_NAME_SYMS = `[${MOVE_NAMES}]`
export const NON_MOVE_NAME_SYMS = `[${NON_MOVE_NAMES}]`
export const ALL_NAME_SYMS = `[${MOVE_NAMES}${NON_MOVE_NAMES}]`

export const NON_COMMAND_SYMS = '[\-0-9. ,]'
export const DELIMITER_SYMS = /[ ,]/
export const CLOSER_SYMS = '[Zz]'

export const PATH_PATTERN = `(${MOVE_NAME_SYMS}${NON_COMMAND_SYMS}+)((${NON_MOVE_NAME_SYMS}${NON_COMMAND_SYMS}+)*)(${CLOSER_SYMS}?)`

export const pathRegExp = new RegExp(`^${PATH_PATTERN}$`)

export const pathsRegExp = new RegExp(`^(${PATH_PATTERN}\\s*)+$`)

export const commandRegExp = new RegExp(`(${ALL_NAME_SYMS})(${NON_COMMAND_SYMS}+)`)