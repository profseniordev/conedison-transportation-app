import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';

import './UploadPhoto.scss';
import PreviewImage from '../../Components/ImageUpload/PreviewImage';

interface Props {
  onChangeImage: (images) => void;
  defaultImages?: any;
  disabled?: boolean;
}

const UploadPhoto: React.FC<Props> = ({
  defaultImages = [],
  onChangeImage,
  disabled = false,
}) => {
  const [images, setImages] = useState([...defaultImages]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const newImages = [...images];
      setImages([...newImages, ...acceptedFiles]);
      onChangeImage([...newImages, ...acceptedFiles]);
    },
    disabled: disabled,
  });

  const removeImage = (idx) => {
    const newImages = [...images];
    if (idx > -1) {
      newImages.splice(idx, 1);
    }
    setImages(newImages);
    onChangeImage(newImages);
  };

  useEffect(
    () => () => {
      images.forEach((image) => {
        if (typeof image !== 'string') {
          URL.revokeObjectURL(image.preview);
        }
      });
    },
    [images]
  );

  return (
    <div className="displayFlex">
      <div>
        <div className="form-group">
          <div {...getRootProps({})}>
            <input {...getInputProps()} />
            <label className="upload-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AttachFileIcon />}
              >
                Browse Files
              </Button>
            </label>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap images-row">
        {images.map((image, index) =>
          typeof image === 'string' ? (
            <div key={String(index)}>
              <PreviewImage
                url={`${image}`}
                onRemove={() => removeImage(index)}
              />
            </div>
          ) : (
            <div key={String(index)}>
              <PreviewImage
                url={URL.createObjectURL(image)}
                onRemove={() => removeImage(index)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
