import { db } from '../client/index';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { showError } from '../utils/error.util';
import { Team } from '../models/team.model';

const collectionName = 'countries';

const collectionRef = collection(db, collectionName);

export const getTeamsItems = async () => {
  try {
    const teamsItemsSnapshot = (await getDocs(collectionRef)).docs;
    const teamstItems: Team[] = teamsItemsSnapshot.map(item => ({ id: item.ref.id, ...item.data() })) as Team[];
    return teamstItems;
  } catch (err) {
    showError(err);
    return null;
  }
}

export const addTeamItem = async (item: Team) => {
  try {
    const { id } = await addDoc(collectionRef, item);
    const itemAdded: Team = { id, ...item};
    return itemAdded;
  } catch (err) {
    showError(err);
    return null;
  }
}

export const updateTeamItem = async (itemId: string, item: any) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await updateDoc(itemRef, item);
    return { ...item, id: itemId };
  } catch (err) {
    showError(err);
    return null;
  }
}

export const deleteTeamItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (err) {
    showError(err);
    return null;
  }
}