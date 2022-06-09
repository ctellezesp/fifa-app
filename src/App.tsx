import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import TournamentItemComponent from './components/tournaments/tournament-item/tournament-item.component';
import HomeComponent from './components/home/home.component';
import ListTournamentsComponent from './components/tournaments/list-tournaments/list-tournaments.component';
import ListTeamsComponent from './components/teams/list-teams/list-teams.component';
import TeamItemComponent from './components/teams/team-item/team-item.component';
import MatchItemComponent from './components/matches/matches-item/matches-item.component';
import ListMatchesComponent from './components/matches/list-matches/list-matches.component';
import DashboardComponent from './components/dashboard/dashboard.component';
import Navbar from './components/navbar/navbar.component';

const App: React.FC = (): JSX.Element => {
	return (
		<BrowserRouter>
			<SnackbarProvider maxSnack={3}>
				<Navbar />
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
					<Route path="/matches" exact component={ListMatchesComponent} />
					<Route path="/matches/item" component={MatchItemComponent} />
					<Route path="/dashboard" component={DashboardComponent} />
				</Switch>
			</SnackbarProvider>
		</BrowserRouter>
	);
};

export default App;
