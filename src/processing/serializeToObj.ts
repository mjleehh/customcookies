import {Mesh} from 'src/geometry/types'

export default function serializeToObj(meshes: Mesh[]): string {
    let offset = 1
    let vertices = ''
    let faces = ''

    for (let mesh of meshes) {
        vertices += mesh.vertices.map(v => `v ${v[0]} ${v[1]} ${v[2]}`).join('\n') + '\n'
        const facesWithShiftedIndices = mesh.faces.map(indices => indices.map(index => index + offset))
        faces += facesWithShiftedIndices.map(f => 'f ' + f.join(' ')).join('\n') + '\n'
        offset += mesh.vertices.length
    }
    return vertices + '\n\n' + faces + '\n\n'
}
