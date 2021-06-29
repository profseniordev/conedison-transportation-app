import { readFileSync } from 'fs';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';

import './ImageUpload.scss';
import PreviewImage from './PreviewImage';

interface Props {
  onChangeImage: (images) => void;
  defaultImages?: Array<any>;
  disabled?: boolean;
}

const ImageUpload: React.FC<Props> = ({
  defaultImages = [],
  onChangeImage,
  disabled = false,
}) => {
  const [images, setImages] = useState([...defaultImages]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const newImages = [...images];
      let files = [...newImages, ...acceptedFiles];
      files = files.filter((thing : any, index, self) => {
        if (index === self.findIndex((t: any) => {
          if(t.name === thing.name && t.path === thing.path) {
            return true;
          }
          return false;
        })) {
          return true;
        }
        alert('Image already present');
        return false;
      })
      setImages(files);
      onChangeImage(files);
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
        if (!image || image === 'null') {
          return null;
        }
        if (typeof image !== 'string') {
          URL.revokeObjectURL(image.preview);
        }
      });
    },
    [images]
  );

  return (
    <div>
      <div>
        <div>
          <div className="form-group">
            <div
              {...getRootProps({ className: 'dropzone' })}
              style={{ paddingTop: 10, paddingBottom: 10, height: 'auto' }}
            >
              <input {...getInputProps()} />
              <span>
                <div className="text-center">
                  <div className="folder" />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <div className="text-dropzone" style={{ marginRight: 15 }}>
                      Drag & Drop Photos
                    </div>
                    <div className="text-dropzone-14"> or</div>
                    <div
                      className="button-blue"
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginLeft: 15,
                      }}
                    >
                      <p> Browse Files </p>
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap" style={{ marginTop: 25 }}>
          <SimpleReactLightbox>
            {images.map((image, index) => {
              if (!image || image === 'null') {
                return null;
              }
              return (
                <SRLWrapper>
                  <div
                    key={String(index)}
                    className="img-wrapper"
                    style={{ cursor: 'pointer' }}
                  >
                    {typeof image === 'string' ? (
                      <div key={String(index)} className="mr-3">
                        <PreviewImage
                          url={`${image}`}
                          onRemove={() => removeImage(index)}
                        />
                      </div>
                    ) : (
                      <div key={String(index)} className="mr-3">
                        <PreviewImage
                          url={URL.createObjectURL(image)}
                          onRemove={() => removeImage(index)}
                        />
                      </div>
                    )}
                  </div>
                </SRLWrapper>
              );
            })}
          </SimpleReactLightbox>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
