import React from 'react';
import './Gallery.scss';

interface Props {
	images?: string[];
}

const Gallery: React.FC<Props> = ({ images }) => {

	return (
		<div className="gallery">
			{images.map((image, idx) => (
				<div key={String(idx)} className="img-wrapper">
					<img src={`${image}`} className="img" alt=""/>
				</div>
			))}
		</div>
	);
};

export default Gallery;
