import {Mesh} from './types'

export default function serializeObj(mesh: Mesh): string {
    const vertices = mesh.vertices.map(v => `v ${v[0]} ${v[1]} ${v[2]}`).join('\n')
    const facesWithShiftedIndices = mesh.faces.map(indices => indices.map(index => index + 1))
    const faces = facesWithShiftedIndices.map(f => 'f ' + f.join(' ')).join('\n')

    return vertices + '\n\n' + faces + '\n\n'
}