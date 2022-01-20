export default interface PathBrush {
    begin(x: number, y: number): void
    lineTo(x: number, y: number): void
    quadricCurveTo(cx: number, cy: number, x: number, y: number): void
    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void
    close(): void
    finalize(): void
}
