import { CareerTrack } from '../entity/career-track.entity';

export class FindAllCareerTrackResponse {

  id: string;
  area: string;
  description: string;
  image: string;
  index: number;
  subscribed: boolean;


  static convertFindAllCareerTrackDomainToResponse(career: CareerTrack): FindAllCareerTrackResponse {
    return {
      id: career.id,
      area: career.area,
      description: career.description,
      image: career.image,
      index: career.index,
      subscribed: career['subscribed'] || false,
    };
  }
}