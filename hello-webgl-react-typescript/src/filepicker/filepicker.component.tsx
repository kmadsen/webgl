import React from 'react'

const FileInputComponent = () => {
  const fileInput: React.RefObject<HTMLInputElement> = React.createRef()
  return (
    <div>
      <input
        type="file"
        onChange={
          (e: React.FormEvent<HTMLInputElement>) => {
            const newValue = e.currentTarget.value;
            console.log(`file input changed ${newValue}`)
            console.log(newValue)
          }
        }
        ref={fileInput}
        />
    </div>
  )
}

const FilePickerComponent = () => {
  return <FileInputComponent />
};

export default FilePickerComponent;