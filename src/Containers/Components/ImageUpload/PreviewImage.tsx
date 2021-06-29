import React from 'react';

import '../../../Containers/Job/JobCreate.scss';
interface Props {
	url: string;
	onRemove?: () => void;
}

const PreviewImage: React.FC<Props> = ({ url, onRemove }) => {
	return (
		<div className="thumb-wrapper" style={{cursor: 'pointer'}}>
			<div className="thumb">
				{onRemove && <div className="delete" onClick={onRemove} />}
				<img src={url} alt=""/>
			</div>
		</div>
	);
};

export default PreviewImage;
