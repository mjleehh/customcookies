export default interface PathBrush {
    lineTo(x: number, y: number): void
    horizontalLineTo(x: number): void
    verticalLineTo(y: number): void
    quadricCurveTo(cx: number, cy: number, x: number, y: number): void
    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void
    continuousCurveTo(c2x: number, c2y: number, x: number, y: number): void
    closePath(): void
    finalize(): void
}

export type createPathBrush<T extends PathBrush> = (x: number, y: number) => T
