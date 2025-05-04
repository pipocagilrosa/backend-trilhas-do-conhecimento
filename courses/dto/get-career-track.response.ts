import { CareerTrack } from '../entity/career-track.entity';

export class GetCareerTrackResponse {

  id: string;
  title: string;
  area: string;
  description: string;
  subTitle: string;
  content: string;
  image: string;
  contentTitle: string;
  contentSubtitle: string;
  index: number;

  static convertCareerTrackDomainToResponse(career: CareerTrack): GetCareerTrackResponse {
    return {
      id: career.id,
      title: career.title,
      area: career.area,
      description: career.description,
      subTitle: career.subTitle,
      content: career.content,
      image: career.image,
      contentTitle: career.contentTitle,
      contentSubtitle: career.contentSubtitle,
      index: career.index,
    };
  }
}