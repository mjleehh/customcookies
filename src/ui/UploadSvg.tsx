import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import extractPathsFromSvg from 'src/processing/svg/extractPathsFromSvg'
import {useAppDispatch} from 'src/state/hooks'
import {setPathsDescriptions} from 'src/state/geometry'
import {Button} from 'antd'
import sampleSvg from '!!raw-loader!src/ui/sample_image.svg'

export default function UploadSvg() {
    const dispatch = useAppDispatch()

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                const binaryStr = reader.result as string
                const paths = extractPathsFromSvg(binaryStr)
                dispatch(setPathsDescriptions(paths))
            }
            reader.readAsBinaryString(file)
        })

    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop, maxFiles: 1,})

    function onSample() {
        const paths = extractPathsFromSvg(sampleSvg)
        dispatch(setPathsDescriptions(paths))
    }

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <Button onClick={onSample}>use example</Button>
        </div>
    )
}