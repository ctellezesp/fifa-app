import { db } from '../client/index';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { showError } from '../utils/error.util';
import { IMatch } from '../models/match.model';
import { getTournamentsItems } from './tournaments.service';
import { getTeamsItems } from './teams.service';
import { Team } from '../models/team.model';
import { Tournament } from '../models/tournament.model';

const collectionName = 'matches';

const collectionRef = collection(db, collectionName);

type MapComodin = Map<string, any>;

const getMatchCompletedInfo = (teamsMap: MapComodin, tournamentsMap: MapComodin, match: IMatch): IMatch => ({
  ...match,
  home: teamsMap.get(match.homeId),
  away: teamsMap.get(match.awayId),
  tournament: tournamentsMap.get(match.tournamentId)
})

export const getMatchesItems = async () => {
  try {
    let teamsMap = new Map();
    let tournamentsMap = new Map();
    const tournaments = await getTournamentsItems() as Tournament[];
    const teams = await getTeamsItems() as Team[];
    for (let teamItem of teams) {
			teamsMap.set(teamItem.id as string, teamItem);
		}
    for (let tournamentItem of tournaments) {
			tournamentsMap.set(tournamentItem.id as string, tournamentItem);
		}
    const matchesItemsSnapshot = (await getDocs(collectionRef)).docs;
    const matchesItems: IMatch[] = matchesItemsSnapshot.map(item => getMatchCompletedInfo(
      teamsMap, 
      tournamentsMap, 
      { 
        id: item.ref.id, 
        ...item.data() 
      } as IMatch
    )) as IMatch[];
    return {
      matchesItems,
      teams,
      tournaments
    };
  } catch (err) {
    showError(err);
    return null;
  }
}

export const addMatchItem = async (item: IMatch) => {
  try {
    const { id } = await addDoc(collectionRef, item);
    const itemAdded: IMatch = { id, ...item};
    return itemAdded;
  } catch (err) {
    showError(err);
    return null;
  }
}

export const updateMatchItem = async (itemId: string, item: any) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await updateDoc(itemRef, item);
    return { ...item, id: itemId };
  } catch (err) {
    showError(err);
    return null;
  }
}

export const deleteMatchItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (err) {
    showError(err);
    return null;
  }
}