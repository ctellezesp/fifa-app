import { FC } from 'react';

import { Link } from 'react-router-dom';

const HomeComponent: FC = (): JSX.Element => {
	return (
		<>
			<Link to="/tournaments">Tournaments</Link>
			<Link to="/tournaments/item">Add Tournament</Link>
		</>
	);
};

export default HomeComponent;
