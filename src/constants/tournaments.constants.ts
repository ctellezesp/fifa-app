import { Tournament } from "../models/tournament.model";

export const FAKE_TOURNAMENT: Tournament = {
  id: '',
  name: 'Fake',
  identifier: 'fake',
  season: '2022',
  image: ''
}

export const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: 'mexico_amistosos',
    name: 'Mexico National Team',
    identifier: 'mexico',
    season: '',
    image: 'https://miseleccion.mx/assets/img/snm_nuevo.png?rnd=534375'
  },
  {
    id: 'friendlies',
    name: 'FIFA',
    identifier: 'fifa',
    season: '',
    image: 'https://pngimg.com/uploads/fifa/small/fifa_PNG12.png'
  }
]