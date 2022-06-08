import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import TournamentItemComponent from './components/tournaments/tournament-item/tournament-item.component';
import HomeComponent from './components/home/home.component';
import ListTournamentsComponent from './components/tournaments/list-tournaments/list-tournaments.component';
import ListTeamsComponent from './components/teams/list-teams/list-teams.component';
import TeamItemComponent from './components/teams/team-item/team-item.component';

const App: React.FC = (): JSX.Element => {
	return (
		<BrowserRouter>
			<SnackbarProvider maxSnack={3}>
				<Switch>
					<Route path="/" exact component={HomeComponent} />
					<Route
						path="/tournaments"
						exact
						component={ListTournamentsComponent}
					/>
					<Route path="/tournaments/item" component={TournamentItemComponent} />
					<Route path="/teams" exact component={ListTeamsComponent} />
					<Route path="/teams/item" component={TeamItemComponent} />
				</Switch>
			</SnackbarProvider>
		</BrowserRouter>
	);
};

export default App;
