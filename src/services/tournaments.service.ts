import { db } from '../client/index';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { showError } from '../utils/error.util';
import { Tournament } from '../models/tournament.model';
import { DEFAULT_TOURNAMENTS } from '../constants/tournaments.constants';

const collectionName = 'tournaments';

const collectionRef = collection(db, collectionName);

export const getTournamentsItems = async () => {
  try {
    const tournamentsItemsSnapshot = (await getDocs(collectionRef)).docs;
    const tournamentItems: Tournament[] = tournamentsItemsSnapshot.map(item => ({ id: item.ref.id, ...item.data() }))  as Tournament[];
    return [...tournamentItems, ...DEFAULT_TOURNAMENTS];
  } catch (err) {
    showError(err);
    return null;
  }
}

export const addTournamentItem = async (item: Tournament) => {
  try {
    const { id } = await addDoc(collectionRef, item);
    const itemAdded: Tournament = { id, ...item};
    return itemAdded;
  } catch (err) {
    showError(err);
    return null;
  }
}

export const updateTournamentItem = async (itemId: string, item: any) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await updateDoc(itemRef, item);
    return { ...item, id: itemId };
  } catch (err) {
    showError(err);
    return null;
  }
}

export const deleteTournamentItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (err) {
    showError(err);
    return null;
  }
}